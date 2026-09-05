const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema(
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

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        sentiment: {
            type: String,
            enum: ["positive", "neutral", "negative"],
            default: "neutral"
        }
    },
    {
        timestamps: true
    }
);

// One feedback per trainee per course
feedbackSchema.index(
    { traineeId: 1, courseId: 1 },
    { unique: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;