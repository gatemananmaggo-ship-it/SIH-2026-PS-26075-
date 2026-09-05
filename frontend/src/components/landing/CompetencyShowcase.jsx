import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, BrainCircuit, Target, CheckCircle2, Shield, UserCheck, ChevronRight, Zap } from 'lucide-react';

export const CompetencyShowcase = () => {
  const { taxonomies, trainerCandidates, switchRole } = useApp();
  const [activeDomainIndex, setActiveDomainIndex] = useState(0);

  const currentDomain = taxonomies[activeDomainIndex] || taxonomies[0];
  const matchedTrainers = trainerCandidates
    .map(t => ({ ...t, score: t.matchScoreByDomain?.[currentDomain.domain] || 50 }))
    .sort((a, b) => b.score - a.score);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Organizational Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Intelligent Competency Mapping Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
          Automatically maps MoES domain skill gaps to verified scientist trainers, measuring experience, subject credentials, and past student feedback.
        </p>
      </div>

      {/* Interactive Mapping Simulation Box */}
      <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Domain Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          {taxonomies.map((tax, idx) => (
            <button
              key={tax.code}
              onClick={() => setActiveDomainIndex(idx)}
              className={`p-3 text-left transition text-xs font-bold border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${
                activeDomainIndex === idx
                  ? 'bg-white dark:bg-slate-800 text-moes-600 dark:text-sky-300 border-b-2 border-b-moes-500 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <span className="text-[10px] text-slate-400 block font-mono">{tax.code}</span>
              <span className="line-clamp-1">{tax.domain}</span>
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Skill Taxonomy Matrix */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-moes-600 dark:text-sky-400 font-bold">{currentDomain.code}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{currentDomain.domain}</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-bold">
                {currentDomain.criticality}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Required Minimum Faculty Experience: <strong>{currentDomain.requiredExperienceYears} Years in MoES/IMD</strong>
            </p>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Core Sub-Competencies Required:</p>
              <div className="flex flex-wrap gap-1.5">
                {currentDomain.subSkills.map((sk, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{sk}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AI Matched Faculty Recommendation */}
          <div className="lg:col-span-6 space-y-3 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Ranked Faculty Matches for {currentDomain.domain}</span>
              </span>
              <span className="text-[10px] text-slate-500">Live Scoring</span>
            </div>

            <div className="space-y-2.5">
              {matchedTrainers.slice(0, 2).map((tr, index) => (
                <div key={tr.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      index === 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ring-2 ring-amber-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-700'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tr.name}</h4>
                      <p className="text-[10px] text-slate-500">{tr.organization} • {tr.experienceYears} Yrs Exp</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {tr.score}% Match
                    </div>
                    <span className="text-[9px] text-slate-400">{tr.availability}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => switchRole('admin')}
                className="text-xs font-bold text-moes-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Open Full Competency Mapping Tool in Admin Console</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
