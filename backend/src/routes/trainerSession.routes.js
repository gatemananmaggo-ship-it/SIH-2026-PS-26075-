const express = require("express");

const {
    createSession,
    getTrainerSessions,
    updateSession,
    deleteSession,
    startSession,
    completeSession,
    updateSessionRecording,
    publishSession,
    trainerJoinSession
} = require("../controllers/session.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const trainersessionrouter = express.Router();

trainersessionrouter.post(
    "/",
    authMiddleware,
    roleMiddleware("trainer"),
    createSession
);

trainersessionrouter.get(
    "/",
    authMiddleware,
    roleMiddleware("trainer"),
    getTrainerSessions
);

trainersessionrouter.put(
    "/:sessionId",
    authMiddleware,
    roleMiddleware("trainer"),
    updateSession
);

trainersessionrouter.delete(
    "/:sessionId",
    authMiddleware,
    roleMiddleware("trainer"),
    deleteSession
);

trainersessionrouter.patch(
    "/:sessionId/start",
    authMiddleware,
    roleMiddleware("trainer"),
    startSession
);

trainersessionrouter.patch(
    "/:sessionId/complete",
    authMiddleware,
    roleMiddleware("trainer"),
    completeSession
);

trainersessionrouter.patch(
    "/:sessionId/recording",
    authMiddleware,
    roleMiddleware("trainer"),
    updateSessionRecording
);

trainersessionrouter.post(
    "/:sessionId/publish",
    authMiddleware,
    roleMiddleware("trainer"),
    publishSession
);

// Trainer re-joins an in_progress session to get a fresh JaaS JWT (Reopen Classroom)
trainersessionrouter.get(
    "/:sessionId/join",
    authMiddleware,
    roleMiddleware("trainer"),
    trainerJoinSession
);

module.exports = trainersessionrouter;