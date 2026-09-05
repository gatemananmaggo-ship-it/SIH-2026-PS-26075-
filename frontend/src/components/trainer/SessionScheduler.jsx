import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, Calendar, Clock, Link as LinkIcon, Users, Plus, CheckCircle2, Copy } from 'lucide-react';

export const SessionScheduler = () => {
  const { liveSessions, createLiveSession, currentUser, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-05');
  const [time, setTime] = useState('11:00 - 13:00 IST');
  const [department, setDepartment] = useState('Radar & Upper Air Instrumentation');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    createLiveSession({
      id: `sess-${Date.now()}`,
      title: title.trim(),
      trainerId: currentUser?.id || "usr-trainer-01",
      trainerName: currentUser?.name || "Dr. Rajesh K. Verma",
      date,
      time,
      meetUrl: `https://meet.moes.gov.in/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      registeredCount: 1,
      status: "Upcoming",
      department
    });

    setTitle('');
    setShowModal(false);
  };

  const copyLink = (url) => {
    navigator.clipboard?.writeText(url);
    showToast("Virtual training link copied to clipboard!", "success");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Video className="w-3.5 h-3.5" />
            <span>Virtual Classroom & Live Masterclasses</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Scheduled Live Training Webinars
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Plan and broadcast real-time interactive technical workshops with trainees across regional observatories.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {liveSessions.map(sess => (
          <div
            key={sess.id}
            className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 hover:border-indigo-400/60 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{sess.status}</span>
              </span>

              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>{sess.registeredCount} Registered Officers</span>
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                {sess.title}
              </h3>
              <p className="text-xs text-indigo-600 dark:text-sky-400 font-semibold mt-1">
                Faculty: {sess.trainerName} ({sess.department})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{sess.date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{sess.time}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="truncate text-xs font-mono text-slate-400 max-w-[200px]">
                {sess.meetUrl}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyLink(sess.meetUrl)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  title="Copy Link"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <a
                  href={sess.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
                >
                  Join Meeting
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Schedule MoES Live Masterclass
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Masterclass Topic / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Workshop on Radar Sunscan Calibration"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 14:00 - 16:00 IST"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hosting Division
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                >
                  Schedule Session
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
