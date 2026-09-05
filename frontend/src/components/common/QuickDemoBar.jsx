import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, UserCheck, GraduationCap, Eye, Sparkles } from 'lucide-react';

export const QuickDemoBar = () => {
  const { currentRole, switchRole, currentUser } = useApp();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white text-xs border-b border-moes-500/30 px-3 py-1.5 shadow-inner sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-moes-600/80 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase text-sky-100">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            SIH 2026 Evaluator Demo Switcher:
          </span>
          <span className="hidden sm:inline text-slate-300">
            Current Active Role: <strong className="text-amber-400 capitalize">{currentRole}</strong> 
            {currentUser && ` (${currentUser.name})`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => switchRole('trainee')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all font-medium ${
              currentRole === 'trainee'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
            title="Switch to Trainee View (Dr. Ananya Sharma)"
          >
            <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
            <span>Trainee Demo</span>
          </button>

          <button
            onClick={() => switchRole('trainer')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all font-medium ${
              currentRole === 'trainer'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
            title="Switch to Trainer View (Dr. Rajesh K. Verma)"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span>Trainer Demo</span>
          </button>

          <button
            onClick={() => switchRole('admin')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all font-medium ${
              currentRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
            title="Switch to Admin Console (Shri Arvind Saxena)"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-300" />
            <span>Admin Demo</span>
          </button>

          <button
            onClick={() => switchRole('guest')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all font-medium ${
              currentRole === 'guest'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
            title="Browse as Public Visitor / Guest"
          >
            <Eye className="w-3.5 h-3.5 text-amber-300" />
            <span>Public Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
