import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  PieChart, 
  ShieldCheck, 
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsOverview = () => {
  const { users, courses, assessments, regionalCenters } = useApp();

  const trainees = users.filter(u => u.role === 'trainee');
  const trainers = users.filter(u => u.role === 'trainer');
  const totalCertificates = trainees.reduce((acc, t) => acc + (t.certificates?.length || 0), 0);

  const domainCounts = courses.reduce((acc, c) => {
    acc[c.domain] = (acc[c.domain] || 0) + (c.enrolledCount || 0);
    return acc;
  }, {});

  const totalDomainEnrollments = Object.values(domainCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Trainees Enrolled</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">9,840+</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% Growth in Q3</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Curriculums</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{courses.length} Courses</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
            <span>5 MoES Core Domains</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Issued Certifications</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">8,420</p>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-1">
            <ShieldCheck className="w-3 h-3" />
            <span>100% QR Tamper-Proof</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Assessment Success</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">94.6%</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
            <span>Passing Benchmark: 70%</span>
          </div>
        </div>

      </div>

      {/* Regional IMD & MoES Centers Participation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Regional Centers Matrix */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-moes-500" />
                <span>Regional Meteorological Centres (RMCs) Capacity Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring training participation and completion rates across national stations.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {regionalCenters.map((rc, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rc.color }}></span>
                    <span className="font-bold text-slate-900 dark:text-white">{rc.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span>{rc.trainees} Officers</span>
                    <strong className="text-emerald-600 font-bold">{rc.completionRate}% Pass</strong>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${rc.completionRate}%`,
                      backgroundColor: rc.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Domain Distribution */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Domain Enrollment Share</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of scientific officers across MoES fields.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(domainCounts).map(([domain, count], idx) => {
              const pct = Math.round((count / totalDomainEnrollments) * 100);
              return (
                <div key={domain} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{domain}</span>
                    <span className="font-bold text-moes-600 dark:text-sky-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-moes-500 to-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Course Enrollment Leaderboard */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>Curriculum Engagement & Rating Leaderboard</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div
              key={course.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-moes-600 dark:text-sky-400 bg-moes-100 dark:bg-moes-950 px-2 py-0.5 rounded">
                  {course.domain}
                </span>
                <span className="text-amber-600 font-bold">★ {course.rating}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{course.title}</h4>
              <p className="text-[11px] text-slate-500">Instructor: <strong>{course.trainerName}</strong></p>
              
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{course.enrolledCount || 100} Enrolled Officers</span>
                <span className="text-emerald-600 font-bold">{course.modules?.length || 4} Modules</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
