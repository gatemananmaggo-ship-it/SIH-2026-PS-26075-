import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Copy, 
  Trash2, 
  Send, 
  Loader2, 
  Check, 
  Play,
  Film,
  ExternalLink,
  Edit3,
  Save,
  X
} from 'lucide-react';

import { 
  getTrainerSessionsApi, 
  createSessionApi, 
  deleteSessionApi, 
  startSessionApi,
  completeSessionApi, 
  updateSessionRecordingApi,
  publishSessionApi,
  getMyCoursesApi,
  trainerJoinSessionApi
} from '../../services/trainer';
import { Pagination } from '../common/Pagination';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

// Helper to check if scheduled session can be started
const isSessionStartable = (session) => {
  if (!session) return false;
  if (session.status === 'in_progress') return true;
  if (session.status !== 'scheduled') return false;

  if (!session.date || !session.startTime) return true; // fallback allow if time unparsed

  try {
    const sessionDate = new Date(session.date);
    const [hours, minutes] = session.startTime.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    // Allow starting 30 minutes before scheduled start time or anytime during/after scheduled day
    const thirtyMinutesBefore = new Date(sessionDate.getTime() - 30 * 60 * 1000);
    return now >= thirtyMinutesBefore;
  } catch {
    return true;
  }
};

export const SessionScheduler = () => {
  const { liveSessions, showToast, isDemoMode, isAuthenticated, startLiveClassroom } = useApp();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 6 });

  // Courses list to pick from when creating session
  const [trainerCourses, setTrainerCourses] = useState([]);

  // Create Session Modal
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [sessionActionLoading, setSessionActionLoading] = useState(null); // stores sessionId being processed

  // Recording editing state: { [sessionId]: string }
  const [editingRecordingId, setEditingRecordingId] = useState(null);
  const [recordingInput, setRecordingInput] = useState('');

  const [form, setForm] = useState({
    courseId: '',
    title: '',
    description: '',
    date: '2026-09-10',
    startTime: '10:00',
    endTime: '12:00',
    maxCapacity: 50
  });

  // Load Trainer Sessions
  const loadSessions = useCallback(async (targetPage = 1) => {
    if (isDemoMode || !isAuthenticated) return;
    try {
      setLoading(true);
      const res = await getTrainerSessionsApi({ page: targetPage, limit: 6 });
      if (res && res.sessions) {
        setSessions(res.sessions);
        setPage(res.page || targetPage);
        setMeta({
          total: res.total || res.totalSessions || 0,
          totalPages: res.totalPages || 1,
          limit: res.limit || 6
        });
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [isDemoMode, isAuthenticated]);

  // Load Courses for select dropdown
  const loadCourses = useCallback(async () => {
    if (isDemoMode || !isAuthenticated) return;
    try {
      const res = await getMyCoursesApi({ limit: 50 });
      if (res && res.courses) {
        setTrainerCourses(res.courses);
        if (res.courses.length > 0 && !form.courseId) {
          setForm(prev => ({ ...prev, courseId: res.courses[0]._id }));
        }
      }
    } catch {}
  }, [form.courseId, isDemoMode, isAuthenticated]);

  useEffect(() => {
    loadSessions(1);
    loadCourses();
  }, [loadSessions, loadCourses]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.courseId) {
      showToast("Title and Course are required", "warning");
      return;
    }

    try {
      setActionLoading(true);
      await createSessionApi({
        courseId: form.courseId,
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        maxCapacity: Number(form.maxCapacity) || 50
      });

      showToast("Live Masterclass scheduled! Jitsi room generated automatically.", "success");
      setShowModal(false);
      setForm({
        courseId: trainerCourses[0]?._id || '',
        title: '',
        description: '',
        date: '2026-09-10',
        startTime: '10:00',
        endTime: '12:00',
        maxCapacity: 50
      });
      loadSessions(1);
    } catch (err) {
      showToast(err.data?.message || "Failed to schedule session", "warning");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartSession = async (session) => {
    if (sessionActionLoading) return;
    try {
      setSessionActionLoading(session._id);
      const res = await startSessionApi(session._id);
      const updatedSession = res.session || session;

      // Update local state to in_progress immediately
      setSessions(prev => prev.map(s => s._id === session._id ? { ...s, ...updatedSession, status: 'in_progress' } : s));

      if (res.jaas) {
        showToast("Session is now Live! Launching embedded classroom...", "success");
        startLiveClassroom({ ...session, ...updatedSession, status: 'in_progress' }, res.jaas, true);
      } else {
        // JaaS not yet configured — session is started but classroom can't open
        showToast("Session started. Configure JaaS credentials on the backend to launch the live classroom.", "warning");
      }
    } catch (err) {
      showToast(err.data?.message || "Failed to start live session", "warning");
    } finally {
      setSessionActionLoading(null);
    }
  };

  // Trainer re-joins an in_progress session — fetches a fresh JaaS JWT from the backend
  const handleReopenSession = async (session) => {
    if (sessionActionLoading) return;
    try {
      setSessionActionLoading(session._id);
      const res = await trainerJoinSessionApi(session._id);
      if (res.jaas) {
        startLiveClassroom(res.session || session, res.jaas, true);
      } else {
        showToast("JaaS credentials not configured on the backend.", "warning");
      }
    } catch (err) {
      showToast(err.data?.message || "Failed to reopen classroom", "warning");
    } finally {
      setSessionActionLoading(null);
    }
  };

  const handleCompleteSession = async (sessionId) => {
    if (sessionActionLoading) return;
    try {
      setSessionActionLoading(sessionId);
      const res = await completeSessionApi(sessionId);
      showToast("Session completed! You may now attach a recording link.", "info");
      
      // Update status to completed locally
      const updated = res.session;
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, ...updated, status: 'completed' } : s));
    } catch (err) {
      showToast(err.data?.message || "Could not complete session", "warning");
    } finally {
      setSessionActionLoading(null);
    }
  };

  const handleSaveRecording = async (sessionId) => {
    if (sessionActionLoading) return;
    try {
      setSessionActionLoading(sessionId);
      const res = await updateSessionRecordingApi(sessionId, recordingInput.trim());
      showToast("Recording link saved successfully!", "success");
      const updated = res.session;
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, ...updated } : s));
      setEditingRecordingId(null);
      setRecordingInput('');
    } catch (err) {
      showToast(err.data?.message || "Failed to save recording link", "warning");
    } finally {
      setSessionActionLoading(null);
    }
  };

  const startEditingRecording = (sess) => {
    setEditingRecordingId(sess._id);
    setRecordingInput(sess.recordingUrl || '');
  };

  const handlePublish = async (sessionId) => {
    try {
      await publishSessionApi(sessionId);
      showToast("Session published! Trainees can now enroll.", "success");
      loadSessions(page);
    } catch (err) {
      showToast(err.data?.message || "Could not publish session", "warning");
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm("Delete this scheduled session?")) return;
    try {
      await deleteSessionApi(sessionId);
      showToast("Session removed", "info");
      loadSessions(page);
    } catch (err) {
      showToast(err.data?.message || "Failed to delete session", "warning");
    }
  };

  const copyLink = (url) => {
    if (!url) {
      showToast("No meeting URL available", "warning");
      return;
    }
    navigator.clipboard?.writeText(url);
    showToast("Jitsi meeting link copied to clipboard!", "success");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Video className="w-3.5 h-3.5" />
            <span>Virtual Classroom & Jitsi Masterclasses</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Scheduled Live Training Webinars
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Plan, host Jitsi live video sessions, and attach post-class lecture recordings for trainees.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching scheduled trainer sessions..." />
      ) : !isDemoMode && sessions.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sessions.map(sess => {
              const isScheduled = sess.status === 'scheduled';
              const isInProgress = sess.status === 'in_progress';
              const isCompleted = sess.status === 'completed';
              const isPublished = sess.isPublished || sess.sessionType === 'recorded';
              const meetingUrl = sess.meetingUrl;
              const isStartable = isSessionStartable(sess);
              const isBusy = sessionActionLoading === sess._id;
              const isEditingThisRecording = editingRecordingId === sess._id;

              return (
                <div
                  key={sess._id}
                  className={`glass-card rounded-2xl p-6 border shadow-md space-y-4 transition ${
                    isInProgress 
                      ? 'border-emerald-500/80 ring-2 ring-emerald-500/20 dark:border-emerald-500/60' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Dynamic Status Badges */}
                      {isInProgress ? (
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          <span>Live In Progress</span>
                        </span>
                      ) : isCompleted ? (
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                          Scheduled
                        </span>
                      )}

                      {isPublished && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                          Published Course
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Capacity: {sess.maxSeats || sess.maxCapacity || 30}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {sess.title}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-sky-400 font-semibold mt-1">
                      Course: {sess.courseId?.title || "Specialized Training"}
                    </p>
                    {sess.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {sess.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{sess.date ? new Date(sess.date).toLocaleDateString() : "Upcoming"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{sess.startTime || "10:00"} - {sess.endTime || "12:00"}</span>
                    </div>
                  </div>

                  {/* Post-Session Recording Attachment Section (Only shown when Completed) */}
                  {isCompleted && (
                    <div className="p-3 bg-slate-100/70 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Session Recording Resource</span>
                        </span>
                        {sess.recordingUrl && !isEditingThisRecording && (
                          <button
                            onClick={() => startEditingRecording(sess)}
                            className="text-indigo-600 hover:text-indigo-700 dark:text-sky-400 font-semibold flex items-center gap-1 hover:underline"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Link</span>
                          </button>
                        )}
                      </div>

                      {isEditingThisRecording ? (
                        <div className="space-y-2 animate-fadeIn">
                          <input
                            type="url"
                            placeholder="https://drive.google.com/... or Cloudinary/S3 URL"
                            value={recordingInput}
                            onChange={(e) => setRecordingInput(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-xs"
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => { setEditingRecordingId(null); setRecordingInput(''); }}
                              className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              <span>Cancel</span>
                            </button>
                            <button
                              onClick={() => handleSaveRecording(sess._id)}
                              disabled={isBusy}
                              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                            >
                              {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              <span>Save Recording</span>
                            </button>
                          </div>
                        </div>
                      ) : sess.recordingUrl ? (
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={sess.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-sky-400 truncate hover:underline flex items-center gap-1 font-mono text-[11px]"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{sess.recordingUrl}</span>
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-[11px] text-slate-500">No recording attached yet.</p>
                          <button
                            onClick={() => startEditingRecording(sess)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Attach Recording Link</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lifecycle Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Copy Jitsi Link */}
                      {meetingUrl && (
                        <button
                          onClick={() => copyLink(meetingUrl)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs flex items-center gap-1 font-semibold"
                          title="Copy Authoritative Jitsi Link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Jitsi Link</span>
                        </button>
                      )}

                      {/* Start Session Action (Scheduled -> In Progress) */}
                      {isScheduled && (
                        <button
                          onClick={() => handleStartSession(sess)}
                          disabled={!isStartable || isBusy}
                          title={!isStartable ? "Available near scheduled start time" : "Start Jitsi Live Session"}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                            isStartable 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                          <span>Start Session</span>
                        </button>
                      )}

                      {/* In-Progress Quick Reopen Action — gets a fresh JWT from backend */}
                      {isInProgress && (
                        <button
                          onClick={() => handleReopenSession(sess)}
                          disabled={isBusy}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                          {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Video className="w-3 h-3 animate-pulse" />}
                          <span>Reopen Classroom</span>
                        </button>
                      )}

                      {/* Complete Session Action (Only when In Progress) */}
                      {isInProgress && (
                        <button
                          onClick={() => handleCompleteSession(sess._id)}
                          disabled={isBusy}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                        >
                          {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          <span>Complete Session</span>
                        </button>
                      )}

                      {/* Publish Recorded Course Action (When completed and recording exists) */}
                      {isCompleted && !isPublished && sess.recordingUrl && (
                        <button
                          onClick={() => handlePublish(sess._id)}
                          disabled={isBusy}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                        >
                          <Send className="w-3 h-3" />
                          <span>Publish as Course</span>
                        </button>
                      )}
                    </div>

                    {/* Delete Session */}
                    {isScheduled && (
                      <button
                        onClick={() => handleDelete(sess._id)}
                        disabled={isBusy}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            itemName="scheduled sessions"
            onPageChange={(p) => loadSessions(p)}
          />
        </div>
      ) : isDemoMode ? (
        /* Demo Fallback */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {liveSessions.map(sess => (
            <div
              key={sess.id}
              className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
            >
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Upcoming</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{sess.title}</h3>
              <p className="text-xs text-slate-500">{sess.date} • {sess.time}</p>
              <button onClick={() => copyLink(sess.meetUrl)} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold">Copy Link</button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Video}
          title="No Live Sessions Scheduled"
          description="Click 'Schedule New Session' above to broadcast interactive Jitsi webinars for trainees."
          actionLabel="Schedule Session"
          onAction={() => setShowModal(true)}
        />
      )}

      {/* Modal: Schedule Session (No manual meeting URL input!) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Schedule New Live Training Session
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Jitsi meeting room will be automatically generated and assigned by the system upon creation.
            </p>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Course / Curriculum *</label>
                <select
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                >
                  <option value="">Select a course...</option>
                  {trainerCourses.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Session Topic Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Hands-on Doppler De-Aliasing Workshop"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Agenda and workshop objectives..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">End Time *</label>
                  <input
                    type="time"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Capacity (Officers) *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.maxCapacity}
                  onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Schedule Webinar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
