import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  BookOpen, 
  Award, 
  FileCheck, 
  FolderGit2, 
  ShieldCheck, 
  Users, 
  Sun, 
  Moon, 
  Globe, 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Radio, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentRole, 
    currentUser, 
    currentView, 
    setCurrentView, 
    setAuthModal, 
    darkMode, 
    setDarkMode, 
    language, 
    setLanguage, 
    switchRole 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const getNavLinks = () => {
    switch (currentRole) {
      case 'trainee':
        return [
          { id: 'landing', label: language === 'en' ? 'Portal Home' : 'मुख्य पृष्ठ', icon: Compass },
          { id: 'trainee', label: language === 'en' ? 'My Dashboard' : 'मेरा डैशबोर्ड', icon: BookOpen },
          { id: 'certificates', label: language === 'en' ? 'Certificates' : 'प्रमाणपत्र', icon: Award },
        ];
      case 'trainer':
        return [
          { id: 'landing', label: language === 'en' ? 'Portal Home' : 'मुख्य पृष्ठ', icon: Compass },
          { id: 'trainer', label: language === 'en' ? 'Trainer Hub' : 'प्रशिक्षक हब', icon: FolderGit2 },
        ];
      case 'admin':
        return [
          { id: 'landing', label: language === 'en' ? 'Portal Home' : 'मुख्य पृष्ठ', icon: Compass },
          { id: 'admin', label: language === 'en' ? 'Admin Console' : 'व्यवस्थापक कंसोल', icon: ShieldCheck },
        ];
      default:
        return [
          { id: 'landing', label: language === 'en' ? 'Home' : 'मुख्य पृष्ठ', icon: Compass },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-7 z-40 glass-nav shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & MoES / IMD Branding */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentView('landing')}
          >
            {/* MoES Emblem Representation */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-moes-700 via-moes-800 to-navy-900 text-white shadow-md shadow-moes-500/20 border border-moes-400/30 overflow-hidden">
              <Radio className="w-6 h-6 text-sky-300 animate-pulse-slow" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[8px] font-black text-slate-950">
                IN
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-moes-700 via-moes-500 to-sky-400 dark:from-sky-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  CAPACITY CONNECT
                </span>
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700/50 uppercase">
                  MoES • IMD
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                {language === 'en' 
                  ? 'Digital Capacity Building & LMS Portal' 
                  : 'डिजिटल क्षमता निर्माण एवं शिक्षण प्रबंधन पोर्टल'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = (currentView === link.id) || (link.id === 'certificates' && currentView === 'trainee');
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id === 'certificates' ? 'trainee' : link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-moes-50 text-moes-700 dark:bg-moes-900/50 dark:text-sky-300 shadow-sm border border-moes-200 dark:border-moes-700/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-moes-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Language, Dark Mode, Auth / Profile */}
          <div className="flex items-center gap-2.5">
            {/* Bilingual Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              title="Toggle English / Hindi"
            >
              <Globe className="w-3.5 h-3.5 text-moes-500" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile / Auth State */}
            {currentUser && currentRole !== 'guest' ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-moes-400 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-moes-500"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-moes-600 dark:text-sky-400 font-semibold uppercase">
                      {currentUser.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 glass-card rounded-xl shadow-xl py-2 z-50 border border-slate-200 dark:border-slate-700 animate-fadeIn"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700/60">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-moes-600 dark:text-sky-400 mt-0.5">{currentUser.organization || 'Ministry of Earth Sciences'}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView(currentUser.role);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-moes-50 dark:hover:bg-moes-900/40 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-moes-500" />
                      <span>{currentUser.role === 'trainee' ? 'My Learning & Profile' : currentUser.role === 'trainer' ? 'Trainer Workspace' : 'Admin Operations'}</span>
                    </button>

                    <button
                      onClick={() => {
                        switchRole('guest');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out / Switch to Guest</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-moes-600 text-white hover:bg-moes-700 shadow-sm transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-300 dark:border-slate-700 transition"
                >
                  <UserPlus className="w-3.5 h-3.5 text-moes-500" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentView(link.id === 'certificates' ? 'trainee' : link.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-moes-50 dark:hover:bg-moes-900/40"
              >
                <Icon className="w-4 h-4 text-moes-500" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
