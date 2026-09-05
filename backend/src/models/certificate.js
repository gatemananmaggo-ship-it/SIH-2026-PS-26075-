const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
    {
        traineeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        certificateNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        issuedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Certificate = mongoose.model(
    "Certificate",
    certificateSchema
);

module.exports = Certificate;