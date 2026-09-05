import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  BarChart3, 
  UserCheck, 
  Megaphone, 
  BrainCircuit, 
  AlertTriangle, 
  Users, 
  Award,
  BookOpen
} from 'lucide-react';
import { AnalyticsOverview } from './AnalyticsOverview';
import { UserApprovalManagement } from './UserApprovalManagement';
import { HomepagePublisher } from './HomepagePublisher';
import { CompetencyMapping } from './CompetencyMapping';

export const AdminDashboard = () => {
  const { currentUser, users, courses, announcements } = useApp();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'approvals', 'publisher', 'competency'

  const pendingApprovalsCount = users.filter(u => u.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Welcome Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-navy-950 text-white">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/40 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  MoES Central Administration
                </span>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-semibold">
                  Full Authority
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
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Pending</span>
              <span className="text-lg font-black text-amber-400">{pendingApprovalsCount}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Users</span>
              <span className="text-lg font-black text-sky-300">{users.length}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Broadcasts</span>
              <span className="text-lg font-black text-emerald-400">{announcements.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'analytics'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Executive Analytics & Regional Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition relative ${
            activeTab === 'approvals'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>User Approvals & Role Governance</span>
          {pendingApprovalsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('publisher')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'publisher'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Homepage CMS & Broadcast Publisher</span>
        </button>

        <button
          onClick={() => setActiveTab('competency')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition ${
            activeTab === 'competency'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-emerald-500" />
          <span>AI Competency Mapping Engine</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'analytics' && <AnalyticsOverview />}
      {activeTab === 'approvals' && <UserApprovalManagement />}
      {activeTab === 'publisher' && <HomepagePublisher />}
      {activeTab === 'competency' && <CompetencyMapping />}

    </div>
  );
};
