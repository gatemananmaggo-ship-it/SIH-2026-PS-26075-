import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialUsers';
import { INITIAL_COURSES } from '../data/initialCourses';
import { INITIAL_ASSESSMENTS } from '../data/initialAssessments';
import { INITIAL_ANNOUNCEMENTS } from '../data/initialAnnouncements';
import { COMPETENCY_TAXONOMY, MOCK_TRAINER_CANDIDATES, REGIONAL_IMD_CENTERS } from '../data/competencyData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // LocalStorage initialization with fallbacks
  const getStored = (key, fallback) => {
    try {
      const item = localStorage.getItem(`moes_cc_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [users, setUsers] = useState(() => getStored('users', INITIAL_USERS));
  const [courses, setCourses] = useState(() => getStored('courses', INITIAL_COURSES));
  const [assessments, setAssessments] = useState(() => getStored('assessments', INITIAL_ASSESSMENTS));
  const [announcements, setAnnouncements] = useState(() => getStored('announcements', INITIAL_ANNOUNCEMENTS));
  
  // Trainer uploaded materials store
  const [trainerMaterials, setTrainerMaterials] = useState(() => getStored('trainer_materials', [
    {
      id: "mat-01",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Rajesh K. Verma",
      title: "Dual-Pol Radar Doppler Spectrum Analysis Handbook (2026 Edition)",
      domain: "Radar Meteorology",
      fileType: "PDF",
      fileSize: "12.4 MB",
      uploadDate: "2026-08-10",
      downloads: 142,
      accessRole: "All Trainees",
      description: "Complete reference handbook containing case studies of severe squall lines over Gangetic plains."
    },
    {
      id: "mat-02",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Rajesh K. Verma",
      title: "Sample NetCDF Volume Scan: Kolkata Supercell Thunderstorm (May 2024)",
      domain: "Radar Meteorology",
      fileType: "NetCDF",
      fileSize: "48.2 MB",
      uploadDate: "2026-08-14",
      downloads: 89,
      accessRole: "Enrolled Trainees",
      description: "Full polarimetric radar volumetric scan data (Z_H, Z_DR, K_DP, Rho_HV) for laboratory assignment."
    },
    {
      id: "mat-03",
      trainerId: "usr-trainer-02",
      trainerName: "Dr. P. V. Ramana",
      title: "ADCIRC Storm Surge Grid Generation & Boundary Conditions",
      domain: "Oceanography",
      fileType: "PPTX",
      fileSize: "18.7 MB",
      uploadDate: "2026-08-18",
      downloads: 64,
      accessRole: "All Trainees",
      description: "Lecture presentation slides detailing unstructured mesh generation for the Bay of Bengal coastline."
    }
  ]));

  // Live Scheduled Sessions
  const [liveSessions, setLiveSessions] = useState(() => getStored('live_sessions', [
    {
      id: "sess-01",
      title: "Interactive Masterclass: Real-Time Doppler Velocity De-aliasing",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Rajesh K. Verma",
      date: "2026-08-28",
      time: "14:30 - 16:30 IST",
      meetUrl: "https://meet.moes.gov.in/imd-radar-masterclass-2026",
      registeredCount: 88,
      status: "Upcoming",
      department: "IMD Radar Division"
    },
    {
      id: "sess-02",
      title: "Hands-on Lab: ADCIRC Storm Surge Modeling Workshop",
      trainerId: "usr-trainer-02",
      trainerName: "Dr. P. V. Ramana",
      date: "2026-09-02",
      time: "10:00 - 12:30 IST",
      meetUrl: "https://meet.incois.gov.in/surge-workshop-09",
      registeredCount: 62,
      status: "Upcoming",
      department: "INCOIS Ocean Modeling"
    }
  ]));

  // Active Role and Logged In User
  const [currentRole, setCurrentRole] = useState(() => getStored('current_role', 'trainee'));
  const [currentUserId, setCurrentUserId] = useState(() => getStored('current_user_id', 'usr-trainee-01'));
  
  // Navigation State
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'trainee', 'trainer', 'admin', 'player', 'quiz'
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeAssessmentId, setActiveAssessmentId] = useState(null);
  const [activeCertificate, setActiveCertificate] = useState(null); // certificate object to view in modal
  const [activeFeedbackCourse, setActiveFeedbackCourse] = useState(null); // course object to rate

  // Auth modal
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' }); // 'login' | 'signup'

  // Dark Mode & Language
  const [darkMode, setDarkMode] = useState(() => getStored('dark_mode', false));
  const [language, setLanguage] = useState(() => getStored('language', 'en')); // 'en' | 'hi'

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('moes_cc_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('moes_cc_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('moes_cc_assessments', JSON.stringify(assessments)); }, [assessments]);
  useEffect(() => { localStorage.setItem('moes_cc_announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('moes_cc_trainer_materials', JSON.stringify(trainerMaterials)); }, [trainerMaterials]);
  useEffect(() => { localStorage.setItem('moes_cc_live_sessions', JSON.stringify(liveSessions)); }, [liveSessions]);
  useEffect(() => { localStorage.setItem('moes_cc_current_role', JSON.stringify(currentRole)); }, [currentRole]);
  useEffect(() => { localStorage.setItem('moes_cc_current_user_id', JSON.stringify(currentUserId)); }, [currentUserId]);
  useEffect(() => { localStorage.setItem('moes_cc_dark_mode', JSON.stringify(darkMode)); }, [darkMode]);
  useEffect(() => { localStorage.setItem('moes_cc_language', JSON.stringify(language)); }, [language]);

  // Dark mode document class sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // Quick Role Switching (For Evaluators / Demo)
  const switchRole = (role) => {
    if (role === 'guest') {
      setCurrentRole('guest');
      setCurrentUserId(null);
      setCurrentView('landing');
      showToast("Browsing as Guest Visitor", "info");
      return;
    }

    let targetUser = users.find(u => u.role === role && u.status === 'approved');
    if (!targetUser) {
      targetUser = users.find(u => u.role === role);
    }
    
    if (targetUser) {
      setCurrentRole(role);
      setCurrentUserId(targetUser.id);
      setCurrentView(role);
      showToast(`Switched to ${role.toUpperCase()} View (${targetUser.name})`, 'success');
    }
  };

  // Trainee Actions
  const enrollCourse = (courseId) => {
    if (!currentUser || currentUser.role !== 'trainee') {
      setAuthModal({ isOpen: true, mode: 'login' });
      showToast("Please login as a Trainee to enroll.", "warning");
      return;
    }

    if (currentUser.enrolledCourses?.includes(courseId)) {
      showToast("Already enrolled in this course.", "info");
      openCoursePlayer(courseId);
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          enrolledCourses: [...(u.enrolledCourses || []), courseId]
        };
      }
      return u;
    }));

    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, enrolledCount: (c.enrolledCount || 0) + 1 };
      }
      return c;
    }));

    showToast("Successfully enrolled in course!", "success");
    openCoursePlayer(courseId);
  };

  const openCoursePlayer = (courseId) => {
    setActiveCourseId(courseId);
    setCurrentView('player');
  };

  const toggleModuleProgress = (courseId, moduleId) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: c.modules.map(m => m.id === moduleId ? { ...m, completed: !m.completed } : m)
        };
      }
      return c;
    }));
    showToast("Module progress updated", "info");
  };

  const openQuiz = (quizId) => {
    setActiveAssessmentId(quizId);
    setCurrentView('quiz');
  };

  const submitQuizAnswers = (quizId, scorePercentage, answers) => {
    const assessment = assessments.find(a => a.id === quizId);
    const passed = scorePercentage >= (assessment?.passingScore || 70);

    if (passed && currentUser) {
      // Award certificate
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

      setUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          const existingCerts = u.certificates || [];
          const existingCompleted = u.completedCourses || [];
          return {
            ...u,
            certificates: [...existingCerts.filter(c => c.courseId !== assessment.courseId), newCert],
            completedCourses: [...new Set([...existingCompleted, assessment.courseId])]
          };
        }
        return u;
      }));

      setActiveCertificate(newCert);
      showToast(`Congratulations! You passed with ${scorePercentage}%. Certificate issued!`, "success");
    } else {
      showToast(`Assessment completed. Score: ${scorePercentage}%. Passing score is ${assessment?.passingScore || 70}%.`, "warning");
    }

    return passed;
  };

  const submitFeedback = (courseId, rating, comment) => {
    const feedbackEntry = {
      userName: currentUser?.name || "Anonymous Trainee",
      userAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      rating,
      date: new Date().toISOString().split('T')[0],
      comment
    };

    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const feedbacks = c.feedbacks || [];
        const updatedFeedbacks = [feedbackEntry, ...feedbacks];
        const newRating = Number((updatedFeedbacks.reduce((acc, f) => acc + f.rating, 0) / updatedFeedbacks.length).toFixed(1));
        return {
          ...c,
          feedbacks: updatedFeedbacks,
          rating: newRating,
          totalRatings: updatedFeedbacks.length
        };
      }
      return c;
    }));

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser?.id) {
        return {
          ...u,
          feedbacksSubmitted: [...(u.feedbacksSubmitted || []), { courseId, rating, review: comment, date: new Date().toISOString().split('T')[0] }]
        };
      }
      return u;
    }));

    setActiveFeedbackCourse(null);
    showToast("Thank you! Your feedback has been submitted.", "success");
  };

  const updateTraineeProfile = (updatedData) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedData } : u));
    showToast("Profile updated successfully!", "success");
  };

  // Trainer Actions
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

  // Admin Actions
  const approveUser = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'approved' } : u));
    showToast("User account approved and activated!", "success");
  };

  const rejectUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast("User registration rejected.", "info");
  };

  const changeUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast(`User role updated to ${newRole.toUpperCase()}`, "success");
  };

  const addAnnouncement = (annObj) => {
    setAnnouncements(prev => [annObj, ...prev]);
    showToast("Announcement published to portal homepage!", "success");
  };

  const deleteAnnouncement = (annId) => {
    setAnnouncements(prev => prev.filter(a => a.id !== annId));
    showToast("Announcement removed.", "info");
  };

  // User Registration
  const registerUser = (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      ...userData,
      status: "pending", // Requires Admin approval as per problem statement
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      qualifications: userData.qualifications || [],
      skills: userData.skills || [],
      interests: userData.interests || [],
      experience: userData.experience || []
    };

    setUsers(prev => [...prev, newUser]);
    setAuthModal({ isOpen: false, mode: 'login' });
    showToast("Registration submitted! Pending Administrator approval.", "success");
  };

  // Login
  const loginUser = (email, role) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() || (u.role === role && u.status === 'approved'));
    if (foundUser) {
      if (foundUser.status === 'pending') {
        showToast("Your account is pending Admin approval. Please check back shortly.", "warning");
        return;
      }
      setCurrentRole(foundUser.role);
      setCurrentUserId(foundUser.id);
      setCurrentView(foundUser.role);
      setAuthModal({ isOpen: false, mode: 'login' });
      showToast(`Welcome back, ${foundUser.name}!`, "success");
    } else {
      showToast("Account not found. Please check details or sign up.", "warning");
    }
  };

  return (
    <AppContext.Provider
      value={{
        users,
        courses,
        assessments,
        announcements,
        trainerMaterials,
        liveSessions,
        currentRole,
        currentUser,
        currentUserId,
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
