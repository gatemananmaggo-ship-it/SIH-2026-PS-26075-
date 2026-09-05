import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';

export const CoursePlayer = () => {
  const { 
    courses, 
    activeCourseId, 
    setCurrentView, 
    toggleModuleProgress, 
    openQuiz, 
    setActiveFeedbackCourse,
    currentUser,
    showToast
  } = useApp();

  const course = courses.find(c => c.id === activeCourseId) || courses[0];
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [notes, setNotes] = useState([
    { id: 1, timestamp: "08:14", text: "Dual-Pol Z_DR drops below zero for vertically oriented ice needles and high-electric field regions." },
    { id: 2, timestamp: "22:45", text: "Fuzzy logic membership equations require accurate ambient temperature sounding from NWP background." }
  ]);
  const [newNote, setNewNote] = useState('');

  const currentModule = course?.modules?.[activeModuleIndex] || course?.modules?.[0];

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
                {course.domain}
              </span>
              <span className="text-xs text-slate-500">• {course.level} Level</span>
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

          {course.assessmentId && (
            <button
              onClick={() => openQuiz(course.assessmentId)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md transition"
            >
              <Award className="w-4 h-4" />
              <span>Launch Subject MCQ Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Video Player + Module Syllabus Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Video Player & Lecture Workspace */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Simulated Video Player */}
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 relative aspect-video flex flex-col justify-between group">
            
            {/* Real HTML5 Video element or Simulated High-Tech Canvas */}
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-950 via-navy-950 to-slate-900">
              <video
                src={currentModule?.videoUrl}
                className="w-full h-full object-cover"
                controls={false}
                autoPlay={false}
              />

              {/* Overlay Play/Pause Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute w-16 h-16 rounded-full bg-moes-600/90 hover:bg-moes-500 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-transform transform hover:scale-110"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              {/* Video Title Header Overlay */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white text-xs">
                <span className="font-semibold">{currentModule?.title}</span>
                <span className="bg-moes-700/80 px-2 py-0.5 rounded text-[10px] font-mono">1080p HD • MoES LMS</span>
              </div>
            </div>

            {/* Player Control Bar */}
            <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-sky-400 hover:text-white"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono">
                  <span>14:28</span>
                  <span>/</span>
                  <span>{currentModule?.duration || "45 mins"}</span>
                </div>
              </div>

              {/* Speed / Volume / Fullscreen */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-sky-300"
                >
                  {playbackSpeed}x Speed
                </button>
                <Volume2 className="w-4 h-4 text-slate-300 hover:text-white cursor-pointer" />
                <Maximize2 className="w-4 h-4 text-slate-300 hover:text-white cursor-pointer" />
              </div>
            </div>

          </div>

          {/* Module Description & Progress Toggle */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {currentModule?.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Instructor: <strong>{course.trainerName}</strong> • {course.trainerRole}
                </p>
              </div>

              <button
                onClick={() => toggleModuleProgress(course.id, currentModule?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  currentModule?.completed
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-300 dark:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{currentModule?.completed ? 'Completed' : 'Mark as Completed'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentModule?.summary}
            </p>

            {/* Study Resources & Downloads */}
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
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Course Syllabus & Modules
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {course.modules?.filter(m => m.completed).length || 0} of {course.modules?.length || 0} modules completed
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${((course.modules?.filter(m => m.completed).length || 0) / (course.modules?.length || 1)) * 100}%`
                }}
              ></div>
            </div>

            {/* Module List */}
            <div className="space-y-2 pt-2">
              {course.modules?.map((mod, index) => {
                const isSelected = activeModuleIndex === index;
                return (
                  <div
                    key={mod.id}
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
                        <span className="font-bold">{mod.title}</span>
                        <span className="text-[10px] text-slate-500">{mod.duration}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {mod.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Assessment CTA */}
            {course.assessmentId && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ready to test your competency and claim your official MoES Certificate?
                </p>
                <button
                  onClick={() => openQuiz(course.assessmentId)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition shadow-md flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Attempt Final Assessment</span>
                </button>
              </div>
            )}

          </div>

          {/* Instructor Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lead Course Faculty
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-moes-600 text-white flex items-center justify-center font-bold text-sm">
                {course.trainerName.split(' ')[1]?.[0] || 'T'}
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">{course.trainerName}</h5>
                <p className="text-[10px] text-moes-600 dark:text-sky-400 font-semibold">{course.trainerRole}</p>
                <p className="text-[10px] text-slate-500">{course.department}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
