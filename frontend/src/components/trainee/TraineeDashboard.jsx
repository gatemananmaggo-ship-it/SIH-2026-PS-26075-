import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Award, 
  User, 
  PlayCircle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  FileText, 
  Layers, 
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FolderDown,
  Video,
  Radio,
  Star,
  Film,
  Play,
  Users
} from 'lucide-react';
import { TraineeProfile } from './TraineeProfile';
import { TraineeCertificates } from './TraineeCertificates';
import { DomainCatalogue } from '../landing/DomainCatalogue';
import { Pagination } from '../common/Pagination';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

import { 
  getMyEnrollmentsApi, 
  getTraineeAnalyticsApi, 
  getTraineeSessionsApi, 
  enrollTraineeInSessionApi, 
  cancelSessionEnrollmentApi,
  joinTraineeSessionApi 
} from '../../services/trainee';

export const TraineeDashboard = () => {
  const { 
    currentUser, 
    courses, 
    assessments, 
    openCoursePlayer, 
    openQuiz, 
    setActiveCertificate,
    setActiveFeedbackCourse,
    trainerMaterials,
    showToast,
    isDemoMode,
    isAuthenticated,
    startLiveClassroom
  } = useApp();

  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'explore', 'sessions', 'assessments', 'materials', 'certificates', 'profile'

  // Live Enrollments State
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [enrollmentsPage, setEnrollmentsPage] = useState(1);
  const [enrollmentsMeta, setEnrollmentsMeta] = useState({ total: 0, totalPages: 1, limit: 6 });

  // Live Analytics State
  const [analytics, setAnalytics] = useState(null);

  // Live Trainee Sessions State
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsPage, setSessionsPage] = useState(1);
  const [sessionsMeta, setSessionsMeta] = useState({ total: 0, totalPages: 1, limit: 6 });

  // Fetch Trainee Analytics
  const loadAnalytics = useCallback(async () => {
    if (isDemoMode || !isAuthenticated) return;
    try {
      const data = await getTraineeAnalyticsApi();
      if (data) setAnalytics(data);
    } catch {
      // Fallback
    }
  }, [isDemoMode, isAuthenticated]);

  // Fetch Enrollments (Paginated)
  const loadEnrollments = useCallback(async (page = 1) => {
    if (isDemoMode || !isAuthenticated) return;
    try {
      setEnrollmentsLoading(true);
      const res = await getMyEnrollmentsApi({ page, limit: 6 });
      if (res && res.enrollments) {
        setEnrollments(res.enrollments);
        setEnrollmentsPage(res.page || page);
        setEnrollmentsMeta({
          total: res.total || res.enrollments.length,
          totalPages: res.totalPages || 1,
          limit: res.limit || 6
        });
      }
    } catch {
      // Fallback
    } finally {
      setEnrollmentsLoading(false);
    }
  }, [isDemoMode, isAuthenticated]);

  // Fetch Sessions (Paginated)
  const loadSessions = useCallback(async (page = 1) => {
    if (isDemoMode || !isAuthenticated) return;
    try {
      setSessionsLoading(true);
      const res = await getTraineeSessionsApi({ page, limit: 6 });
      if (res && res.sessions) {
        setSessions(res.sessions);
        setSessionsPage(res.page || page);
        setSessionsMeta({
          total: res.total || res.sessions.length,
          totalPages: res.totalPages || 1,
          limit: res.limit || 6
        });
      }
    } catch {
      // Fallback
    } finally {
      setSessionsLoading(false);
    }
  }, [isDemoMode, isAuthenticated]);

  useEffect(() => {
    loadAnalytics();
    loadEnrollments(1);
    loadSessions(1);
  }, [loadAnalytics, loadEnrollments, loadSessions]);

  // Handle Session Enrollment
  const handleEnrollSession = async (sessionId) => {
    try {
      const res = await enrollTraineeInSessionApi(sessionId);
      showToast("Enrolled in live masterclass successfully!", "success");
      // Immediately update local state without requiring a refresh
      setSessions(prev => prev.map(s => {
        if (s._id === sessionId) {
          const newCount = res?.enrolledCount ?? ((s.enrolledCount || 0) + 1);
          const maxSeats = s.maxSeats || s.maxCapacity || 30;
          return {
            ...s,
            isEnrolled: true,
            enrolledCount: newCount,
            availableSeats: res?.availableSeats ?? Math.max(0, maxSeats - newCount),
            remainingSeats: res?.remainingSeats ?? Math.max(0, maxSeats - newCount),
            meetingUrl: res?.meetingUrl || s.meetingUrl
          };
        }
        return s;
      }));
      loadSessions(sessionsPage);
      loadAnalytics();
    } catch (err) {
      showToast(err.data?.message || "Failed to enroll in session", "warning");
    }
  };

  const handleCancelSessionEnrollment = async (sessionId) => {
    try {
      const res = await cancelSessionEnrollmentApi(sessionId);
      showToast("Session registration cancelled", "info");
      // Immediately update local state without requiring a refresh
      setSessions(prev => prev.map(s => {
        if (s._id === sessionId) {
          const newCount = res?.enrolledCount ?? Math.max(0, (s.enrolledCount || 1) - 1);
          const maxSeats = s.maxSeats || s.maxCapacity || 30;
          return {
            ...s,
            isEnrolled: false,
            enrolledCount: newCount,
            availableSeats: res?.availableSeats ?? Math.max(0, maxSeats - newCount),
            remainingSeats: res?.remainingSeats ?? Math.max(0, maxSeats - newCount),
            meetingUrl: undefined
          };
        }
        return s;
      }));
      loadSessions(sessionsPage);
      loadAnalytics();
    } catch (err) {
      showToast(err.data?.message || "Failed to cancel registration", "warning");
    }
  };

  const handleJoinSession = async (sess) => {
    if (!isDemoMode && isAuthenticated) {
      try {
        const res = await joinTraineeSessionApi(sess._id);
        if (res?.jaas) {
          startLiveClassroom(sess, res.jaas, false);
        } else {
          showToast("Live classroom is not available yet. JaaS credentials may not be configured on the server.", "warning");
        }
      } catch (err) {
        showToast(err.data?.message || "Access denied. You must be enrolled in this session.", "warning");
      }
    } else {
      // Demo mode — construct a minimal jaas-shaped object using the demo room
      const demoRoom = sess.meetingRoom || 'capacity-connect-demo';
      startLiveClassroom(sess, { appId: null, roomName: demoRoom, jwt: null }, false);
    }
  };

  const handleDownloadMaterial = (title) => {
    showToast(`Downloading: ${title}`, "success");
  };

  // Metrics (Real or Demo)
  const enrolledCount = analytics ? analytics.totalEnrollments : (currentUser?.enrolledCourses?.length || 0);
  const completedCount = analytics ? analytics.completedCourses : (currentUser?.completedCourses?.length || 0);
  const certificateCount = analytics ? analytics.totalCertificates : (currentUser?.certificates?.length || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Welcome Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden bg-gradient-to-r from-moes-900/90 via-navy-900 to-slate-900 text-white">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-moes-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-moes-500/40 text-sky-200 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                  Trainee Learning Workspace
                </span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                  Approved Trainee
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-1">
                Welcome, {currentUser?.name || "Trainee Officer"}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentUser?.designation || "Meteorological Officer"} • {currentUser?.organization || "Ministry of Earth Sciences"} {currentUser?.location ? `(${currentUser.location})` : ""}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Enrolled</span>
              <span className="text-lg font-black text-sky-300">{enrolledCount}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Completed</span>
              <span className="text-lg font-black text-emerald-400">{completedCount}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Certificates</span>
              <span className="text-lg font-black text-amber-300">{certificateCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trainee Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'courses'
              ? 'border-moes-600 text-moes-600 dark:text-sky-400 dark:border-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Enrolled Courses</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'explore'
              ? 'border-moes-600 text-moes-600 dark:text-sky-400 dark:border-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Explore All Courses</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'sessions'
              ? 'border-moes-600 text-moes-600 dark:text-sky-400 dark:border-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Live Masterclasses</span>
        </button>

        <button
          onClick={() => setActiveTab('assessments')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'assessments'
              ? 'border-moes-600 text-moes-600 dark:text-sky-400 dark:border-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>MCQ Assessments</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'materials'
              ? 'border-moes-600 text-moes-600 dark:text-sky-400 dark:border-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FolderDown className="w-4 h-4" />
          <span>Trainer Shared Library</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'certificates'
              ? 'border-moes-600 text-moes-600 dark:text-sky-400 dark:border-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>My Certificates</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'profile'
              ? 'border-moes-600 text-moes-600 dark:text-sky-400 dark:border-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Professional Profile & Skills</span>
        </button>
      </div>

      {/* Tab Content 1: My Enrolled Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {enrollmentsLoading ? (
            <LoadingSpinner text="Fetching your enrolled courses..." />
          ) : !isDemoMode && enrollments.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map(item => {
                  const course = item.courseId || {};
                  const courseId = course._id || item.courseId;
                  const progress = typeof item.progress === 'object' && item.progress !== null
                    ? (item.progress.progress ?? 0)
                    : (item.progress || 0);
                  const isFinished = item.status === 'completed' || progress === 100;

                  return (
                    <div
                      key={item._id || courseId}
                      className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between hover:shadow-xl transition"
                    >
                      <div>
                        <div className="relative aspect-video bg-slate-900">
                          <img
                            src={course.thumbnail || "https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?w=600&auto=format&fit=crop&q=80"}
                            alt={course.title}
                            className="w-full h-full object-cover opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                          <span className="absolute top-3 left-3 bg-moes-900/90 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md">
                            {course.category || "Atmospheric Science"}
                          </span>
                          {isFinished && (
                            <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                              Completed
                            </span>
                          )}
                        </div>

                        <div className="p-5 space-y-3">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                            {course.title || "Curriculum Unit"}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {course.description || "Course details and curriculum modules."}
                          </p>

                          {/* Progress Bar */}
                          <div className="space-y-1 pt-2">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-slate-600 dark:text-slate-400">Progress:</span>
                              <span className="text-moes-600 dark:text-sky-400">{progress}% Completed</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${isFinished ? 'bg-emerald-500' : 'bg-moes-500'}`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0 space-y-2">
                        <button
                          onClick={() => openCoursePlayer(courseId)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-md transition"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{progress > 0 ? "Continue Course Player" : "Start Learning"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination for Enrollments */}
              <Pagination
                page={enrollmentsPage}
                totalPages={enrollmentsMeta.totalPages}
                total={enrollmentsMeta.total}
                limit={enrollmentsMeta.limit}
                itemName="enrolled courses"
                onPageChange={(p) => loadEnrollments(p)}
              />
            </>
          ) : isDemoMode ? (
            /* Demo Mode Fallback */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map(course => (
                <div
                  key={course.id}
                  className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between hover:shadow-xl transition"
                >
                  <div className="relative aspect-video bg-slate-900">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-moes-900/90 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      {course.domain}
                    </span>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                  </div>
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => openCoursePlayer(course.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-md transition"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Open Course Player</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No Enrolled Courses Found"
              description="Explore the MoES catalogue and enroll in technical modules to build your capacity credentials."
              actionLabel="Explore Course Catalogue"
              onAction={() => setActiveTab('explore')}
            />
          )}
        </div>
      )}

      {/* Tab Content 2: Explore Course Catalogue */}
      {activeTab === 'explore' && (
        <DomainCatalogue />
      )}

      {/* Tab Content 3: Live Masterclasses & Webinars */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Live Scheduled Technical Workshops & Masterclasses
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Participate in live interactive seminars conducted by certified Ministry faculty and senior meteorologists.
            </p>
          </div>

          {sessionsLoading ? (
            <LoadingSpinner text="Fetching scheduled sessions..." />
          ) : !isDemoMode && sessions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {sessions.map(sess => {
                  const isInProgress = sess.status === 'in_progress';
                  const isCompleted = sess.status === 'completed';
                  const isScheduled = sess.status === 'scheduled';
                  const meetingUrl = sess.meetingUrl;

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
                          {isInProgress ? (
                            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                              <span>Live Now</span>
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

                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            sess.isEnrolled
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {sess.isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-slate-500">
                          {sess.availableSeats !== undefined
                            ? `${sess.availableSeats} / ${sess.maxSeats || sess.maxCapacity || 30} Seats Available`
                            : `Cap: ${sess.maxSeats || sess.maxCapacity || 30} Officers`}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                          {sess.title}
                        </h3>
                        <p className="text-xs text-indigo-600 dark:text-sky-400 font-semibold mt-1">
                          Course: {sess.courseId?.title || "Specialized Training"}
                        </p>
                        {sess.trainerId?.name && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Trainer: {sess.trainerId.name}
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

                      {/* Trainee Lifecycle Action Controls */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        {isCompleted ? (
                          /* Session is Completed -> Watch Recording or Show Unavailable */
                          sess.recordingUrl ? (
                            <a
                              href={sess.recordingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition flex items-center justify-center gap-2 text-center"
                            >
                              <Play className="w-4 h-4" />
                              <span>Watch Recording</span>
                            </a>
                          ) : (
                            <div className="w-full py-2 px-3 rounded-xl text-xs text-center font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700">
                              Recording not yet available
                            </div>
                          )
                        ) : !sess.isEnrolled ? (
                          /* Trainee is NOT Enrolled -> Enrollment allowed ONLY when scheduled */
                          <div className="space-y-2">
                            {isInProgress ? (
                              <button
                                disabled
                                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 cursor-not-allowed flex items-center justify-center gap-1.5"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Enrollment Closed</span>
                              </button>
                            ) : sess.availableSeats === 0 ? (
                              <button
                                disabled
                                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>Session Full (0 Seats Left)</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEnrollSession(sess._id)}
                                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center justify-center gap-1.5"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>Enroll in Session</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          /* Trainee IS Enrolled -> Allowed to Join Session */
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleJoinSession(sess)}
                              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-2 ${
                                isInProgress 
                                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                                  : 'bg-indigo-600 hover:bg-indigo-700'
                              }`}
                            >
                              <Video className={`w-4 h-4 ${isInProgress ? 'animate-pulse' : ''}`} />
                              <span>Join Live Session</span>
                            </button>
                            {isScheduled && (
                              <button
                                onClick={() => handleCancelSessionEnrollment(sess._id)}
                                className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                title="Cancel Registration"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Pagination
                page={sessionsPage}
                totalPages={sessionsMeta.totalPages}
                total={sessionsMeta.total}
                limit={sessionsMeta.limit}
                itemName="sessions"
                onPageChange={(p) => loadSessions(p)}
              />
            </>
          ) : isDemoMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Demo Sessions */}
              <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Upcoming</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Interactive Masterclass: Real-Time Doppler Velocity De-aliasing</h3>
                <p className="text-xs text-indigo-600">Faculty: Dr. Rajesh K. Verma</p>
                <div className="text-xs text-slate-500">2026-08-28 • 14:30 - 16:30 IST</div>
                <button onClick={() => showToast("Enrolled in demo session!", "success")} className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white">Join Live Link</button>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Video}
              title="No Scheduled Sessions Available"
              description="There are currently no active live masterclasses scheduled for your enrolled courses."
            />
          )}
        </div>
      )}

      {/* Tab Content 4: MCQ Assessments */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          {assessments.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No Active Assessments Available"
              description="There are currently no examinations published for your enrolled courses. Instructors publish quizzes upon module completion."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments.map(assessment => (
                <div
                  key={assessment.id || assessment._id}
                  className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4 hover:border-amber-400/60 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        Passing: {assessment.passingScore || assessment.passingMarks || 70}%
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{assessment.durationMinutes || 15} mins</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {assessment.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {assessment.description || assessment.courseTitle}
                    </p>
                  </div>

                  <button
                    onClick={() => openQuiz(assessment.id || assessment._id, assessment.courseId)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>Take MCQ Examination</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 5: Trainer Shared Library */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainerMaterials.map(mat => (
              <div
                key={mat.id || mat._id}
                className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400/60 transition"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {mat.fileType || "PDF"} • {mat.fileSize || "10 MB"}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{mat.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{mat.description}</p>
                </div>
                <button
                  onClick={() => handleDownloadMaterial(mat.title)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  <FolderDown className="w-4 h-4 text-sky-400" />
                  <span>Download Resource</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 6: My Certificates */}
      {activeTab === 'certificates' && (
        <TraineeCertificates />
      )}

      {/* Tab Content 7: Professional Profile */}
      {activeTab === 'profile' && (
        <TraineeProfile />
      )}

    </div>
  );
};
