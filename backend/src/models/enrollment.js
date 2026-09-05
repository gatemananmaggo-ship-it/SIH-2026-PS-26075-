const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
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

        enrolledAt: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active"
        },

        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lesson"
            }
        ],

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

// prevent multiple enrollment by same user
enrollmentSchema.index(
    { traineeId: 1, courseId: 1 },
    { unique: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;