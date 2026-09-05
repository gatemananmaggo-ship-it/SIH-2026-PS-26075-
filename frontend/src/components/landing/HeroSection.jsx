import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  Search, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  ChevronRight, 
  Award, 
  BookOpen, 
  Zap,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const HeroSection = ({ onSearch, searchQuery }) => {
  const { switchRole, setCurrentView, currentRole, setAuthModal } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-navy-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      
      {/* Background Animated Radar Grid & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-moes-500/15 blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl"></div>
        
        {/* Radar concentric circles representation */}
        <div className="absolute right-10 top-12 opacity-15 hidden lg:block">
          <div className="relative w-96 h-96 rounded-full border border-sky-400/40 flex items-center justify-center">
            <div className="w-72 h-72 rounded-full border border-sky-400/30 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-sky-400/30 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-sky-400/50 flex items-center justify-center">
                  <div className="w-3 h-3 bg-sky-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
            {/* Sweep hand */}
            <div className="absolute inset-0 radar-sweep-anim origin-center">
              <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-sky-400"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Gov Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moes-950/80 border border-moes-500/40 backdrop-blur-md text-xs font-semibold text-sky-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Ministry of Earth Sciences (MoES) • Smart Education Theme</span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">SIH-26075</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Empowering India's{' '}
              <span className="bg-gradient-to-r from-sky-400 via-moes-300 to-amber-300 bg-clip-text text-transparent">
                Earth Science & Meteorological
              </span>{' '}
              Workforce.
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              <strong>CAPACITY CONNECT</strong> is a unified digital learning management and competency mapping portal for IMD, INCOIS, NCMRWF, IITM, and NIOT. Upskilling scientists and trainees in Doppler Radar Polarimetry, NWP 4D-Var, Satellite Remote Sensing, and Tsunami Early Warnings.
            </p>

            {/* Live Search Bar */}
            <div className="pt-2 max-w-2xl">
              <div className="relative flex items-center shadow-2xl rounded-2xl bg-white/10 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 p-2">
                <Search className="w-5 h-5 text-sky-300 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search courses, e.g., 'Doppler Radar', '4D-Var', 'INSAT-3D', 'ADCIRC', 'Seismology'..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 outline-none"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('courses-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-moes-500 hover:bg-moes-600 text-white text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Role Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              
              {/* Trainee Card */}
              <div 
                onClick={() => switchRole('trainee')}
                className="group p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-400/60 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-sky-300 flex items-center justify-center group-hover:scale-110 transition">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-300 transition" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition">Trainee Learning</h4>
                <p className="text-[11px] text-slate-400 mt-1">Enroll, access study PPT/PDFs, take timed MCQs & earn certs.</p>
              </div>

              {/* Trainer Card */}
              <div 
                onClick={() => switchRole('trainer')}
                className="group p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-400/60 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-300 transition" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">Trainer Portal</h4>
                <p className="text-[11px] text-slate-400 mt-1">Build questionnaires with deadlines, monitor grades & share lectures.</p>
              </div>

              {/* Admin Card */}
              <div 
                onClick={() => switchRole('admin')}
                className="group p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-400/60 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 transition" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">Admin Governance</h4>
                <p className="text-[11px] text-slate-400 mt-1">Approve users, publish broadcasts & map trainer competencies.</p>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Live Capacity Highlights */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-800/80 to-navy-950/90 border border-moes-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Mission Mausam Highlights</span>
                </div>
                <span className="text-[10px] text-slate-400">Live 2026</span>
              </div>

              <div className="space-y-3.5 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">56 Doppler Radars Integrated</h5>
                    <p className="text-[10px] text-slate-400">Operational training curriculum aligned for S/C/X band networks across India.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Automated Competency Mapping</h5>
                    <p className="text-[10px] text-slate-400">Matches specialized atmospheric requirements to certified MoES scientists.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">E-Certificates with QR Verification</h5>
                    <p className="text-[10px] text-slate-400">Tamper-evident competency certificates generated instantly upon passing assessments.</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Need access?</span>
                <button
                  onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <span>Request Account</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
