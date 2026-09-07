const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        trainerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner"
        },

        duration: {
            type: Number,
            required: true
        },

        thumbnail: {
            type: String,
            default: null
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft"
        },
        competencies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Competency"
            }
        ],
        sourceSessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainerSession"
        }
    },
    {
        timestamps: true
    }
);
const Course = mongoose.model(
    "Course",
    courseSchema
);

module.exports = Course;
