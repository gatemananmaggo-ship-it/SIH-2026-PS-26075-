import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, CheckCircle, ShieldCheck, Award, QrCode, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CertificateModal = () => {
  const { activeCertificate, setActiveCertificate, currentUser } = useApp();

  useEffect(() => {
    if (activeCertificate) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // silent fallback if canvas-confetti is not loaded
      }
    }
  }, [activeCertificate]);

  if (!activeCertificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-moes-700 dark:text-sky-400 font-bold text-sm">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Official Certificate of Competence & Completion</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-moes-600 hover:bg-moes-700 text-white shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={() => setActiveCertificate(null)}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Render Area (Print Target) */}
        <div className="p-8 sm:p-12 overflow-x-auto bg-slate-50 dark:bg-slate-950 flex justify-center">
          <div 
            id="printable-certificate"
            className="w-full max-w-3xl bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-lg border-[10px] border-double border-moes-800 relative overflow-hidden font-serif"
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600"></div>

            {/* Subtle Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="w-80 h-80 rounded-full border-[16px] border-moes-900 flex items-center justify-center">
                <span className="text-6xl font-black">MoES</span>
              </div>
            </div>

            {/* Header / Emblem */}
            <div className="text-center space-y-1 relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-moes-800 to-navy-900 text-amber-400 mb-2 shadow">
                <Award className="w-8 h-8" />
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-600 font-sans font-bold">
                Government of India • Ministry of Earth Sciences
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-moes-950 font-serif">
                CAPACITY CONNECT
              </h1>
              <p className="text-xs text-moes-700 italic">
                National Digital Capacity Building & Competency Development Portal
              </p>
            </div>

            {/* Certificate Body */}
            <div className="my-8 text-center space-y-4 relative z-10">
              <p className="text-sm uppercase tracking-widest text-slate-500 font-sans">
                This is to certify that
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-moes-900 border-b-2 border-amber-500/60 pb-2 inline-block px-8 font-sans">
                {currentUser?.name || "Dr. Ananya Sharma"}
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                {currentUser?.designation || "Meteorologist Grade-I"}, {currentUser?.organization || "India Meteorological Department (IMD)"}
              </p>

              <p className="text-sm text-slate-700 leading-relaxed max-w-xl mx-auto pt-2">
                has successfully completed the specialized professional training curriculum and demonstrated advanced competency in
              </p>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 bg-sky-50 py-2.5 px-4 rounded-lg border border-sky-200 inline-block font-sans max-w-2xl">
                {activeCertificate.courseTitle}
              </h3>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-sans">
                <div className="bg-slate-100 px-3 py-1.5 rounded border border-slate-300">
                  <span className="text-slate-500">Evaluation Score:</span> <strong className="text-emerald-700">{activeCertificate.score}%</strong>
                </div>
                <div className="bg-slate-100 px-3 py-1.5 rounded border border-slate-300">
                  <span className="text-slate-500">Grade:</span> <strong className="text-moes-800">{activeCertificate.grade}</strong>
                </div>
                <div className="bg-slate-100 px-3 py-1.5 rounded border border-slate-300">
                  <span className="text-slate-500">Date of Issue:</span> <strong className="text-slate-800">{activeCertificate.issueDate}</strong>
                </div>
              </div>
            </div>

            {/* Footer / Signatures & QR */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-end justify-between gap-6 relative z-10 font-sans">
              
              {/* QR Verification */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-900 text-white p-1 rounded flex items-center justify-center shadow">
                  <QrCode className="w-12 h-12 text-slate-100" />
                </div>
                <div className="text-[10px] text-slate-600 space-y-0.5">
                  <p className="font-mono font-bold text-slate-800">ID: {activeCertificate.id}</p>
                  <p className="font-mono text-[9px] text-slate-500 truncate max-w-[140px]">Hash: {activeCertificate.verificationHash}</p>
                  <p className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Digitally Verified
                  </p>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex items-center gap-10 text-center">
                <div>
                  <div className="font-serif italic text-sm text-slate-800 font-semibold border-b border-slate-400 pb-1">
                    {activeCertificate.trainerName || "Dr. Rajesh K. Verma"}
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 mt-1">Lead Faculty / Trainer</p>
                  <p className="text-[9px] text-slate-500">Radar & Satellite Division, IMD</p>
                </div>

                <div>
                  <div className="font-serif italic text-sm text-slate-800 font-semibold border-b border-slate-400 pb-1">
                    Shri Arvind Saxena
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 mt-1">Director (Training)</p>
                  <p className="text-[9px] text-slate-500">Ministry of Earth Sciences, GoI</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Verified under National Capacity Building Framework
          </span>
          <button
            onClick={() => setActiveCertificate(null)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
