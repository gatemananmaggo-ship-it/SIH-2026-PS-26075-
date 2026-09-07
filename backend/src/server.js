require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    const server = app.listen(PORT, () => {
        // Log port only — never log a hardcoded hostname or secret values
        console.log(`[CAPACITY CONNECT] Backend running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });

    // Graceful shutdown — for PM2 / AWS lifecycle events
    const shutdown = (signal) => {
        console.log(`[${signal}] Graceful shutdown initiated...`);
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
        // Force exit after 10 seconds if connections don't drain
        setTimeout(() => {
            console.error('Forced shutdown after timeout.');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));
};

startServer();