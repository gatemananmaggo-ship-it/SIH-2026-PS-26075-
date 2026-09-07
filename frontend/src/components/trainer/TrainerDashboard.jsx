import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderGit2, 
  Award, 
  FileQuestion, 
  FolderDown, 
  Video, 
  UserCheck, 
  Users, 
  TrendingUp, 
  Star, 
  Plus 
} from 'lucide-react';
import { TraineeAnalytics } from './TraineeAnalytics';
import { QuizCreator } from './QuizCreator';
import { TrainerLibrary } from './TrainerLibrary';
import { SessionScheduler } from './SessionScheduler';
import { TrainerProfile } from './TrainerProfile';
import { getTrainerAnalyticsApi } from '../../services/trainer';

export const TrainerDashboard = () => {
  const { currentUser, assessments, trainerMaterials, liveSessions, isDemoMode } = useApp();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'quiz-creator', 'library', 'sessions', 'profile'
  const [backendStats, setBackendStats] = useState(null);

  React.useEffect(() => {
    if (!isDemoMode) {
      getTrainerAnalyticsApi()
        .then(res => {
          if (res) setBackendStats(res);
        })
        .catch(err => console.log('Could not fetch trainer analytics:', err));
    }
  }, [isDemoMode]);

  const coursesCount = backendStats ? (backendStats.totalCourses ?? 0) : assessments.length;
  const sessionsCount = backendStats ? (backendStats.totalSessions ?? 0) : liveSessions.length;
  const enrollmentsCount = backendStats ? (backendStats.totalEnrollments ?? 0) : trainerMaterials.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Welcome Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/40 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  Trainer & Faculty Portal
                </span>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300" />
                  <span>{backendStats?.averageRating ? Number(backendStats.averageRating).toFixed(1) : (currentUser?.rating || 4.9)} Rating</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-1">
                {currentUser?.name}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentUser?.designation} • {currentUser?.organization}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">{backendStats ? 'My Courses' : 'Questionnaires'}</span>
              <span className="text-lg font-black text-amber-300">{coursesCount}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">{backendStats ? 'Enrollments' : 'Shared Files'}</span>
              <span className="text-lg font-black text-sky-300">{enrollmentsCount}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Live Webinars</span>
              <span className="text-lg font-black text-emerald-400">{sessionsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trainer Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Trainee Analytics & Gradebook</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz-creator')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'quiz-creator'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>Create Questionnaire & Deadlines</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'library'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FolderDown className="w-4 h-4" />
          <span>Trainer Shared Library ({trainerMaterials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'sessions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Schedule Live Masterclass</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Faculty Profile & Publications</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'analytics' && <TraineeAnalytics />}
      {activeTab === 'quiz-creator' && <QuizCreator onCreated={() => setActiveTab('analytics')} />}
      {activeTab === 'library' && <TrainerLibrary />}
      {activeTab === 'sessions' && <SessionScheduler />}
      {activeTab === 'profile' && <TrainerProfile />}

    </div>
  );
};
