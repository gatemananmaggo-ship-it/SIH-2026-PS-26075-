import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = "Loading data...", size = "default", fullPage = false }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-10 h-10"
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-500 dark:text-slate-400">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.default} animate-spin text-moes-600 dark:text-sky-400`} />
      {text && <p className="text-xs font-semibold tracking-wide">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export const SkeletonCard = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
