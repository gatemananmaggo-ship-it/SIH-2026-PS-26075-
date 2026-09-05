const express = require('express');

const {
    createCompetency,
    getCompetencies,
    updateCompetency,
    deleteCompetency
} = require("../controllers/competency.controller");

// Local Middlewres
const authMiddleware = require("../middlewares/auth.middleware")
const roleMiddleware = require("../middlewares/role.middleware")

const competencyrouter=express.Router()

competencyrouter.post("/", authMiddleware, roleMiddleware("admin"), createCompetency);

competencyrouter.get("/", authMiddleware, roleMiddleware("admin"), getCompetencies);

competencyrouter.put(
    "/:competencyId",
    authMiddleware,
    roleMiddleware("admin"),
    updateCompetency
);

competencyrouter.delete(
    "/:competencyId",
    authMiddleware,
    roleMiddleware("admin"),
    deleteCompetency
);

module.exports = competencyrouter