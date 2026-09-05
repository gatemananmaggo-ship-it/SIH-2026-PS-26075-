import React from 'react';
import { Users, BookCheck, MapPin, Award, Activity, TrendingUp } from 'lucide-react';

export const StatCounter = () => {
  const stats = [
    {
      id: 'stat-1',
      label: 'Scientists & Officers Trained',
      value: '9,840+',
      subtext: 'Across IMD & MoES Wings',
      icon: Users,
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/10'
    },
    {
      id: 'stat-2',
      label: 'Specialized Courses & Modules',
      value: '142+',
      subtext: 'Radar, NWP, Satellite, Ocean',
      icon: BookCheck,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      id: 'stat-3',
      label: 'Connected Regional Centers',
      value: '28',
      subtext: 'RMCs, DWR Stations & Labs',
      icon: MapPin,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      id: 'stat-4',
      label: 'Competency Passing Rate',
      value: '94.6%',
      subtext: 'WMO Standard Benchmark',
      icon: Award,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    }
  ];

  return (
    <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="glass-card rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>Active</span>
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </p>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                {stat.label}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {stat.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
