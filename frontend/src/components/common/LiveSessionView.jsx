import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JaasClassroom } from './JaasClassroom';
import { completeSessionApi, updateSessionRecordingApi } from '../../services/trainer';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Film, 
  Radio, 
  AlertTriangle, 
  Loader2, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const LiveSessionView = () => {
  const { 
    currentUser, 
    activeLiveSession, 
    exitLiveClassroom, 
    showToast,
    isDemoMode 
  } = useApp();

  const [completing, setCompleting] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(
    activeLiveSession?.session?.status === 'completed'
  );
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(
    activeLiveSession?.session?.recordingUrl || ''
  );
  const [savingRecording, setSavingRecording] = useState(false);

  const session = activeLiveSession?.session || {};
  const jaas = activeLiveSession?.jaas || null;
  const isTrainer = Boolean(activeLiveSession?.isTrainer);

  const handleCompleteSession = async () => {
    if (!session._id) return;
    if (!window.confirm("Are you sure you want to end and complete this live classroom session? New trainees will not be able to join.")) {
      return;
    }

    try {
      setCompleting(true);
      if (!isDemoMode) {
        await completeSessionApi(session._id);
      }
      setSessionCompleted(true);
      setShowRecordingModal(true);
      showToast("Live session has been completed successfully!", "success");
    } catch (err) {
      showToast(err.data?.message || err.message || "Failed to complete session", "warning");
    } finally {
      setCompleting(false);
    }
  };

  const handleSaveRecording = async (e) => {
    e?.preventDefault();
    if (!session._id || !recordingUrl.trim()) return;

    try {
      setSavingRecording(true);
      if (!isDemoMode) {
        await updateSessionRecordingApi(session._id, recordingUrl.trim());
      }
      showToast("Post-session recording attached successfully!", "success");
      setShowRecordingModal(false);
    } catch (err) {
      showToast(err.data?.message || err.message || "Failed to save recording URL", "warning");
    } finally {
      setSavingRecording(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & Live Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={exitLiveClassroom}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-xs font-semibold"
            title="Leave classroom and return to portal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Leave Classroom</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                sessionCompleted
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
              }`}>
                {!sessionCompleted && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                <span>{sessionCompleted ? 'Session Completed' : 'Live Classroom Active'}</span>
              </span>

              <span className="text-xs text-slate-500">
                Course: {session.courseId?.title || "MoES Capacity Building"}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {session.title || "Live Virtual Masterclass"}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {isTrainer && !sessionCompleted && (
            <button
              onClick={handleCompleteSession}
              disabled={completing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition disabled:opacity-50"
            >
              {completing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>Complete Session</span>
            </button>
          )}

          {isTrainer && sessionCompleted && (
            <button
              onClick={() => setShowRecordingModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition"
            >
              <Film className="w-3.5 h-3.5" />
              <span>{recordingUrl ? 'Update Recording' : 'Attach Recording'}</span>
            </button>
          )}

          <button
            onClick={exitLiveClassroom}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Completed Session Notification Banner */}
      {sessionCompleted && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-bold">This live session has concluded.</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                {recordingUrl
                  ? "Trainees can now watch the archived recording."
                  : isTrainer 
                    ? "Please attach the recorded video URL below for enrolled trainees."
                    : "The recording will become available once uploaded by the instructor."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {recordingUrl && (
              <a
                href={recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Watch Recording</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {isTrainer && (
              <button
                onClick={() => setShowRecordingModal(true)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition font-semibold"
              >
                Manage Recording
              </button>
            )}
          </div>
        </div>
      )}

      {/* Embedded JaaS Classroom Component */}
      <div className="space-y-3">
        <JaasClassroom
          jaas={jaas}
          currentUser={currentUser}
          session={session}
          isTrainer={isTrainer}
          onReadyToClose={exitLiveClassroom}
        />
      </div>

      {/* Session Details Footer Information */}
      <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            {session.title}
          </p>
          <p className="text-[11px]">
            {session.description || "Interactive virtual capacity building masterclass hosted via MoES Digital Infrastructure."}
          </p>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-moes-500" />
            <span>Time: {session.startTime || "10:00"} - {session.endTime || "12:00"}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span>Capacity: {session.maxSeats || 30} Officers</span>
          </span>
        </div>
      </div>

      {/* Recording Attachment Modal (Trainer Only) */}
      {showRecordingModal && isTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full bg-white dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                <Film className="w-4 h-4 text-indigo-500" />
                <span>Attach Lecture Recording</span>
              </div>
              <button
                onClick={() => setShowRecordingModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide a direct streaming or cloud link (YouTube, Google Drive, Vimeo, MP4) for trainees who wish to rewatch this session.
            </p>

            <form onSubmit={handleSaveRecording} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Recording URL *
                </label>
                <input
                  type="url"
                  required
                  value={recordingUrl}
                  onChange={(e) => setRecordingUrl(e.target.value)}
                  placeholder="https://youtu.be/... or https://drive.google.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRecordingModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRecording}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5 shadow"
                >
                  {savingRecording ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Recording</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
