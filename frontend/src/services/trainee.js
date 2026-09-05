import { api } from "./api";

// ==============================
// PROFILE
// ==============================
export const getTraineeProfileApi = () => {
  return api.get("/trainee/profile");
};

export const createTraineeProfileApi = (profileData) => {
  return api.post("/trainee/profile", profileData);
};

export const updateTraineeProfileApi = (profileData) => {
  return api.put("/trainee/profile", profileData);
};

// ==============================
// COURSES & ENROLLMENTS
// ==============================
export const getPublishedCoursesApi = (params = { page: 1, limit: 10 }) => {
  return api.get("/trainee/courses", params);
};

export const enrollCourseApi = (courseId) => {
  return api.post(`/trainee/courses/${courseId}/enroll`, {});
};

export const getMyEnrollmentsApi = (params = { page: 1, limit: 10 }) => {
  return api.get("/trainee/enrollments", params);
};

// ==============================
// LESSONS & PROGRESS
// ==============================
export const getTraineeCourseLessonsApi = (courseId) => {
  return api.get(`/trainee/courses/${courseId}/lessons`);
};

export const markLessonCompleteApi = (courseId, lessonId) => {
  return api.post(`/trainee/courses/${courseId}/lessons/${lessonId}/complete`, {});
};

export const getCourseProgressApi = (courseId) => {
  return api.get(`/trainee/courses/${courseId}/progress`);
};

// ==============================
// QUIZZES
// ==============================
export const getTraineeQuizApi = (courseId, quizId) => {
  return api.get(`/trainee/courses/${courseId}/quizzes/${quizId}`);
};

export const submitQuizAttemptApi = (courseId, quizId, answers) => {
  return api.post(`/trainee/courses/${courseId}/quizzes/${quizId}/attempt`, { answers });
};

// ==============================
// CERTIFICATES
// ==============================
export const checkCertificateEligibilityApi = (courseId) => {
  return api.get(`/trainee/courses/${courseId}/certificate/eligibility`);
};

export const generateCertificateApi = (courseId) => {
  return api.post(`/trainee/courses/${courseId}/certificate`, {});
};

export const getCertificateApi = (courseId) => {
  return api.get(`/trainee/courses/${courseId}/certificate`);
};

export const verifyCertificateApi = (certificateNumber) => {
  return api.get(`/trainee/certificates/verify/${certificateNumber}`);
};

// ==============================
// FEEDBACK
// ==============================
export const submitFeedbackApi = (courseId, { rating, comment }) => {
  return api.post(`/trainee/courses/${courseId}/feedback`, { rating, comment });
};

// ==============================
// ANALYTICS
// ==============================
export const getTraineeAnalyticsApi = () => {
  return api.get("/trainee/analytics");
};

// ==============================
// SESSIONS
// ==============================
export const getTraineeSessionsApi = (params = { page: 1, limit: 10 }) => {
  return api.get("/trainee/sessions", params);
};

export const enrollTraineeInSessionApi = (sessionId) => {
  return api.post(`/trainee/sessions/${sessionId}/enroll`, {});
};

export const cancelSessionEnrollmentApi = (sessionId) => {
  return api.delete(`/trainee/sessions/${sessionId}/enroll`);
};
