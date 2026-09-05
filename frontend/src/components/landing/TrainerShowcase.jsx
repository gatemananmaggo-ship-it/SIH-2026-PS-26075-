import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Star, Award, BookOpen, ShieldCheck } from 'lucide-react';

export const TrainerShowcase = () => {
  const { users } = useApp();
  const trainers = users.filter(u => u.role === 'trainer' && u.status === 'approved');

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty & Mentorship Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Leading MoES Scientists & Domain Instructors
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Certified senior meteorologists and oceanographers heading operational capacity building programs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainers.map(trainer => (
          <div
            key={trainer.id}
            className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-5 items-start shadow-md hover:shadow-lg transition"
          >
            <img
              src={trainer.avatar}
              alt={trainer.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-moes-500 shadow-md shrink-0"
            />

            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{trainer.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" title="Verified MoES Faculty" />
                  </h3>
                  <p className="text-xs text-moes-600 dark:text-sky-400 font-semibold">{trainer.designation}</p>
                  <p className="text-[11px] text-slate-500">{trainer.organization}</p>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800/60 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{trainer.rating || 4.9}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {trainer.bio}
              </p>

              <div className="pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {trainer.specializations?.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
