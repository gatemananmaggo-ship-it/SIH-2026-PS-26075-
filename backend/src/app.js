// External modules
require("dotenv").config();

const rateLimit = require("express-rate-limit");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

// Local modules
const authrouter = require('./routes/auth.routes');
const traineerouter = require('./routes/trainee.routes');
const trainerrouter = require('./routes/trainer.routes');
const trainerLibraryrouter = require('./routes/trainerLibrary.routes');
const adminrouter = require('./routes/admin.routes');
const courserouter = require('./routes/course.routes');
const trainersessionrouter = require('./routes/trainerSession.routes');
const traineeSessionRouter = require('./routes/traineeSession.routes');
const notificationrouter = require('./routes/notification.routes');
const homepagerouter = require('./routes/homepage.routes');
const competencyrouter = require('./routes/competency.routes');

// ===========================================================
// App
// ===========================================================
const app = express();

const isProduction = process.env.NODE_ENV === 'production';

// ===========================================================
// Trust Proxy (required for HTTPS / EC2 behind Nginx/ALB)
// Must be set BEFORE session middleware so secure cookies work.
// ===========================================================
if (isProduction) {
    app.set('trust proxy', 1);
}

// ===========================================================
// CORS — explicit allowlist; never use wildcard with credentials
// ===========================================================
const ALLOWED_ORIGINS = [
    // Local development
    'http://localhost:5173',
    'http://localhost:3000',
];

// Production Netlify frontend — only add if env var is set
if (process.env.FRONTEND_URL) {
    ALLOWED_ORIGINS.push(process.env.FRONTEND_URL.trim().replace(/\/$/, ''));
}

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow server-to-server requests (no Origin header) and allowed origins
            if (!origin || ALLOWED_ORIGINS.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`CORS policy: origin ${origin} is not allowed`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ===========================================================
// Body parsers
// ===========================================================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ===========================================================
// Session — MongoDB-backed, cross-origin cookie for production
// ===========================================================
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'dev_fallback_secret_change_in_prod',
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            // Automatically remove expired sessions from MongoDB
            autoRemove: 'native',
        }),

        cookie: {
            httpOnly: true,
            // secure MUST be true in production for SameSite=None + HTTPS
            secure: isProduction,
            // 'none' required for cross-origin (Netlify → EC2); 'lax' fine for same-origin dev
            sameSite: isProduction ? 'none' : 'lax',
            // Session lives 24 hours
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

// ===========================================================
// Rate limiter — authentication endpoints
// ===========================================================
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many authentication attempts. Please try again later."
    }
});

// ===========================================================
// Health check — lightweight, no auth, safe for load balancers
// DOES NOT expose any secrets, env vars, or internal details.
// ===========================================================
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'capacity-connect-backend',
        timestamp: new Date().toISOString(),
    });
});

// ===========================================================
// Routes
// ===========================================================

// Auth
app.use("/api/auth", authLimiter, authrouter);

// Trainee
app.use("/api/trainee", traineerouter);
app.use("/api/trainee/sessions", traineeSessionRouter);

// Trainer
app.use("/api/trainer", trainerrouter);
app.use("/api/trainer/library", trainerLibraryrouter);
app.use("/api/trainer", courserouter);
app.use("/api/trainer/sessions", trainersessionrouter);

// Admin
app.use("/api/admin", adminrouter);
app.use("/api/admin/notifications", notificationrouter);
app.use("/api/admin/competencies", competencyrouter);

// Homepage (public)
app.use("/api/homepage", homepagerouter);

// Root
app.get('/', (req, res) => {
    res.status(200).json({
        message: "CAPACITY CONNECT backend is running"
    });
});

// ===========================================================
// 404 handler
// ===========================================================
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ===========================================================
// Global error handler — NEVER expose stack traces in production
// ===========================================================
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // Log internally (stack visible in server logs only)
    console.error('[ERROR]', err.message);
    if (!isProduction) {
        console.error(err.stack);
    }

    // Safe response — no internal details in production
    const status = err.status || 500;
    res.status(status).json({
        message: isProduction
            ? (status < 500 ? err.message : 'An unexpected error occurred')
            : err.message
    });
});

module.exports = app;