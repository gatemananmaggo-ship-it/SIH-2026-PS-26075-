const express = require('express');

const {
    createNotification,
    getNotifications,
    updateNotification,
    deleteNotification
} = require("../controllers/notification.controller");

// Local Middlewres
const authMiddleware = require("../middlewares/auth.middleware")
const roleMiddleware = require("../middlewares/role.middleware")

const notificationrouter=express.Router()

notificationrouter.post("/", authMiddleware, roleMiddleware("admin"), createNotification);
notificationrouter.get("/", authMiddleware, roleMiddleware("admin"), getNotifications);
notificationrouter.put("/:notificationId", authMiddleware, roleMiddleware("admin"), updateNotification);
notificationrouter.delete("/:notificationId", authMiddleware, roleMiddleware("admin"), deleteNotification);

module.exports = notificationrouter