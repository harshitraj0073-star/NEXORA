import React, { useEffect, useRef } from 'react';

/**
 * AstraBackground
 * High-performance HTML5 Canvas Particle Starfield + Dynamic Moving Nebula Background
 * Features:
 * - 220 softly glowing cosmic particles with faster random drift velocities
 * - Colors: #ffffff, #60a5fa, #93c5fd, #38bdf8, #c084fc
 * - 4 dynamic randomly moving nebula gradients (Cyan, Purple, Blue, Teal)
 * - Sine-based opacity pulsing for organic star twinkling
 * - Soft halo glow blur around particles
 * - Boundary wrapping and bounce physics
 * - Window resize listener + requestAnimationFrame cleanup
 */

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  baseOpacity: number;
  pulseSpeed: number;
  phase: number;
  shadowBlur: number;
}

interface NebulaOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const PARTICLE_COLORS = ['#ffffff', '#60a5fa', '#93c5fd', '#38bdf8', '#c084fc'];
const PARTICLE_COUNT = 220;

export const AstraBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const particles: Particle[] = [];

    // 4 Dynamic randomly moving nebula gradient centers
    const nebulaOrbs: NebulaOrb[] = [
      { x: 0, y: 0, vx: 0.85, vy: 0.65, radius: 450, color: 'rgba(56, 189, 248, 0.22)' },   // Sky / Cyan
      { x: 0, y: 0, vx: -0.75, vy: -0.8, radius: 520, color: 'rgba(192, 132, 252, 0.20)' },  // Purple / Violet
      { x: 0, y: 0, vx: 0.7, vy: -0.65, radius: 480, color: 'rgba(96, 165, 250, 0.16)' },   // Deep Blue
      { x: 0, y: 0, vx: -0.6, vy: 0.75, radius: 420, color: 'rgba(45, 212, 191, 0.14)' },   // Teal / Emerald
    ];

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      nebulaOrbs[0].radius = Math.max(width, height) * 0.42;
      nebulaOrbs[1].radius = Math.max(width, height) * 0.46;
      nebulaOrbs[2].radius = Math.max(width, height) * 0.40;
      nebulaOrbs[3].radius = Math.max(width, height) * 0.36;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial positions for nebula orbs
    nebulaOrbs[0].x = width * 0.25; nebulaOrbs[0].y = height * 0.3;
    nebulaOrbs[1].x = width * 0.75; nebulaOrbs[1].y = height * 0.7;
    nebulaOrbs[2].x = width * 0.5;  nebulaOrbs[2].y = height * 0.5;
    nebulaOrbs[3].x = width * 0.8;  nebulaOrbs[3].y = height * 0.25;

    // Initialize 220 particles with faster drift velocities
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = Math.random() * 1.9 + 0.7;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        vx: (Math.random() - 0.5) * 0.85, // Faster drift
        vy: (Math.random() - 0.5) * 0.85,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        baseOpacity: Math.random() * 0.6 + 0.35,
        pulseSpeed: Math.random() * 0.004 + 0.0025,
        phase: Math.random() * Math.PI * 2,
        shadowBlur: radius * (Math.random() * 2.5 + 2.5),
      });
    }

    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw dynamic randomly moving nebula gradients
      for (let i = 0; i < nebulaOrbs.length; i++) {
        const orb = nebulaOrbs[i];
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Random subtle direction shift
        orb.vx += (Math.random() - 0.5) * 0.035;
        orb.vy += (Math.random() - 0.5) * 0.035;

        // Clamp velocity
        orb.vx = Math.max(-1.1, Math.min(1.1, orb.vx));
        orb.vy = Math.max(-1.1, Math.min(1.1, orb.vy));

        // Bounce with margin
        const pad = 80;
        if (orb.x < -pad) { orb.x = -pad; orb.vx = Math.abs(orb.vx); }
        else if (orb.x > width + pad) { orb.x = width + pad; orb.vx = -Math.abs(orb.vx); }

        if (orb.y < -pad) { orb.y = -pad; orb.vy = Math.abs(orb.vy); }
        else if (orb.y > height + pad) { orb.y = height + pad; orb.vy = -Math.abs(orb.vy); }

        // Render radial gradient
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw glowing, twinkling stars with faster drift
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Subtle organic random steer
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        p.vx = Math.max(-1.1, Math.min(1.1, p.vx));
        p.vy = Math.max(-1.1, Math.min(1.1, p.vy));

        // Boundary wrap
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        const currentOpacity = Math.max(
          0.15,
          Math.min(1, p.baseOpacity * (0.6 + 0.4 * Math.sin(elapsed * p.pulseSpeed + p.phase)))
        );

        ctx.save();
        ctx.globalAlpha = currentOpacity;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.shadowBlur;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#06080e] overflow-hidden">
      {/* HTML5 Canvas Particle Starfield + Moving Nebula */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
