const express = require("express");

const {
    getTraineeSession,
    enrollTraineeInSession,
    cancelSessionEnrollment,
    joinTraineeSession
} = require("../controllers/session.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const traineeSessionRouter = express.Router();

traineeSessionRouter.get(
    "/",
    authMiddleware,
    roleMiddleware("trainee"),
    getTraineeSession
);
traineeSessionRouter.get(
    "/:sessionId/join",
    authMiddleware,
    roleMiddleware("trainee"),
    joinTraineeSession
);
traineeSessionRouter.post(
    "/:sessionId/enroll",
    authMiddleware,
    roleMiddleware("trainee"),
    enrollTraineeInSession
);
traineeSessionRouter.delete(
    "/:sessionId/enroll",
    authMiddleware,
    roleMiddleware("trainee"),
    cancelSessionEnrollment
);

module.exports = traineeSessionRouter;