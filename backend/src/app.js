// External module
require("dotenv").config();


const rateLimit = require("express-rate-limit");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

// Local Module
const authrouter = require('./routes/auth.routes')
const traineerouter = require('./routes/trainee.routes')
const trainerrouter = require('./routes/trainer.routes')
const trainerLibraryrouter = require('./routes/trainerLibrary.routes')
const adminrouter = require('./routes/admin.routes')
const courserouter = require('./routes/course.routes')
const trainersessionrouter = require('./routes/trainerSession.routes')
const traineeSessionRouter = require('./routes/traineeSession.routes')
const notificationrouter = require('./routes/notification.routes')
const homepagerouter = require('./routes/homepage.routes')
const competencyrouter = require('./routes/competency.routes')

// Creating app
const app = express();

// Adding request body parser
app.use(express.urlencoded());


// MiddleWare
app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),

        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

// rate limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many authentication attempts. Please try again later."
    }
});

// Auth Middleware
app.use("/api/auth",authLimiter, authrouter);

// Trainee Middleware
app.use("/api/trainee", traineerouter);
app.use("/api/trainee/sessions", traineeSessionRouter);

// Trainer Middleware
app.use("/api/trainer", trainerrouter);
app.use("/api/trainer/library", trainerLibraryrouter);
app.use("/api/trainer", courserouter);
app.use("/api/trainer/sessions", trainersessionrouter);

// Admin Middleware
app.use("/api/admin", adminrouter);
app.use("/api/admin/notifications", notificationrouter);
app.use("/api/admin/competencies", competencyrouter);

// Homepage Middleware
app.use("/api/homepage", homepagerouter);

app.get('/',(req,res,next)=>{
    res.send({
        message: "capacity connect backend is live"
    })
});

// exporting app 
module.exports = app;