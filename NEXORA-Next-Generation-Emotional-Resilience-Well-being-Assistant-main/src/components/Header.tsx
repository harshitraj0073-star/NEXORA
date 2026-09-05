import React from 'react';
import { useStore } from '../hooks/useStore';
import { useDarkMode } from '../hooks/useDarkMode';
import { LogOut, Globe, Shield, User, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { state, setLanguage, setRole } = useStore();
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <header className="bg-slate-950/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Shield className="w-8 h-8 text-sky-400" />
        <div>
          <h1 className="font-bold text-white hidden sm:block leading-tight tracking-wide">NEXORA</h1>
          <p className="text-xs text-sky-300/70 hidden sm:block">Support System</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {state.role === 'victim' && (
          <div className="bg-teal-500/10 border border-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Shield className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Secure Session</span>
          </div>
        )}

        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer">
            <Globe className="w-5 h-5 text-sky-400" />
            <span className="text-sm font-medium uppercase">{state.language}</span>
          </button>
          <div className="absolute right-0 mt-2 w-32 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 hidden group-hover:block z-50 overflow-hidden shadow-2xl">
            <div className="py-1">
              <button onClick={() => setLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-white/10 cursor-pointer">English</button>
              <button onClick={() => setLanguage('hi')} className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-white/10 cursor-pointer">हिंदी</button>
              <button onClick={() => setLanguage('bn')} className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-white/10 cursor-pointer">বাংলা</button>
            </div>
          </div>
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggle}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {isDark
            ? <Sun className="w-5 h-5 text-amber-400" />
            : <Moon className="w-5 h-5 text-sky-300" />
          }
        </button>
        
        {state.role && (
          <div className="flex items-center gap-3 border-l border-white/10 pl-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-200">
              <User className="w-5 h-5" />
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-md hover:bg-rose-500/10 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
