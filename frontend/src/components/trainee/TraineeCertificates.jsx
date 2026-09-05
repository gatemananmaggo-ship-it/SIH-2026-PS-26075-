import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, QrCode, ShieldCheck, Printer, Download, Eye, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export const TraineeCertificates = () => {
  const { currentUser, setActiveCertificate, courses, setCurrentView, setActiveCourseId } = useApp();
  const certificates = currentUser?.certificates || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>National Competency Credentials</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              My Certifications & Earned Badges
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Official verifiable certificates endorsed under the Ministry of Earth Sciences Capacity Building Commission framework.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500">Earned Credentials:</span>
              <p className="text-2xl font-black text-moes-600 dark:text-sky-400">{certificates.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <Award className="w-16 h-16 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No Competency Certificates Earned Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Complete all modules of an enrolled course and score 70% or higher in the subject MCQ assessment to receive your official Gov of India e-Certificate.
          </p>
          <button
            onClick={() => setCurrentView('trainee')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-sm transition"
          >
            Explore Enrolled Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-amber-400/60 transition group"
            >
              {/* Corner Gold Ribbon */}
              <div className="absolute top-0 right-0">
                <span className="bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                  {cert.grade}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block font-bold">{cert.id}</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Digitally Signed & Verified
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-moes-600 dark:group-hover:text-sky-400 transition leading-snug">
                  {cert.courseTitle}
                </h3>

                <div className="grid grid-cols-2 gap-2 pt-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Assessment Score</span>
                    <strong className="text-emerald-600 font-bold">{cert.score}%</strong>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Issue Date</span>
                    <strong className="text-slate-800 dark:text-slate-200">{cert.issueDate}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                  Hash: {cert.verificationHash}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveCertificate(cert)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-sm transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View & Print</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
