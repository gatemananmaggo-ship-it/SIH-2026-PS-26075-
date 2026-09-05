import React, { useState } from 'react';
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
  FolderDown
} from 'lucide-react';
import { TraineeProfile } from './TraineeProfile';
import { TraineeCertificates } from './TraineeCertificates';
import { DomainCatalogue } from '../landing/DomainCatalogue';

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
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'explore', 'assessments', 'materials', 'certificates', 'profile'
  const [courseSearch, setCourseSearch] = useState('');

  const enrolledCourseIds = currentUser?.enrolledCourses || [];
  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const completedCourseIds = currentUser?.completedCourses || [];

  const handleDownloadMaterial = (title) => {
    showToast(`Downloading: ${title}`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Welcome Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden bg-gradient-to-r from-moes-900/90 via-navy-900 to-slate-900 text-white">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-moes-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-moes-500/40 text-sky-200 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                  Trainee Learning Workspace
                </span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                  Approved Officer
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-1">
                Welcome, {currentUser?.name}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentUser?.designation} • {currentUser?.organization} ({currentUser?.location})
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Enrolled</span>
              <span className="text-lg font-black text-sky-300">{enrolledCourses.length}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Completed</span>
              <span className="text-lg font-black text-emerald-400">{completedCourseIds.length}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Certificates</span>
              <span className="text-lg font-black text-amber-300">{currentUser?.certificates?.length || 0}</span>
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
          <span>My Enrolled Courses ({enrolledCourses.length})</span>
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
          onClick={() => setActiveTab('assessments')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'assessments'
              ? 'border-moes-600 text-moes-600 dark:text-sky-400 dark:border-sky-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>MCQ Assessments ({assessments.length})</span>
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
          <span>Trainer Shared Library ({trainerMaterials.length})</span>
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
          {enrolledCourses.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                You have not enrolled in any courses yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the specialized MoES/IMD catalogue and enroll in courses to start learning.
              </p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-moes-600 text-white hover:bg-moes-700 transition"
              >
                Browse Course Catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => {
                const completedModules = course.modules?.filter(m => m.completed).length || 0;
                const totalModules = course.modules?.length || 1;
                const progress = Math.round((completedModules / totalModules) * 100);
                const isFinished = completedCourseIds.includes(course.id) || progress === 100;

                return (
                  <div
                    key={course.id}
                    className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between hover:shadow-xl transition"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-900">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                        <span className="absolute top-3 left-3 bg-moes-900/90 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md">
                          {course.domain}
                        </span>
                        {isFinished && (
                          <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            Certified
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="space-y-1 pt-2">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-600 dark:text-slate-400">Progress:</span>
                            <span className="text-moes-600 dark:text-sky-400">{progress}% ({completedModules}/{totalModules} Modules)</span>
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
                        onClick={() => openCoursePlayer(course.id)}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Launch Course Player</span>
                      </button>

                      {course.assessmentId && (
                        <button
                          onClick={() => openQuiz(course.assessmentId)}
                          className="w-full py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-white border border-amber-300 dark:border-amber-800/60 transition flex items-center justify-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Take MCQ Assessment</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Explore Catalogue */}
      {activeTab === 'explore' && (
        <DomainCatalogue searchQuery={courseSearch} />
      )}

      {/* Tab Content 3: Assessments */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assessments.map(quiz => {
              const matchingCourse = courses.find(c => c.id === quiz.courseId);
              const isPassed = currentUser?.certificates?.some(cert => cert.courseId === quiz.courseId);

              return (
                <div
                  key={quiz.id}
                  className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 hover:border-amber-400/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-moes-600 dark:text-sky-400 bg-moes-50 dark:bg-moes-950 px-2.5 py-0.5 rounded border border-moes-200 dark:border-moes-800">
                        {quiz.totalQuestions} Questions • {quiz.durationMinutes} Mins
                      </span>
                      {isPassed ? (
                        <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Passed
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-bold">
                          Passing: {quiz.passingScore}%
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Course: <strong>{quiz.courseTitle}</strong>
                    </p>

                    <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Deadline: {quiz.deadline ? quiz.deadline.split('T')[0] : 'Open'}</span>
                      </span>
                      <span>• Created by: {quiz.creatorName}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Instant Evaluation & Certificate
                    </span>
                    <button
                      onClick={() => openQuiz(quiz.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{isPassed ? 'Retake Quiz' : 'Start Assessment'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 4: Trainer Shared Library */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Trainer Knowledge Repository & Datasets
              </h3>
              <p className="text-xs text-slate-500">
                Download radar volume scans, storm surge models, presentation decks, and scientific handbooks uploaded by MoES faculty.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trainerMaterials.map(mat => (
              <div
                key={mat.id}
                className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4 hover:border-sky-400 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                      {mat.fileType} • {mat.fileSize}
                    </span>
                    <span className="text-[10px] text-slate-400">{mat.uploadDate}</span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                    {mat.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>

                  <p className="text-[10px] text-moes-600 dark:text-sky-400 font-semibold pt-1">
                    Uploaded by: {mat.trainerName}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{mat.downloads} Downloads</span>
                  <button
                    onClick={() => handleDownloadMaterial(mat.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-moes-600 hover:bg-moes-700 text-white transition shadow-sm"
                  >
                    <FolderDown className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 5: Certificates */}
      {activeTab === 'certificates' && (
        <TraineeCertificates />
      )}

      {/* Tab Content 6: Professional Profile */}
      {activeTab === 'profile' && (
        <TraineeProfile />
      )}

    </div>
  );
};
