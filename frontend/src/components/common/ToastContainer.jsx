import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border backdrop-blur-md text-xs font-medium transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100'
                : isWarning
                ? 'bg-amber-900/90 border-amber-500/50 text-amber-100'
                : 'bg-slate-900/90 border-moes-500/50 text-sky-100'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : isWarning ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="leading-snug">{toast.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
