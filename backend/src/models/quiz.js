const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },

    options: {
        type: [String],
        required: true,
        validate: {
            validator: function (value) {
                return value.length >= 2;
            },
            message: "A question must have at least 2 options"
        }
    },

    correctAnswer: {
        type: String,
        required: true,
        trim: true
    },

    marks: {
        type: Number,
        required: true,
        min: 1
    }
});

const quizSchema = new mongoose.Schema(
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

        passingMarks: {
            type: Number,
            required: true,
            min: 0
        },

        questions: {
            type: [questionSchema],
            default: []
        },

        isPublished: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;