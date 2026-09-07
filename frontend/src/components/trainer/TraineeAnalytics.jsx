import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Star, 
  FileSpreadsheet,
  Building,
  GraduationCap
} from 'lucide-react';
import { getTrainerAnalyticsApi, getMyCoursesApi } from '../../services/trainer';

export const TraineeAnalytics = () => {
  const { users, courses: initialCourses, showToast, isDemoMode } = useApp();
  const [selectedCourseId, setSelectedCourseId] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [backendStats, setBackendStats] = useState(null);
  const [realCourses, setRealCourses] = useState(initialCourses);

  useEffect(() => {
    if (!isDemoMode) {
      getTrainerAnalyticsApi()
        .then(res => {
          if (res) setBackendStats(res);
        })
        .catch(err => console.log('Error fetching trainer analytics:', err));

      getMyCoursesApi({ page: 1, limit: 50 })
        .then(res => {
          if (res && res.courses && res.courses.length > 0) {
            setRealCourses(res.courses);
          }
        })
        .catch(err => console.log('Error fetching trainer courses:', err));
    }
  }, [isDemoMode]);

  const activeCourses = realCourses && realCourses.length > 0 ? realCourses : initialCourses;
  const trainees = users.filter(u => u.role === 'trainee');

  // Build trainee participation rows
  const participationData = trainees.flatMap(trainee => {
    const enrolledIds = trainee.enrolledCourses || [];
    return enrolledIds.map(crsId => {
      const crs = activeCourses.find(c => (c.id === crsId || c._id === crsId));
      const cert = trainee.certificates?.find(c => c.courseId === crsId);
      const feedback = trainee.feedbacksSubmitted?.find(f => f.courseId === crsId);
      const isCompleted = trainee.completedCourses?.includes(crsId) || !!cert;

      return {
        traineeId: trainee.id || trainee._id,
        name: trainee.name,
        avatar: trainee.avatar,
        email: trainee.email,
        organization: trainee.organization || 'IMD',
        location: trainee.location || trainee.regionalCenter || 'HQ',
        designation: trainee.designation || 'Meteorologist',
        courseId: crsId,
        courseTitle: crs?.title || crsId,
        courseDomain: crs?.category || crs?.domain || 'General',
        progressPercent: isCompleted ? 100 : (trainee.courseProgress?.[crsId] || 0),
        score: cert?.score ?? null,
        grade: cert?.grade || (isCompleted ? 'Pass' : 'In Progress'),
        status: isCompleted ? 'Completed' : 'In Progress',
        certId: cert?.id || cert?._id || cert?.certificateNumber || 'Pending',
        feedbackRating: feedback?.rating || null
      };
    });
  });

  const filteredData = participationData.filter(row => {
    const matchesCourse = selectedCourseId === 'All' || row.courseId === selectedCourseId;
    const matchesSearch = 
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ["Trainee Name", "Email", "Organization", "Location", "Course", "Progress (%)", "Score (%)", "Status", "Certificate ID"];
    const csvRows = [
      headers.join(","),
      ...filteredData.map(r => [
        `"${r.name}"`,
        `"${r.email}"`,
        `"${r.organization}"`,
        `"${r.location}"`,
        `"${r.courseTitle}"`,
        r.progressPercent,
        r.score !== null ? r.score : "Pending",
        r.status,
        `"${r.certId}"`
      ].join(","))
    ];

    const csvBlob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(csvBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MoES_Trainee_Gradebook_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Gradebook exported to CSV successfully!", "success");
  };

  const totalEnrollments = backendStats ? (backendStats.totalEnrollments ?? 0) : participationData.length;
  const completedCount = backendStats ? (backendStats.completedEnrollments ?? 0) : participationData.filter(r => r.status === 'Completed').length;
  const scoredRows = participationData.filter(r => r.score !== null && r.score !== undefined);
  const avgScore = scoredRows.length > 0 
    ? Math.round(scoredRows.reduce((acc, r) => acc + r.score, 0) / scoredRows.length)
    : null;
  const passRate = totalEnrollments > 0 ? Math.round((completedCount / totalEnrollments) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold uppercase">Total Trainees Monitored</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{trainees.length}</p>
          <span className="text-[11px] text-slate-500">Across IMD & MoES Centers</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold uppercase">Active Course Enrollments</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalEnrollments}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">{completedCount} Certified Graduates</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold uppercase">Average MCQ Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {avgScore !== null ? `${avgScore}%` : 'N/A'}
          </p>
          <span className="text-[11px] text-slate-500">
            {scoredRows.length > 0 ? `${scoredRows.length} Assessed • Pass: 70%` : 'Pending Exam Attempts'}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold uppercase">Cohort Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{passRate}%</p>
          <span className="text-[11px] text-slate-500">WMO Benchmark: &gt; 85%</span>
        </div>
      </div>

      {/* Gradebook Table Container */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Trainee Gradebook & Participation Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Live assessment results, module completions, and credential records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search trainee or center..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            {/* Course Filter */}
            {/* <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="All">All Courses</option>
              {activeCourses.map(c => (
                <option key={c.id || c._id} value={c.id || c._id}>{c.title}</option>
              ))}
            </select> */}
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="All">All Courses</option>
              {activeCourses.map(c => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.title}
                </option>
              ))}
            </select>

            {/* Export CSV */}
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Trainee</th>
                <th className="p-3">Organization & Station</th>
                <th className="p-3">Course</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Assessment Score</th>
                <th className="p-3">Status</th>
                <th className="p-3">Certificate ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    No trainee records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.avatar}
                          alt={row.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
                          <p className="text-[10px] text-slate-500">{row.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{row.organization}</p>
                      <p className="text-[10px] text-slate-500">{row.location}</p>
                    </td>

                    <td className="p-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title={row.courseTitle}>
                        {row.courseTitle}
                      </p>
                      <span className="text-[9px] uppercase font-bold text-moes-600 dark:text-sky-400">
                        {row.courseDomain}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="w-24 space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span>{row.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full ${row.status === 'Completed' ? 'bg-emerald-500' : 'bg-moes-500'}`}
                            style={{ width: `${row.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      {row.score !== null && row.score !== undefined ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold font-mono text-xs ${
                            row.score >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'
                          }`}>
                            {row.score}%
                          </span>
                          <span className="text-[10px] text-slate-400">({row.grade})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Pending Exam</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'Completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}>
                        {row.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{row.status}</span>
                      </span>
                    </td>

                    <td className="p-3 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                      {row.certId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
