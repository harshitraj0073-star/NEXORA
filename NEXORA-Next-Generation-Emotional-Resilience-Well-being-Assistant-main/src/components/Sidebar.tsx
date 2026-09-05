import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { 
  LayoutDashboard, 
  Users, 
  BellRing, 
  Activity, 
  FileText, 
  Settings,
  HeartPulse,
  Bot
} from 'lucide-react';
import { cn } from '../utils/cn';

export const Sidebar: React.FC = () => {
  const { state } = useStore();
  const isAdmin = state.role === 'admin';

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Bot, label: 'NEXORA AI', path: '/nexora-ai' },
    { icon: Users, label: 'Cases', path: '/cases' },
    { icon: BellRing, label: 'Alerts', path: '/alerts', badge: 3 },
    { icon: Activity, label: isAdmin ? 'Analytics' : 'Wellbeing Trends', path: '/analytics' },
    { icon: FileText, label: 'Reports', path: '/reports' },
  ];

  if (isAdmin) {
    navItems.push({ icon: Settings, label: 'Settings', path: '/settings' });
  }

  return (
    <aside className="w-64 bg-slate-950/40 backdrop-blur-md text-slate-300 border-r border-white/5 min-h-screen hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 text-white mb-8">
          <HeartPulse className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg tracking-tight">NEXORA Monitor</span>
        </div>
        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">
          {isAdmin ? 'Administrator' : 'Counsellor'} Menu
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group",
                isActive 
                  ? "bg-slate-800 text-white font-medium" 
                  : "hover:bg-slate-800/50 hover:text-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5",
                  // eslint-disable-next-line
                  // @ts-ignore
                  // Active state color logic might go here if we had access to isActive directly in class string
                )} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
