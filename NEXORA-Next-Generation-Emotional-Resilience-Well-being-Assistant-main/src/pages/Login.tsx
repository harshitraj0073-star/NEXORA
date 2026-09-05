import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { useTranslation } from '../utils/i18n';
import { Shield, ShieldAlert, Users, Settings, Sun, Moon, ArrowRight, Heart, Brain, Lock } from 'lucide-react';
import { AIChatbot } from '../components/AIChatbot';
import { useDarkMode } from '../hooks/useDarkMode';

const SLIDES = [
  {
    title: 'Protecting Every Voice',
    subtitle: 'AI-powered monitoring to ensure every victim receives timely support and care throughout their journey.',
    gradient: 'from-blue-900 via-indigo-900 to-slate-900',
    accent: '#6366f1',
  },
  {
    title: 'Wellbeing at the Core',
    subtitle: 'Continuous distress monitoring with smart alerts ensures no one falls through the cracks of the system.',
    gradient: 'from-slate-900 via-blue-950 to-indigo-900',
    accent: '#3b82f6',
  },
  {
    title: 'Human Support, AI Speed',
    subtitle: 'Counsellors and administrators get real-time insights, helping them prioritize cases that need urgent attention.',
    gradient: 'from-indigo-950 via-slate-900 to-blue-950',
    accent: '#8b5cf6',
  },
];

export const Login: React.FC = () => {
  const { setRole, state } = useStore();
  const t = useTranslation(state.language);
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeRole, setActiveRole] = useState<'victim' | 'counsellor' | 'admin' | null>(null);

  const handleLogin = (role: 'victim' | 'counsellor' | 'admin') => {
    setActiveRole(role);
    setTimeout(() => {
      setRole(role);
      if (role === 'victim') {
        navigate('/victim');
      } else {
        navigate('/dashboard');
      }
    }, 400);
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggle}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="fixed top-5 right-5 z-50 p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Main Card */}
      <div className="relative w-full max-w-5xl bg-slate-950/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex min-h-[600px]">

        {/* LEFT PANEL — Image / Branding */}
        <div className={`hidden lg:flex lg:w-[45%] relative flex-col justify-between p-10 bg-gradient-to-br ${slide.gradient} transition-all duration-700`}>
          {/* Mesh overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.15) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>

          {/* Abstract orbs */}
          <div className="absolute top-20 right-10 w-48 h-48 rounded-full blur-3xl opacity-30" style={{ backgroundColor: slide.accent }}></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full blur-2xl opacity-20 bg-blue-400"></div>

          {/* Top: Logo */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-wide">NEXORA</span>
            </div>
            <span className="text-white/40 text-xs border border-white/10 px-3 py-1 rounded-full">MVP Demo</span>
          </div>

          {/* Middle: Visual elements */}
          <div className="relative z-10 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Heart, label: 'Wellbeing', val: '94%', color: 'emerald' },
                { icon: Brain, label: 'AI Insights', val: 'Live', color: 'purple' },
                { icon: Shield, label: 'Protected', val: '20 cases', color: 'blue' },
                { icon: Lock, label: 'Secure', val: 'E2E', color: 'indigo' },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3">
                  <div className={`w-7 h-7 rounded-lg bg-${color}-500/20 flex items-center justify-center mb-2`}>
                    <Icon className={`w-4 h-4 text-${color}-400`} />
                  </div>
                  <p className="text-white/50 text-xs">{label}</p>
                  <p className="text-white font-semibold text-sm">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Slide text + indicators */}
          <div className="relative z-10">
            <p className="text-2xl font-bold text-white leading-snug mb-2 transition-all duration-500">{slide.title}</p>
            <p className="text-white/60 text-sm leading-relaxed transition-all duration-500">{slide.subtitle}</p>
            <div className="flex gap-2 mt-5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Login Form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-12">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">NEXORA</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/50 text-sm">Select your role to access the platform</p>
          </div>

          {/* Role Cards */}
          <div className="space-y-3 mb-8">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Demo Access — Select Role</p>

            {/* Victim */}
            <button
              onClick={() => handleLogin('victim')}
              disabled={activeRole !== null}
              className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left
                ${activeRole === 'victim'
                  ? 'bg-emerald-500/20 border-emerald-400/50 scale-[0.99]'
                  : 'bg-white/5 border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:scale-[1.01]'
                }`}
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">Victim / Complainant</p>
                <p className="text-white/40 text-xs mt-0.5">Wellbeing check-in & case status</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Counsellor */}
            <button
              onClick={() => handleLogin('counsellor')}
              disabled={activeRole !== null}
              className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left
                ${activeRole === 'counsellor'
                  ? 'bg-indigo-500/20 border-indigo-400/50 scale-[0.99]'
                  : 'bg-white/5 border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/40 hover:scale-[1.01]'
                }`}
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">Counsellor</p>
                <p className="text-white/40 text-xs mt-0.5">Case monitoring & intervention management</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Admin */}
            <button
              onClick={() => handleLogin('admin')}
              disabled={activeRole !== null}
              className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left
                ${activeRole === 'admin'
                  ? 'bg-purple-500/20 border-purple-400/50 scale-[0.99]'
                  : 'bg-white/5 border-white/10 hover:bg-purple-500/10 hover:border-purple-500/40 hover:scale-[1.01]'
                }`}
            >
              <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Settings className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">Administrator</p>
                <p className="text-white/40 text-xs mt-0.5">State-level analytics & oversight</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 pt-6">
            <p className="text-white/25 text-xs text-center leading-relaxed">
              {t('login.privacyNotice')}
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="flex items-center gap-1.5 text-xs text-white/30">
                <Lock className="w-3 h-3" /> End-to-end encrypted
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="text-xs text-white/30">Govt. of India Portal</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="text-xs text-white/30">NHAA Integrated</span>
            </div>
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
};
