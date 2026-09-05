import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BrainCircuit, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  Star, 
  UserCheck, 
  Award, 
  Building, 
  Send, 
  Sliders,
  FileSpreadsheet,
  Zap,
  ArrowRight
} from 'lucide-react';

export const CompetencyMapping = () => {
  const { taxonomies, trainerCandidates, showToast } = useApp();
  const [selectedDomain, setSelectedDomain] = useState(taxonomies[0]?.domain || 'Radar Meteorology');
  const [minExperience, setMinExperience] = useState(5);
  const [assignedTrainers, setAssignedTrainers] = useState({});

  const activeTaxonomy = taxonomies.find(t => t.domain === selectedDomain) || taxonomies[0];

  // Calculate matching scores
  const rankedCandidates = trainerCandidates
    .map(candidate => {
      const baseMatch = candidate.matchScoreByDomain?.[selectedDomain] || 60;
      const expBonus = Math.min(candidate.experienceYears * 1.5, 20);
      const ratingBonus = (candidate.rating || 4.5) * 4;
      const totalScore = Math.min(Math.round((baseMatch * 0.5) + expBonus + ratingBonus), 99);

      return {
        ...candidate,
        computedMatchScore: totalScore,
        qualifiesExp: candidate.experienceYears >= minExperience
      };
    })
    .sort((a, b) => b.computedMatchScore - a.computedMatchScore);

  const handleAssignTrainer = (candidate) => {
    setAssignedTrainers({
      ...assignedTrainers,
      [selectedDomain]: candidate.name
    });
    showToast(`Assigned ${candidate.name} as Lead Faculty for "${selectedDomain}"!`, "success");
  };

  const handleExportMapping = () => {
    showToast("Competency mapping matrix exported to PDF/CSV!", "success");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Smart MoES Competency Identification Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI-Assisted Trainer & Faculty Competency Mapping
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Algorithmically match specialized meteorological & oceanographic subject gaps with certified instructors based on skill overlap, experience, and past trainee ratings.
            </p>
          </div>

          <button
            onClick={handleExportMapping}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Mapping Matrix</span>
          </button>
        </div>
      </div>

      {/* Control Panel: Select Subject / Filters */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-500" />
          <span>Define Subject Gap & Faculty Qualification Criteria</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select MoES Specialized Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
            >
              {taxonomies.map(tax => (
                <option key={tax.code} value={tax.domain}>{tax.domain} ({tax.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Minimum Required Experience: <span className="text-emerald-600 font-bold">{minExperience} Years</span>
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer mt-2"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Domain Criticality Level
            </label>
            <div className="px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between">
              <span>{activeTaxonomy?.criticality}</span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Required Sub-Competencies Tags */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Key Required Competency Skillsets for {activeTaxonomy?.domain}:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {activeTaxonomy?.subSkills?.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-medium"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Ranked Candidate Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Ranked Trainer Matches for "{selectedDomain}"</span>
          </h3>

          {assignedTrainers[selectedDomain] && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-300">
              Active Lead Faculty: <strong>{assignedTrainers[selectedDomain]}</strong>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rankedCandidates.map((candidate, idx) => {
            const isAssigned = assignedTrainers[selectedDomain] === candidate.name;

            return (
              <div
                key={candidate.id}
                className={`glass-card rounded-2xl p-6 border shadow-md flex flex-col justify-between space-y-4 transition ${
                  isAssigned
                    ? 'border-emerald-500 bg-emerald-50/10 ring-2 ring-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        #{idx + 1}
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{candidate.name}</span>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-slate-500">{candidate.rating}</span>
                        </h4>
                        <p className="text-xs text-indigo-600 dark:text-sky-400 font-semibold">{candidate.role}</p>
                        <p className="text-[11px] text-slate-500">{candidate.organization}</p>
                      </div>
                    </div>

                    {/* Computed Match Score Badge */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">AI Match</span>
                      <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                        {candidate.computedMatchScore}%
                      </div>
                    </div>
                  </div>

                  {/* Criteria Scores */}
                  <div className="grid grid-cols-3 gap-2 pt-4 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Experience</span>
                      <strong className="text-slate-900 dark:text-white">{candidate.experienceYears} Years</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Workload</span>
                      <strong className="text-slate-900 dark:text-white">{candidate.activeBatches} Batches</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Status</span>
                      <strong className="text-emerald-600 truncate block text-[11px]">{candidate.availability}</strong>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="pt-3">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills?.slice(0, 3).map((sk, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assignment Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    WMO-1083 Certified Faculty
                  </span>

                  {isAssigned ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Currently Assigned</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAssignTrainer(candidate)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Assign as Lead Faculty</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
