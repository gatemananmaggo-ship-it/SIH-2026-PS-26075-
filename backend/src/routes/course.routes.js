// External Module
const express = require('express');

// local Controller
const {
    createCourse,
    getMyCourses,
    updateCourse,
    deleteCourse,
    publishCourse
} = require("../controllers/course.controller")

// Local Middlewres
const authMiddleware = require("../middlewares/auth.middleware")
const roleMiddleware = require("../middlewares/role.middleware")

const courserouter = express.Router();

// Create course
courserouter.post("/courses",authMiddleware,roleMiddleware("trainer"), createCourse);

// Get Courses
courserouter.get("/courses",authMiddleware,roleMiddleware("trainer"), getMyCourses);

// Update Courses
courserouter.put("/courses/:id",authMiddleware,roleMiddleware("trainer"), updateCourse);

// Delete Courses
courserouter.delete("/courses/:id",authMiddleware,roleMiddleware("trainer"), deleteCourse);

// Publish Courses
courserouter.patch("/courses/:id/publish",authMiddleware,roleMiddleware("trainer"), publishCourse);

module.exports= courserouter;