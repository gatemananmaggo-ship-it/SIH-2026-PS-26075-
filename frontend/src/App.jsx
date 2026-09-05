import React, { useState } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { QuickDemoBar } from './components/common/QuickDemoBar';
import { NotificationTicker } from './components/common/NotificationTicker';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CertificateModal } from './components/common/CertificateModal';
import { FeedbackModal } from './components/trainee/FeedbackModal';
import { LoginModal } from './components/auth/LoginModal';
import { SignupModal } from './components/auth/SignupModal';

// Landing Page Sections
import { HeroSection } from './components/landing/HeroSection';
import { StatCounter } from './components/landing/StatCounter';
import { DomainCatalogue } from './components/landing/DomainCatalogue';
import { CompetencyShowcase } from './components/landing/CompetencyShowcase';
import { AnnouncementsSection } from './components/landing/AnnouncementsSection';
import { TrainerShowcase } from './components/landing/TrainerShowcase';

// Role Dashboards
import { TraineeDashboard } from './components/trainee/TraineeDashboard';
import { TrainerDashboard } from './components/trainer/TrainerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CoursePlayer } from './components/trainee/CoursePlayer';
import { MCQAssessmentEngine } from './components/trainee/MCQAssessmentEngine';

const MainContent = () => {
  const { currentView, currentRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#061329] dark:text-slate-100 transition-colors duration-200">
      {/* Evaluator Quick Role Switcher */}
      <QuickDemoBar />

      {/* Real-time MoES Broadcast Ticker */}
      <NotificationTicker />

      {/* Main Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <div className="space-y-12 pb-16">
            <HeroSection onSearch={setSearchQuery} searchQuery={searchQuery} />
            <StatCounter />
            <DomainCatalogue searchQuery={searchQuery} />
            <CompetencyShowcase />
            <AnnouncementsSection />
            <TrainerShowcase />
          </div>
        )}

        {currentView === 'trainee' && <TraineeDashboard />}
        {currentView === 'trainer' && <TrainerDashboard />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'player' && <CoursePlayer />}
        {currentView === 'quiz' && <MCQAssessmentEngine />}
      </main>

      {/* Common Modals & Overlays */}
      <CertificateModal />
      <FeedbackModal />
      <LoginModal />
      <SignupModal />
      <ToastContainer />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
