import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, AlertTriangle, Trophy, Sparkles, Calendar, User, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';

export const AnnouncementsSection = () => {
  const { announcements, currentRole, switchRole } = useApp();
  const [selectedAnn, setSelectedAnn] = useState(null);

  return (
    <section className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Real-Time Broadcast Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Announcements & MoES Achievements
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Live updates published directly by the Ministry of Earth Sciences Training Cell.
            </p>
          </div>

          {currentRole === 'admin' && (
            <button
              onClick={() => switchRole('admin')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin: Publish Announcement</span>
            </button>
          )}
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {announcements.map((item) => {
            const isUrgent = item.urgent;
            const isAchievement = item.category === 'Achievement';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedAnn(item)}
                className={`glass-card p-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 border relative overflow-hidden group ${
                  isUrgent
                    ? 'border-red-300 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20'
                    : isAchievement
                    ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Ribbon */}
                {isUrgent && (
                  <div className="absolute top-0 right-0">
                    <span className="bg-red-600 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                      Urgent Advisory
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                    isUrgent
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                      : isAchievement
                      ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
                      : 'bg-moes-100 dark:bg-moes-900/50 text-moes-700 dark:text-sky-300'
                  }`}>
                    {item.category}
                  </span>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-moes-600 dark:group-hover:text-sky-400 transition leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{item.publishedBy}</span>
                  </span>
                  <span className="font-bold text-moes-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{item.linkText || 'Read Details'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Detail Dialog Modal */}
      {selectedAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-moes-100 dark:bg-moes-900/50 text-moes-700 dark:text-sky-300">
                {selectedAnn.category}
              </span>
              <span className="text-xs text-slate-500">{selectedAnn.date}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {selectedAnn.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {selectedAnn.summary}
            </p>

            <div className="text-xs text-slate-500">
              Published by: <strong>{selectedAnn.publishedBy}</strong>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedAnn(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 transition"
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
