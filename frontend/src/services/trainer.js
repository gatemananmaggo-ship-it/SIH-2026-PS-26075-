import { api } from "./api";

// ==============================
// PROFILE
// ==============================
export const getTrainerProfileApi = () => {
  return api.get("/trainer/profile");
};

export const createTrainerProfileApi = (profileData) => {
  return api.post("/trainer/profile", profileData);
};

export const updateTrainerProfileApi = (profileData) => {
  return api.put("/trainer/profile", profileData);
};

// ==============================
// COURSES
// ==============================
export const createCourseApi = (courseData) => {
  return api.post("/trainer/courses", courseData);
};

export const getMyCoursesApi = (params = { page: 1, limit: 10 }) => {
  return api.get("/trainer/courses", params);
};

export const updateCourseApi = (courseId, courseData) => {
  return api.put(`/trainer/courses/${courseId}`, courseData);
};

export const deleteCourseApi = (courseId) => {
  return api.delete(`/trainer/courses/${courseId}`);
};

export const publishCourseApi = (courseId) => {
  return api.patch(`/trainer/courses/${courseId}/publish`, {});
};

// ==============================
// TRAINER LIBRARY
// ==============================
export const getTrainerLibraryApi = (params = { page: 1, limit: 10 }) => {
  return api.get("/trainer/library", params);
};

// ==============================
// LESSONS
// ==============================
export const createLessonApi = (courseId, lessonData) => {
  return api.post(`/trainer/courses/${courseId}/lessons`, lessonData);
};

export const getCourseLessonsApi = (courseId) => {
  return api.get(`/trainer/courses/${courseId}/lessons`);
};

export const updateLessonApi = (courseId, lessonId, lessonData) => {
  return api.put(`/trainer/courses/${courseId}/lessons/${lessonId}`, lessonData);
};

export const deleteLessonApi = (courseId, lessonId) => {
  return api.delete(`/trainer/courses/${courseId}/lessons/${lessonId}`);
};

// ==============================
// QUIZZES
// ==============================
export const createQuizApi = (courseId, quizData) => {
  return api.post(`/trainer/courses/${courseId}/quizzes`, quizData);
};

export const addQuestionApi = (courseId, quizId, questionData) => {
  return api.post(`/trainer/courses/${courseId}/quizzes/${quizId}/questions`, questionData);
};

export const getQuizApi = (courseId, quizId) => {
  return api.get(`/trainer/courses/${courseId}/quizzes/${quizId}`);
};

export const updateQuizApi = (courseId, quizId, quizData) => {
  return api.put(`/trainer/courses/${courseId}/quizzes/${quizId}`, quizData);
};

export const publishQuizApi = (courseId, quizId) => {
  return api.patch(`/trainer/courses/${courseId}/quizzes/${quizId}/publish`, {});
};

export const deleteQuizApi = (courseId, quizId) => {
  return api.delete(`/trainer/courses/${courseId}/quizzes/${quizId}`);
};

export const getQuizResultsApi = (courseId, quizId, params = { page: 1, limit: 10 }) => {
  return api.get(`/trainer/courses/${courseId}/quizzes/${quizId}/results`, params);
};

// ==============================
// SESSIONS
// ==============================
export const createSessionApi = (sessionData) => {
  return api.post("/trainer/sessions", sessionData);
};

export const getTrainerSessionsApi = (params = { page: 1, limit: 10 }) => {
  return api.get("/trainer/sessions", params);
};

export const updateSessionApi = (sessionId, sessionData) => {
  return api.put(`/trainer/sessions/${sessionId}`, sessionData);
};

export const deleteSessionApi = (sessionId) => {
  return api.delete(`/trainer/sessions/${sessionId}`);
};

export const startSessionApi = (sessionId) => {
  return api.patch(`/trainer/sessions/${sessionId}/start`, {});
};

export const completeSessionApi = (sessionId, recordingUrl) => {
  return api.patch(`/trainer/sessions/${sessionId}/complete`, { recordingUrl });
};

export const updateSessionRecordingApi = (sessionId, recordingUrl) => {
  return api.patch(`/trainer/sessions/${sessionId}/recording`, { recordingUrl });
};

export const publishSessionApi = (sessionId) => {
  return api.post(`/trainer/sessions/${sessionId}/publish`, {});
};

// Get a fresh JaaS JWT for an in-progress session the trainer owns (Reopen Classroom)
export const trainerJoinSessionApi = (sessionId) => {
  return api.get(`/trainer/sessions/${sessionId}/join`);
};

// ==============================
// CERTIFICATES, FEEDBACK, STATS & ANALYTICS
// ==============================
export const getCourseCertificatesApi = (courseId) => {
  return api.get(`/trainer/courses/${courseId}/certificates`);
};

export const getCourseFeedbackApi = (courseId) => {
  return api.get(`/trainer/courses/${courseId}/feedback`);
};

export const getCourseEnrollmentStatsApi = (courseId) => {
  return api.get(`/trainer/courses/${courseId}/enrollments`);
};

export const getTrainerAnalyticsApi = () => {
  return api.get("/trainer/analytics");
};
