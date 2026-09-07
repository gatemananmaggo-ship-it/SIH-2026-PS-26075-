import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { COMPETENCY_TAXONOMY, MOCK_TRAINER_CANDIDATES, REGIONAL_IMD_CENTERS } from '../data/competencyData';

import { loginApi, registerApi, getSessionApi, logoutApi } from '../services/auth';
import { enrollCourseApi, submitFeedbackApi, getPublishedCoursesApi, getMyEnrollmentsApi, getTraineeCourseQuizzesApi } from '../services/trainee';
import { getMyCoursesApi } from '../services/trainer';
import { getAllUsersApi } from '../services/admin';
import { getHomepageApi } from '../services/homepage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Only store preferences (theme & language) in localStorage
  const getStoredPref = (key, fallback) => {
    try {
      const item = localStorage.getItem(`moes_cc_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  // Auth & Session State
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('guest'); // 'guest' | 'trainee' | 'trainer' | 'admin'
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Navigation State
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'trainee', 'trainer', 'admin', 'player', 'quiz'
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeAssessmentId, setActiveAssessmentId] = useState(null);
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [activeFeedbackCourse, setActiveFeedbackCourse] = useState(null);
  const [activeLiveSession, setActiveLiveSession] = useState(null); // { session, meetingUrl, isTrainer }

  // Core Data Stores (initialized empty, loaded dynamically from real backend)
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [trainerMaterials, setTrainerMaterials] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);

  // Auth modal
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  // Preferences (Theme & Language)
  const [darkMode, setDarkMode] = useState(() => getStoredPref('dark_mode', false));
  const [language, setLanguage] = useState(() => getStoredPref('language', 'en'));

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem('moes_cc_dark_mode', JSON.stringify(darkMode));
    } catch {}
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('moes_cc_language', JSON.stringify(language));
    } catch {}
  }, [language]);

  // Dark mode document class sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load role-specific data from real backend
  const loadUserDomainData = useCallback(async (role) => {
    if (role === 'trainee') {
      try {
        const [coursesRes, enrollRes] = await Promise.allSettled([
          getPublishedCoursesApi({ page: 1, limit: 50 }),
          getMyEnrollmentsApi({ page: 1, limit: 50 })
        ]);

        let publishedCourses = [];
        if (coursesRes.status === 'fulfilled' && coursesRes.value?.courses) {
          publishedCourses = coursesRes.value.courses;
          setCourses(publishedCourses);
        }

        let enrolledCourses = [];
        if (enrollRes.status === 'fulfilled' && enrollRes.value?.enrollments) {
          enrolledCourses = enrollRes.value.enrollments
            .map(e => e.courseId)
            .filter(Boolean);
        }

        const effectiveCourses = enrolledCourses.length > 0 ? enrolledCourses : publishedCourses;
        if (effectiveCourses.length > 0) {
          const quizResults = await Promise.allSettled(
            effectiveCourses.map(c => getTraineeCourseQuizzesApi(c._id || c.id))
          );

          let realQuizzes = [];
          quizResults.forEach((res, idx) => {
            if (res.status === 'fulfilled' && res.value?.quizzes) {
              const c = effectiveCourses[idx];
              const courseQuizzes = res.value.quizzes.map(q => ({
                ...q,
                id: q._id || q.id,
                courseId: c._id || c.id,
                courseTitle: c.title,
                creatorName: c.trainerId?.name || "MoES Faculty"
              }));
              realQuizzes.push(...courseQuizzes);
            }
          });

          setAssessments(realQuizzes);
        } else {
          setAssessments([]);
        }
      } catch (e) {
        console.log('Error fetching trainee courses & assessments:', e);
      }
    } else if (role === 'trainer') {
      try {
        const res = await getMyCoursesApi({ page: 1, limit: 50 });
        if (res && res.courses) {
          setCourses(res.courses);
          const trainerAssessments = res.courses.map((c, idx) => ({
            id: c.assessmentId || c._id || `quiz-${idx}`,
            _id: c.assessmentId || c._id,
            courseId: c._id || c.id,
            courseTitle: c.title,
            title: `${c.title} — Competency Assessment`,
            description: c.description || `Assessment evaluating domain proficiency for ${c.title}`,
            passingScore: 70,
            passingMarks: 70,
            durationMinutes: 15,
            totalQuestions: 5,
            creatorName: "Trainer Faculty",
            questions: []
          }));
          setAssessments(prev => {
            const custom = prev.filter(p => !trainerAssessments.some(d => (d._id && d._id === p._id) || (d.id && d.id === p.id)));
            return [...custom, ...trainerAssessments];
          });
        }
      } catch (e) {
        console.log('Error fetching trainer courses:', e);
      }
    } else if (role === 'admin') {
      try {
        const res = await getAllUsersApi({ page: 1, limit: 50 });
        if (res && res.users) setUsers(res.users);
      } catch (e) {
        console.log('Error fetching admin users:', e);
      }
    }
  }, []);

  // ==========================================
  // REAL SESSION RESTORATION ON APP STARTUP
  // ==========================================
  const checkSession = useCallback(async () => {
    try {
      setAuthLoading(true);
      const res = await getSessionApi();
      if (res && res.authenticated && res.user) {
        setCurrentUser({
          ...res.user,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        });
        setCurrentRole(res.user.role);
        setCurrentView(res.user.role);
        setIsAuthenticated(true);
        setIsDemoMode(false);
        loadUserDomainData(res.user.role);
      } else {
        setCurrentUser(null);
        setCurrentRole('guest');
        setIsAuthenticated(false);
      }
    } catch {
      // User is not logged in / session expired
      setCurrentUser(null);
      setCurrentRole('guest');
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }, [loadUserDomainData]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Fetch Homepage Broadcasts from Backend
  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const data = await getHomepageApi();
        const rawNotifications = data?.notifications || data?.circulars || [];
        if (Array.isArray(rawNotifications) && rawNotifications.length > 0) {
          setAnnouncements(rawNotifications.map((c, idx) => ({
            id: c._id || `ann-${idx}`,
            title: c.title || 'Official MoES Circular',
            category: c.type || c.category || 'announcement',
            date: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            urgent: !!c.isPinned,
            publishedBy: 'MoES Training Cell',
            summary: c.body || c.description || c.summary || c.title,
            linkText: 'Read Circular'
          })));
        } else {
          setAnnouncements([]);
        }
      } catch {
        setAnnouncements([]);
      }
    };
    loadHomepageData();
  }, []);

  // ==========================================
  // AUTHENTICATION METHODS
  // ==========================================
  const loginUser = async (email, password) => {
    try {
      setAuthLoading(true);
      const res = await loginApi(email, password);
      if (res && res.user) {
        const userObj = {
          ...res.user,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        };
        setCurrentUser(userObj);
        setCurrentRole(res.user.role);
        setCurrentView(res.user.role);
        setIsAuthenticated(true);
        setIsDemoMode(false);
        setAuthModal({ isOpen: false, mode: 'login' });
        showToast(res.message || `Welcome back, ${res.user.name}!`, "success");
        loadUserDomainData(res.user.role);
        return { success: true, user: res.user };
      }
    } catch (err) {
      const msg = err.data?.message || err.message || "Login failed. Please check your credentials.";
      showToast(msg, "warning");
      return { success: false, error: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      setAuthLoading(true);
      const res = await registerApi({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      });

      setAuthModal({ isOpen: true, mode: 'login' });
      showToast(res.message || "Registration successful! Your account requires Administrator approval before you can sign in.", "success");
      return { success: true };
    } catch (err) {
      const msg = err.data?.message || err.message || "Registration failed. Please check inputs.";
      showToast(msg, "warning");
      return { success: false, error: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    } finally {
      setCurrentUser(null);
      setCurrentRole('guest');
      setIsAuthenticated(false);
      setIsDemoMode(false);
      setCurrentView('landing');
      setCourses([]);
      setUsers([]);
      showToast("Logged out successfully.", "info");
    }
  };

  // Switch role / Open Auth modal
  const switchRole = (role) => {
    if (role === 'guest') {
      setCurrentRole('guest');
      setCurrentUser(null);
      setIsDemoMode(false);
      setCurrentView('landing');
      showToast("Browsing as Guest Visitor", "info");
      return;
    }

    setAuthModal({ isOpen: true, mode: 'login' });
  };

  // ==========================================
  // TRAINEE ACTIONS
  // ==========================================
  const enrollCourse = async (courseId) => {
    if (!currentUser || currentRole !== 'trainee') {
      setAuthModal({ isOpen: true, mode: 'login' });
      showToast("Please login as a Trainee to enroll.", "warning");
      return;
    }

    if (isDemoMode) {
      showToast("Enrolled in demo course!", "success");
      openCoursePlayer(courseId);
      return;
    }

    try {
      await enrollCourseApi(courseId);
      showToast("Successfully enrolled in course!", "success");
      openCoursePlayer(courseId);
    } catch (err) {
      const msg = err.data?.message || err.message || "Enrollment failed";
      if (err.status === 409 || msg.toLowerCase().includes("already")) {
        showToast("Already enrolled in this course.", "info");
        openCoursePlayer(courseId);
      } else {
        showToast(msg, "warning");
      }
    }
  };

  const openCoursePlayer = (courseId) => {
    setActiveCourseId(courseId);
    setCurrentView('player');
  };

  const toggleModuleProgress = (courseId, moduleId) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId || c._id === courseId) {
        return {
          ...c,
          modules: (c.modules || []).map(m => (m.id === moduleId || m._id === moduleId) ? { ...m, completed: !m.completed } : m)
        };
      }
      return c;
    }));
    showToast("Module progress updated", "info");
  };

  const openQuiz = (quizId, courseId = null) => {
    setActiveAssessmentId(quizId);
    if (courseId) {
      setActiveCourseId(courseId);
    }
    setCurrentView('quiz');
  };

  // jaas: { appId, roomName, jwt, domain } — returned by backend after authorization
  const startLiveClassroom = (session, jaas, isTrainer = false) => {
    setActiveLiveSession({
      session,
      jaas,    // short-lived JaaS join credentials from backend
      isTrainer
    });
    setCurrentView('live-session');
  };

  const exitLiveClassroom = () => {
    setActiveLiveSession(null);
    setCurrentView(currentRole === 'trainer' ? 'trainer' : 'trainee');
  };

  const submitQuizAnswers = (quizId, scorePercentage) => {
    const assessment = assessments.find(a => a.id === quizId || a._id === quizId);
    const passed = scorePercentage >= (assessment?.passingScore || 70);

    if (passed && currentUser) {
      const newCert = {
        id: `CERT-MOES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        courseId: assessment?.courseId || "crs-01",
        courseTitle: assessment?.courseTitle || "MoES Certified Program",
        issueDate: new Date().toISOString().split('T')[0],
        score: scorePercentage,
        grade: scorePercentage >= 90 ? "Distinction" : scorePercentage >= 80 ? "First Class" : "Pass",
        trainerName: assessment?.creatorName || "MoES Faculty",
        verificationHash: Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 6)
      };

      setActiveCertificate(newCert);
      showToast(`Congratulations! You passed with ${scorePercentage}%. Certificate issued!`, "success");
    } else {
      showToast(`Assessment completed. Score: ${scorePercentage}%. Passing score is ${assessment?.passingScore || 70}%.`, "warning");
    }

    return passed;
  };

  const submitFeedback = async (courseId, rating, comment) => {
    if (isDemoMode) {
      setActiveFeedbackCourse(null);
      showToast("Thank you! Your feedback has been submitted (Demo Mode).", "success");
      return;
    }

    try {
      await submitFeedbackApi(courseId, { rating, comment });
      setActiveFeedbackCourse(null);
      showToast("Thank you! Your feedback has been submitted.", "success");
    } catch (err) {
      showToast(err.data?.message || "Failed to submit feedback", "warning");
    }
  };

  const updateTraineeProfile = (updatedData) => {
    setCurrentUser(prev => prev ? { ...prev, ...updatedData } : updatedData);
    showToast("Profile updated successfully!", "success");
  };

  // ==========================================
  // TRAINER ACTIONS
  // ==========================================
  const addAssessment = (assessmentObj) => {
    setAssessments(prev => [assessmentObj, ...prev]);
    showToast(`Assessment "${assessmentObj.title}" published successfully!`, "success");
  };

  const uploadTrainerMaterial = (materialObj) => {
    setTrainerMaterials(prev => [materialObj, ...prev]);
    showToast(`Resource "${materialObj.title}" uploaded to Trainer Library!`, "success");
  };

  const deleteTrainerMaterial = (matId) => {
    setTrainerMaterials(prev => prev.filter(m => m.id !== matId));
    showToast("Material removed from library.", "info");
  };

  const createLiveSession = (sessObj) => {
    setLiveSessions(prev => [sessObj, ...prev]);
    showToast(`Masterclass session scheduled!`, "success");
  };

  // ==========================================
  // ADMIN ACTIONS
  // ==========================================
  const approveUser = (userId) => {
    setUsers(prev => prev.map(u => (u.id === userId || u._id === userId) ? { ...u, status: 'approved', isApproved: true } : u));
    showToast("User account approved and activated!", "success");
  };

  const rejectUser = (userId) => {
    setUsers(prev => prev.filter(u => (u.id !== userId && u._id !== userId)));
    showToast("User registration rejected.", "info");
  };

  const changeUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(u => (u.id === userId || u._id === userId) ? { ...u, role: newRole } : u));
    showToast(`User role updated to ${newRole.toUpperCase()}`, "success");
  };

  const addAnnouncement = (annObj) => {
    setAnnouncements(prev => [annObj, ...prev]);
    showToast("Announcement published to portal homepage!", "success");
  };

  const deleteAnnouncement = (annId) => {
    setAnnouncements(prev => prev.filter(a => a.id !== annId && a._id !== annId));
    showToast("Announcement removed.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        courses,
        setCourses,
        assessments,
        announcements,
        trainerMaterials,
        liveSessions,
        currentRole,
        setCurrentRole,
        currentUser,
        currentUserId: currentUser?.id || currentUser?._id,
        currentView,
        setCurrentView,
        activeCourseId,
        setActiveCourseId,
        activeAssessmentId,
        setActiveAssessmentId,
        activeCertificate,
        setActiveCertificate,
        activeFeedbackCourse,
        setActiveFeedbackCourse,
        authModal,
        setAuthModal,
        authLoading,
        isAuthenticated,
        isDemoMode,
        darkMode,
        setDarkMode,
        language,
        setLanguage,
        toasts,
        showToast,
        switchRole,
        enrollCourse,
        openCoursePlayer,
        toggleModuleProgress,
        openQuiz,
        startLiveClassroom,
        exitLiveClassroom,
        activeLiveSession,
        submitQuizAnswers,
        submitFeedback,
        updateTraineeProfile,
        addAssessment,
        uploadTrainerMaterial,
        deleteTrainerMaterial,
        createLiveSession,
        approveUser,
        rejectUser,
        changeUserRole,
        addAnnouncement,
        deleteAnnouncement,
        registerUser,
        loginUser,
        logoutUser,
        checkSession,
        refreshGlobalData: () => loadUserDomainData(currentRole),
        taxonomies: COMPETENCY_TAXONOMY,
        trainerCandidates: MOCK_TRAINER_CANDIDATES,
        regionalCenters: REGIONAL_IMD_CENTERS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
