// External Module
const express = require('express');

// local Controller
const {createProfile,getProfile,updateProfile} = require("../controllers/trainerProfile.controller")

const {getCourseEnrollmentStats} = require("../controllers/enrollment.controller")

const {
    createLesson,
    getCourseLessons,
    updateLesson,
    deleteLesson
} = require("../controllers/lesson.controller")

const {
    createQuiz,
    addQuestion,
    getQuiz,
    updateQuiz,
    publishQuiz,
    deleteQuiz,
    getQuizResults
} = require("../controllers/quiz.controller");

const {
    getCourseCertificates
} = require("../controllers/certificate.controller");
const {
    getCourseFeedback
} = require("../controllers/feedback.controller");

// Local Middlewres
const authMiddleware = require("../middlewares/auth.middleware")
const roleMiddleware = require("../middlewares/role.middleware");
const { trainerAnalytics } = require('../controllers/analytics.controller');

const trainerrouter = express.Router();

// ==============================
// PROFILE ROUTES
// ==============================

// Create trainee profile
trainerrouter.post("/profile",authMiddleware,roleMiddleware("trainer"), createProfile);

// Get trainee profile
trainerrouter.get("/profile",authMiddleware,roleMiddleware("trainer"),getProfile)

// Update trainee profile
trainerrouter.put("/profile",authMiddleware,roleMiddleware("trainer"), updateProfile);

// ==============================
// ENROLLMENT ROUTES
// ==============================

// Get Course Enrollment Stats
trainerrouter.get("/courses/:courseId/enrollments",authMiddleware,roleMiddleware("trainer"),getCourseEnrollmentStats)

// ==============================
// LESSON ROUTES
// ==============================

// Create Lesson
trainerrouter.post("/courses/:courseId/lessons",authMiddleware,roleMiddleware("trainer"),createLesson)

// View Lesson
trainerrouter.get("/courses/:courseId/lessons",authMiddleware,roleMiddleware("trainer"),getCourseLessons)

// Update Lesson
trainerrouter.put("/courses/:courseId/lessons/:lessonId",authMiddleware,roleMiddleware("trainer"),updateLesson)

// Delete Lesson
trainerrouter.delete("/courses/:courseId/lessons/:lessonId",authMiddleware,roleMiddleware("trainer"),deleteLesson)

// ==============================
// QUIZ ROUTES
// ==============================

trainerrouter.post("/courses/:courseId/quizzes",authMiddleware,roleMiddleware("trainer"),createQuiz);

trainerrouter.post("/courses/:courseId/quizzes/:quizId/questions",authMiddleware,roleMiddleware("trainer"),addQuestion);

trainerrouter.get("/courses/:courseId/quizzes/:quizId",authMiddleware,roleMiddleware("trainer"),getQuiz);

trainerrouter.put("/courses/:courseId/quizzes/:quizId",authMiddleware,roleMiddleware("trainer"),updateQuiz);

trainerrouter.patch("/courses/:courseId/quizzes/:quizId/publish",authMiddleware,roleMiddleware("trainer"),publishQuiz);

trainerrouter.delete("/courses/:courseId/quizzes/:quizId",authMiddleware,roleMiddleware("trainer"),deleteQuiz);

trainerrouter.get("/courses/:courseId/quizzes/:quizId/results",authMiddleware,roleMiddleware("trainer"),getQuizResults);

// ==============================
// CERTIFICATE ROUTES
// ==============================

trainerrouter.get("/courses/:courseId/certificates",authMiddleware,roleMiddleware("trainer"),getCourseCertificates)

// ==============================
// FEEDBACK ROUTES
// ==============================

trainerrouter.get("/courses/:courseId/feedback",authMiddleware,roleMiddleware("trainer"),getCourseFeedback)

// ==============================
// ANALYTICS ROUTES
// ==============================

trainerrouter.get("/analytics",authMiddleware,roleMiddleware("trainer"),trainerAnalytics)



module.exports= trainerrouter;