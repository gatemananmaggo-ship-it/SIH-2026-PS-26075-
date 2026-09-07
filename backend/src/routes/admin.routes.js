// External Module
const express = require('express');

// local Controller
const {
    getAllUsers,
    getPendingUsers,
    approveUser,
    updateUserStatus,
    changeUserRole,
    getDashboardStats
} = require("../controllers/admin.controller")

const {
    getAllCertificates
} = require("../controllers/certificate.controller");

const {
    getAllFeedback
} = require("../controllers/feedback.controller");

const {
    mapCompetenciesToCourse
} = require("../controllers/course.controller");

const {
    adminAnalytics
} = require("../controllers/analytics.controller");

const {
    optimizeTrainerAssignments
} = require("../controllers/assignmentOptimization.controller");

// Local Middlewres
const authMiddleware = require("../middlewares/auth.middleware")
const roleMiddleware = require("../middlewares/role.middleware")

const adminrouter = express.Router();


// Fetch all Users
adminrouter.get("/users",authMiddleware,roleMiddleware("admin"),getAllUsers)

// Fetch all pending Users
adminrouter.get("/users/pending",authMiddleware,roleMiddleware("admin"),getPendingUsers)

// Approving User
adminrouter.patch("/users/:id/approve",authMiddleware,roleMiddleware("admin"),approveUser)

// Activate/Deactivate User
adminrouter.patch("/users/:id/status",authMiddleware,roleMiddleware("admin"),updateUserStatus)

// Change User role
adminrouter.patch("/users/:id/role",authMiddleware,roleMiddleware("admin"),changeUserRole)

// Dashboard stats
adminrouter.get("/dashboard",authMiddleware,roleMiddleware("admin"),getDashboardStats)

// Get all certificates
adminrouter.get("/certificates",authMiddleware,roleMiddleware("admin"),getAllCertificates)

adminrouter.get("/feedback",authMiddleware,roleMiddleware("admin"),getAllFeedback)

adminrouter.patch("/courses/:courseId/competencies",authMiddleware,roleMiddleware("admin"),mapCompetenciesToCourse);

adminrouter.get("/analytics",authMiddleware,roleMiddleware("admin"),adminAnalytics);

// ML Trainer Assignment Optimization
adminrouter.post("/trainer-assignments/optimize",authMiddleware,roleMiddleware("admin"),optimizeTrainerAssignments);


module.exports= adminrouter;