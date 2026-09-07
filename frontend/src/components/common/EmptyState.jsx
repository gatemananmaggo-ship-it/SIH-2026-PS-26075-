import React from 'react';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No data found",
  description = "There are no records matching the current criteria.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="glass-card rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-moes-50 dark:bg-moes-950/60 text-moes-600 dark:text-sky-400 flex items-center justify-center mx-auto border border-moes-200 dark:border-moes-800/60">
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-sm transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
