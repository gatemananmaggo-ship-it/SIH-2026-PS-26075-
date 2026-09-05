const mongoose = require("mongoose");

const sessionEnrollmentSchema = new mongoose.Schema(
    {
        traineeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainerSession",
            required: true
        }
    },
    {
        timestamps: true
    }
);

sessionEnrollmentSchema.index(
    { traineeId: 1, sessionId: 1 },
    { unique: true }
);

const SessionEnrollment = mongoose.model(
    "SessionEnrollment",
    sessionEnrollmentSchema
);

module.exports = SessionEnrollment;