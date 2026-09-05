import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, AlertTriangle, ChevronRight } from 'lucide-react';

export const NotificationTicker = () => {
  const { announcements, setCurrentView } = useApp();
  const tickerItems = announcements.slice(0, 5);

  return (
    <div className="bg-moes-900 text-slate-100 text-xs py-1.5 px-4 border-b border-moes-700/50 flex items-center overflow-hidden">
      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400 shrink-0 pr-3 border-r border-moes-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>MoES Broadcast:</span>
      </div>

      <div className="flex-1 overflow-hidden relative whitespace-nowrap ml-3">
        <div className="animate-ticker inline-flex items-center gap-8 text-slate-200">
          {tickerItems.map((item, index) => (
            <span
              key={item.id || index}
              className="inline-flex items-center gap-2 cursor-pointer hover:text-amber-300 transition-colors"
              onClick={() => setCurrentView('landing')}
            >
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                item.urgent ? 'bg-red-500/80 text-white' : 'bg-moes-700 text-sky-200'
              }`}>
                {item.category}
              </span>
              <span>{item.title}</span>
              <span className="text-slate-500">•</span>
            </span>
          ))}
          {/* Duplicate set for seamless looping */}
          {tickerItems.map((item, index) => (
            <span
              key={`dup-${item.id || index}`}
              className="inline-flex items-center gap-2 cursor-pointer hover:text-amber-300 transition-colors"
              onClick={() => setCurrentView('landing')}
            >
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                item.urgent ? 'bg-red-500/80 text-white' : 'bg-moes-700 text-sky-200'
              }`}>
                {item.category}
              </span>
              <span>{item.title}</span>
              <span className="text-slate-500">•</span>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => setCurrentView('landing')}
        className="hidden md:flex items-center gap-1 text-[11px] text-sky-300 hover:text-white font-medium pl-3 border-l border-moes-700 shrink-0"
      >
        <span>All Circulars</span>
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};
