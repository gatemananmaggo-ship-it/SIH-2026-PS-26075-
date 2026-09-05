import { api } from "./api";

// ==============================
// USERS & APPROVALS
// ==============================
export const getAllUsersApi = (params = { page: 1, limit: 10 }) => {
  return api.get("/admin/users", params);
};

export const getPendingUsersApi = (params = { page: 1, limit: 10 }) => {
  return api.get("/admin/users/pending", params);
};

export const approveUserApi = (userId) => {
  return api.patch(`/admin/users/${userId}/approve`, {});
};

export const updateUserStatusApi = (userId, isActive) => {
  return api.patch(`/admin/users/${userId}/status`, { isActive });
};

export const changeUserRoleApi = (userId, role) => {
  return api.patch(`/admin/users/${userId}/role`, { role });
};

export const getDashboardStatsApi = () => {
  return api.get("/admin/dashboard");
};

// ==============================
// CERTIFICATES & FEEDBACK
// ==============================
export const getAllCertificatesApi = (params = { page: 1, limit: 10 }) => {
  return api.get("/admin/certificates", params);
};

export const getAllFeedbackApi = (params = { page: 1, limit: 10 }) => {
  return api.get("/admin/feedback", params);
};

// ==============================
// COMPETENCIES
// ==============================
export const createCompetencyApi = (competencyData) => {
  return api.post("/admin/competencies", competencyData);
};

export const getCompetenciesApi = async (params = { page: 1, limit: 10 }) => {
  try {
    return await api.get("/admin/competencies", params);
  } catch (err) {
    // Backend returns 404 when no competencies exist in collection
    if (err.status === 404 && err.data?.competencies !== undefined) {
      return err.data;
    }
    throw err;
  }
};

export const updateCompetencyApi = (competencyId, competencyData) => {
  return api.put(`/admin/competencies/${competencyId}`, competencyData);
};

export const deleteCompetencyApi = (competencyId) => {
  return api.delete(`/admin/competencies/${competencyId}`);
};

export const mapCompetenciesToCourseApi = (courseId, competencyIds) => {
  return api.patch(`/admin/courses/${courseId}/competencies`, { competencyIds });
};

// ==============================
// NOTIFICATIONS (CMS BROADCASTS)
// ==============================
export const createNotificationApi = (notificationData) => {
  return api.post("/admin/notifications", notificationData);
};

export const getNotificationsApi = async (params = { page: 1, limit: 10 }) => {
  try {
    return await api.get("/admin/notifications", params);
  } catch (err) {
    // Backend returns 404 when no notifications exist
    if (err.status === 404 && err.data?.notifications !== undefined) {
      return err.data;
    }
    throw err;
  }
};

export const updateNotificationApi = (notificationId, notificationData) => {
  return api.put(`/admin/notifications/${notificationId}`, notificationData);
};

export const deleteNotificationApi = (notificationId) => {
  return api.delete(`/admin/notifications/${notificationId}`);
};

// ==============================
// ANALYTICS
// ==============================
export const getAdminAnalyticsApi = () => {
  return api.get("/admin/analytics");
};
