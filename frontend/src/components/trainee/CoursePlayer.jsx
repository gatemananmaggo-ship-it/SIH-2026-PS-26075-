import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Download, 
  Award, 
  MessageSquare, 
  Clock, 
  BookOpen, 
  Star, 
  Volume2, 
  Maximize2, 
  StickyNote, 
  Plus, 
  Trash2, 
  FolderDown, 
  Sparkles, 
  Layers,
  Loader2
} from 'lucide-react';

import { 
  getTraineeCourseLessonsApi, 
  getCourseProgressApi, 
  markLessonCompleteApi,
  getTraineeCourseQuizzesApi 
} from '../../services/trainee';

export const CoursePlayer = () => {
  const { 
    courses, 
    assessments,
    activeCourseId, 
    setCurrentView, 
    openQuiz, 
    setActiveFeedbackCourse, 
    currentUser, 
    showToast,
    isDemoMode,
    isAuthenticated
  } = useApp();

  const course = courses.find(c => (c.id === activeCourseId || c._id === activeCourseId)) || courses[0];

  const courseAssessment = assessments?.find(a => 
    a.courseId === (course?._id || course?.id)
  );

  const handleStartExam = async () => {
    const cid = course?._id || course?.id;
    let qid = courseAssessment?._id || courseAssessment?.id;
    if (!qid && cid && !isDemoMode && isAuthenticated) {
      try {
        const res = await getTraineeCourseQuizzesApi(cid);
        if (res?.quizzes?.length > 0) {
          qid = res.quizzes[0]._id || res.quizzes[0].id;
        }
      } catch (e) {
        console.log('Error fetching quizzes for course exam:', e);
      }
    }
    openQuiz(qid, cid);
  };

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [notes, setNotes] = useState([
    { id: 1, timestamp: "08:14", text: "Dual-Pol Z_DR drops below zero for vertically oriented ice needles and high-electric field regions." },
    { id: 2, timestamp: "22:45", text: "Fuzzy logic membership equations require accurate ambient temperature sounding from NWP background." }
  ]);
  const [newNote, setNewNote] = useState('');

  // Live Backend Lessons & Progress
  const [liveLessons, setLiveLessons] = useState([]);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [courseProgress, setCourseProgress] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);

  // Load Lessons & Progress from Backend
  const loadLessonsAndProgress = useCallback(async () => {
    if (!activeCourseId || isDemoMode || !isAuthenticated) return;
    try {
      setLoadingLessons(true);
      const [lessonsRes, progressRes] = await Promise.allSettled([
        getTraineeCourseLessonsApi(activeCourseId),
        getCourseProgressApi(activeCourseId)
      ]);

      if (lessonsRes.status === 'fulfilled' && lessonsRes.value?.lessons) {
        setLiveLessons(lessonsRes.value.lessons);
      }

      if (progressRes.status === 'fulfilled' && progressRes.value) {
        // Backend returns:
        // {
        //   message: "Course progress fetched successfully",
        //   progress: { courseId, totalLessons, completedLessons, progress, status }
        // }
        // Safely extract progress object and primitive values
        const rawProgress = progressRes.value?.progress !== undefined 
          ? progressRes.value.progress 
          : progressRes.value;

        const progressData = typeof rawProgress === 'object' && rawProgress !== null 
          ? rawProgress 
          : {};

        setCourseProgress(progressData);

        // Numerical percentage value (0-100)
        const percent = typeof progressData.progress === 'number'
          ? progressData.progress
          : (typeof rawProgress === 'number' ? rawProgress : 0);
        setProgressPercent(percent);

        // Handle completed lesson IDs array
        if (Array.isArray(progressData.completedLessons)) {
          setCompletedLessonIds(progressData.completedLessons);
        } else if (Array.isArray(progressRes.value?.completedLessons)) {
          setCompletedLessonIds(progressRes.value.completedLessons);
        }
      }
    } catch {
      // Fallback to local
    } finally {
      setLoadingLessons(false);
    }
  }, [activeCourseId, isDemoMode, isAuthenticated]);

  useEffect(() => {
    loadLessonsAndProgress();
  }, [loadLessonsAndProgress]);

  // Lessons to display (Live backend or Demo fallback)
  const displayModules = liveLessons.length > 0 ? liveLessons.map((l, idx) => ({
    id: l._id,
    _id: l._id,
    title: l.title || `Lesson ${idx + 1}`,
    duration: l.duration ? `${l.duration} mins` : "30 mins",
    videoUrl: l.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    summary: l.description || l.content || "Lesson curriculum study module.",
    completed: completedLessonIds.includes(l._id),
    resources: [
      { name: `${l.title || "Lesson"}_Study_Guide.pdf`, size: "3.4 MB", type: "pdf" }
    ]
  })) : (course?.modules || []);

  const currentModule = displayModules[activeModuleIndex] || displayModules[0];

  const handleToggleComplete = async (moduleItem) => {
    const moduleId = moduleItem?._id || moduleItem?.id;
    if (!moduleId) return;

    if (isDemoMode) {
      showToast("Module marked completed (Demo Mode)", "success");
      return;
    }

    try {
      setMarkingComplete(true);
      const res = await markLessonCompleteApi(activeCourseId, moduleId);

      if (res?.completedLessons && Array.isArray(res.completedLessons)) {
        setCompletedLessonIds(res.completedLessons);
      } else {
        setCompletedLessonIds(prev => prev.includes(moduleId) ? prev : [...prev, moduleId]);
      }

      if (typeof res?.progress === 'number') {
        setProgressPercent(res.progress);
      }

      if (res) {
        setCourseProgress(prev => ({
          ...(prev || {}),
          progress: typeof res.progress === 'number' ? res.progress : (prev?.progress ?? 0),
          status: res.status || prev?.status || 'active',
          completedLessons: Array.isArray(res.completedLessons)
            ? res.completedLessons.length
            : ((prev?.completedLessons ?? 0) + 1)
        }));
      }

      showToast("Lesson marked complete!", "success");
      loadLessonsAndProgress();
    } catch (err) {
      const msg = err.data?.message || err.message || "Could not update progress";
      if (err.status === 409) {
        showToast("Lesson is already marked completed.", "info");
      } else {
        showToast(msg, "warning");
      }
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const time = `${String(Math.floor(Math.random() * 25) + 5).padStart(2, '0')}:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}`;
    setNotes([...notes, { id: Date.now(), timestamp: time, text: newNote.trim() }]);
    setNewNote('');
    showToast("Personal note saved with timestamp!", "info");
  };

  const handleDownloadResource = (resourceName) => {
    showToast(`Downloading resource: ${resourceName}`, "success");
  };

  // Safe primitive metrics extracted from courseProgress object and displayModules
  const safeProgressPercent = typeof courseProgress?.progress === 'number'
    ? courseProgress.progress
    : (typeof progressPercent === 'number' ? progressPercent : 0);

  const completedLessonsCount = displayModules.length > 0
    ? displayModules.filter(m => m.completed).length
    : (typeof courseProgress?.completedLessons === 'number'
        ? courseProgress.completedLessons
        : (Array.isArray(courseProgress?.completedLessons)
            ? courseProgress.completedLessons.length
            : completedLessonIds.length));

  const totalLessonsCount = displayModules.length > 0
    ? displayModules.length
    : (typeof courseProgress?.totalLessons === 'number'
        ? courseProgress.totalLessons
        : 0);

  const calculatedProgress = totalLessonsCount > 0
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
    : (typeof safeProgressPercent === 'number' ? safeProgressPercent : 0);

  const courseStatus = courseProgress?.status ?? (calculatedProgress === 100 ? "completed" : "in_progress");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('trainee')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-moes-600 dark:text-sky-400 bg-moes-50 dark:bg-moes-950 px-2 py-0.5 rounded border border-moes-200 dark:border-moes-800">
                {course.domain || course.category || "Meteorology"}
              </span>
              <span className="text-xs text-slate-500">• {course.level || "Standard"} Level</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFeedbackCourse(course)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Rate Course</span>
          </button>

          <button
            onClick={handleStartExam}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md transition"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Take Certification Exam</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Player on Left, Syllabus on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Video Screen & Lecture Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Video Player Card */}
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-black relative group">
            <div className="relative aspect-video flex items-center justify-center bg-slate-950">
              <video
                key={currentModule?.videoUrl}
                className="w-full h-full object-cover"
                controls
                poster={course.thumbnail}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => handleToggleComplete(currentModule)}
              >
                <source src={currentModule?.videoUrl} type="video/mp4" />
                Your browser does not support HTML5 video streaming.
              </video>
            </div>

            {/* Sub-bar below video */}
            <div className="p-4 bg-slate-900/95 border-t border-slate-800 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sky-400">
                  Module {activeModuleIndex + 1} of {displayModules.length}:
                </span>
                <span className="text-slate-300 font-medium truncate max-w-[280px]">
                  {currentModule?.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleComplete(currentModule)}
                  disabled={markingComplete}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    currentModule?.completed
                      ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  {markingComplete ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{currentModule?.completed ? "Completed" : "Mark as Complete"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Module Description & Meta */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentModule?.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-moes-500" />
                    <span>Duration: {currentModule?.duration}</span>
                  </span>
                  <span>•</span>
                  <span>Curriculum Code: MOES-2026-LEC-{activeModuleIndex + 1}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentModule?.summary}
            </p>

            {/* Study Resources */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <FolderDown className="w-3.5 h-3.5 text-moes-500" />
                <span>Lecture Study Materials & Data Downloads ({currentModule?.resources?.length || 0})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentModule?.resources?.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs hover:border-moes-400 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-moes-100 dark:bg-moes-900/60 text-moes-700 dark:text-sky-300 flex items-center justify-center font-bold text-[10px]">
                        {res.type?.toUpperCase() || 'PDF'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">{res.name}</p>
                        <p className="text-[10px] text-slate-500">{res.size}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadResource(res.name)}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-moes-600 dark:text-sky-300 hover:bg-moes-50 shadow-sm border border-slate-200 dark:border-slate-600 transition"
                      title="Download Resource"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Timestamp Notes Section */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <StickyNote className="w-4 h-4 text-amber-500" />
                <span>Personal Study Notes & Key Observations</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{notes.length} Notes</span>
            </div>

            <div className="space-y-2">
              {notes.map(note => (
                <div key={note.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800/60 shrink-0">
                      {note.timestamp}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{note.text}</p>
                  </div>
                  <button
                    onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                    className="text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Take a note at current video timestamp..."
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                className="px-4 py-2 rounded-lg bg-moes-600 hover:bg-moes-700 text-white text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Course Syllabus & Module Navigation */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Course Syllabus & Modules
                </h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  courseStatus === 'completed' || calculatedProgress === 100
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                }`}>
                  {courseStatus === 'completed' || calculatedProgress === 100 ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {completedLessonsCount} of {totalLessonsCount} lessons completed ({calculatedProgress}%)
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${calculatedProgress}%` }}
              ></div>
            </div>

            {/* Module List */}
            {loadingLessons ? (
              <div className="py-6 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-moes-600" />
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                {displayModules.map((mod, index) => {
                  const isSelected = activeModuleIndex === index;
                  return (
                    <div
                      key={mod.id || index}
                      onClick={() => setActiveModuleIndex(index)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 text-xs ${
                        isSelected
                          ? 'border-moes-500 bg-moes-50/70 dark:bg-moes-950/40 text-slate-900 dark:text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="pt-0.5">
                        {mod.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold line-clamp-1">{mod.title}</span>
                          <span className="text-[10px] text-slate-500 shrink-0">{mod.duration}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {mod.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Assessment CTA */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Ready to test your competency and claim your official MoES Certificate?
              </p>
              <button
                onClick={handleStartExam}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition shadow-md flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Attempt Certification Assessment</span>
              </button>
            </div>

          </div>

          {/* Instructor Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lead Course Faculty
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-moes-600 text-white flex items-center justify-center font-bold text-sm">
                {(course.trainerName || "MoES Faculty").split(' ')[1]?.[0] || 'T'}
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">{course.trainerName || "MoES Faculty"}</h5>
                <p className="text-[10px] text-moes-600 dark:text-sky-400 font-semibold">{course.trainerRole || "Senior Faculty"}</p>
                <p className="text-[10px] text-slate-500">{course.department || "Ministry of Earth Sciences"}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
