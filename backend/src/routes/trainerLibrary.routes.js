const express = require("express");

const {
    getTrainerLibrary
} = require("../controllers/trainerLibrary.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const trainerLibraryrouter = express.Router();

trainerLibraryrouter.get(
    "/",
    authMiddleware,
    roleMiddleware("trainer"),
    getTrainerLibrary
);

module.exports = trainerLibraryrouter;