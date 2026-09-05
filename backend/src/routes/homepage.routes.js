const express = require('express');

const { getHomePage } = require("../controllers/homepage.controller")
const homepagerouter = express.Router();

homepagerouter.get('/', getHomePage);

module.exports = homepagerouter;