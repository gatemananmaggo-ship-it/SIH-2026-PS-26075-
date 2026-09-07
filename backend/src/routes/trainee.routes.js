// External Module
const express = require('express');

// local Controller
const {createProfile,getProfile,updateProfile} = require("../controllers/traineeProfile.controller")

const {getPublishedCourses} = require("../controllers/course.controller")

const {enrollCourse,getMyEnrollments} = require("../controllers/enrollment.controller")

const {getTraineeCourseLessons,markLessonComplete,getCourseProgress} = require("../controllers/lesson.controller")

const {
    getTraineeQuiz,
    getTraineeCourseQuizzes,
    submitQuizAttempt
} = require("../controllers/quiz.controller")

const {
    checkCertificateEligibility,
    generateCertificate,
    getCertificate,
    getMyCertificates,
    verifyCertificate
} = require("../controllers/certificate.controller");

const {
    submitFeedback
} = require("../controllers/feedback.controller");


// Local Middlewres
const authMiddleware = require("../middlewares/auth.middleware")
const roleMiddleware = require("../middlewares/role.middleware");
const { traineeAnalytics } = require('../controllers/analytics.controller');

const traineerouter = express.Router();

// ==============================
// PROFILE ROUTES
// ==============================

// Create trainee profile
traineerouter.post("/profile",authMiddleware,roleMiddleware("trainee"), createProfile);

// Get trainee profile
traineerouter.get("/profile",authMiddleware,roleMiddleware("trainee"),getProfile)

// Update trainee profile
traineerouter.put("/profile",authMiddleware,roleMiddleware("trainee"), updateProfile);

// ==============================
// COURSE ROUTES
// ==============================

// Get Published Courses
traineerouter.get("/courses",authMiddleware,roleMiddleware("trainee"), getPublishedCourses);


// ==============================
// ENROLLMENT ROUTES
// ==============================

// Enroll in Course
traineerouter.post("/courses/:courseId/enroll",authMiddleware,roleMiddleware("trainee"), enrollCourse);

// Get my enrollments
traineerouter.get("/enrollments",authMiddleware,roleMiddleware("trainee"), getMyEnrollments);

// ==============================
// LESSONS ROUTES
// ==============================

// lessons in Course
traineerouter.get("/courses/:courseId/lessons",authMiddleware,roleMiddleware("trainee"), getTraineeCourseLessons);


// lessons is Completed
traineerouter.post("/courses/:courseId/lessons/:lessonId/complete",authMiddleware,roleMiddleware("trainee"), markLessonComplete);

// Course progress
traineerouter.get("/courses/:courseId/progress",authMiddleware,roleMiddleware("trainee"), getCourseProgress);

// ==============================
// QUIZ ROUTES
// ==============================

traineerouter.get("/courses/:courseId/quizzes", authMiddleware, roleMiddleware("trainee"), getTraineeCourseQuizzes);

traineerouter.get("/courses/:courseId/quizzes/:quizId",authMiddleware, roleMiddleware("trainee"),getTraineeQuiz);

traineerouter.post("/courses/:courseId/quizzes/:quizId/attempt",authMiddleware, roleMiddleware("trainee"),submitQuizAttempt);

// ==============================
// CERTIFICATE ROUTES
// ==============================

traineerouter.get("/certificates", authMiddleware, roleMiddleware("trainee"), getMyCertificates);

traineerouter.get("/courses/:courseId/certificate/eligibility",authMiddleware,roleMiddleware("trainee"),checkCertificateEligibility);

traineerouter.post("/courses/:courseId/certificate",authMiddleware,roleMiddleware("trainee"),generateCertificate);

traineerouter.get("/courses/:courseId/certificate",authMiddleware,roleMiddleware("trainee"),getCertificate);

traineerouter.get("/certificates/verify/:certificateNumber",verifyCertificate)

// ==============================
// FEEDBACK ROUTES
// ==============================

traineerouter.post(
    "/courses/:courseId/feedback",
    authMiddleware,
    roleMiddleware("trainee"),
    submitFeedback
);

// ==============================
// ANALYTICS ROUTES
// ==============================

traineerouter.get(
    "/analytics",
    authMiddleware,
    roleMiddleware("trainee"),
    traineeAnalytics
);


module.exports= traineerouter;