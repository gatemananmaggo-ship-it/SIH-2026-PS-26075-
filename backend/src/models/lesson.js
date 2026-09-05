const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        content: {
            type: String
        },

        videoUrl: {
            type: String
        },

        order: {
            type: Number,
            required: true,
            min: 1
        },

        duration: {
            type: Number,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;