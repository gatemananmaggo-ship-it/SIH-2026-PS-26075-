const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
    {
        traineeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        totalMarks: {
            type: Number,
            required: true,
            min: 0
        },

        obtainedMarks: {
            type: Number,
            required: true,
            min: 0
        },

        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        passingMarks: {
            type: Number,
            required: true,
            min: 0
        },

        passed: {
            type: Boolean,
            required: true
        },

        answers: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },

                answer: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const QuizResult = mongoose.model(
    "QuizResult",
    quizResultSchema
);

module.exports = QuizResult;