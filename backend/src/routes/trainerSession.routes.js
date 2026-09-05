const express = require("express");

const {
    createSession,
    getTrainerSessions,
    updateSession,
    deleteSession,
    completeSession,
    publishSession
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
    "/:sessionId/complete",
    authMiddleware,
    roleMiddleware("trainer"),
    completeSession
);

trainersessionrouter.post(
    "/:sessionId/publish",
    authMiddleware,
    roleMiddleware("trainer"),
    publishSession
);

module.exports = trainersessionrouter;