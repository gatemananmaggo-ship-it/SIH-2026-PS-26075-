const QuizResult = require("../models/quizResult");
const Quiz = require("../models/quiz");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");

const { isValidObjectId } = require("../utils/validation");

const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");


// ==============================
// TRAINER CONTROLLERS
// ==============================

// Create Quiz
const createQuiz = async(req,res)=>{
    try{
        const trainerId = req.user._id;
        const courseId = req.params.courseId;

        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Get quiz body
        const {
            title,
            description,
            passingMarks,
            questions
        } = req.body;

        // Check that course exists and belongs to trainer
        const course = await Course.findOne({
            _id: courseId,
            trainerId
        })
        if(!course){
            return res.status(404).json({
                message:"Course not found or you are not the owner "
            })

        }

        // Create quiz 
        const quiz = await Quiz.create({
            courseId,
            title,
            description,
            passingMarks,
            questions
        });

        return res.status(201).json({
            message:"quiz created successfully",
            quiz
        })


    }catch(err){
        console.log("Error in creating quiz:",err);

        return res.status(500).json({
            message:"server Error"
        })
    }
}

// Add Questions
const addQuestion = async (req, res) => {
    try {

        const trainerId = req.user._id;
        const courseId = req.params.courseId;

        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        const quizId = req.params.quizId;

        if (!isValidObjectId(quizId)) {
            return res.status(400).json({
                message: "Invalid quiz ID"
            });
        }

        const {
            question,
            options,
            correctAnswer,
            marks
        } = req.body;

        // Check course ownership
        const course = await Course.findOne({
            _id: courseId,
            trainerId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        // Find quiz belonging to this course
        const quiz = await Quiz.findOne({
            _id: quizId,
            courseId
        });

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (quiz.isPublished) {
            return res.status(400).json({
                message: "Published quizzes cannot be modified"
            });
        }

        // Validate options
        if (!Array.isArray(options) || options.length < 2) {
            return res.status(400).json({
                message: "A question must have at least 2 options"
            });
        }

        // Make sure correct answer exists in options
        if (!options.includes(correctAnswer)) {
            return res.status(400).json({
                message: "Correct answer must be one of the options"
            });
        }

        // Add question
        quiz.questions.push({
            question,
            options,
            correctAnswer,
            marks
        });

        await quiz.save();

        return res.status(201).json({
            message: "Question added successfully",
            quiz
        });

    } catch (err) {

        console.log("Error in adding question:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Get Quiz
const getQuiz = async (req, res) => {
    try {
        const trainerId = req.user._id;
        const  courseId = req.params.courseId;
        const  quizId = req.params.quizId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        if (!isValidObjectId(quizId)) {
            return res.status(400).json({
                message: "Invalid quiz ID"
            });
        }

        // Finding Course for particular trainer
        const course = await Course.findOne({
            _id: courseId,
            trainerId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        const quiz = await Quiz.findOne({
            _id: quizId,
            courseId
        });

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        return res.status(200).json({
            message: "Quiz fetched successfully",
            quiz
        });

    } catch (err) {

        console.log("Error in getting quiz:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Update Quiz
const updateQuiz = async (req, res) => {
    try {

        const trainerId = req.user._id;
        const  courseId = req.params.courseId;
        const  quizId = req.params.quizId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        if (!isValidObjectId(quizId)) {
            return res.status(400).json({
                message: "Invalid quiz ID"
            });
        }

        const course = await Course.findOne({
            _id: courseId,
            trainerId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        const quiz = await Quiz.findOne({
            _id: quizId,
            courseId
        });

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (quiz.isPublished) {
            return res.status(400).json({
                message: "Published quizzes cannot be modified"
            });
        }

        const {
            title,
            description,
            passingMarks,
            questions
        } = req.body;

        if (title !== undefined) quiz.title = title;
        if (description !== undefined) quiz.description = description;
        if (passingMarks !== undefined) quiz.passingMarks = passingMarks;
        if (questions !== undefined) quiz.questions = questions;

        await quiz.save();

        return res.status(200).json({
            message: "Quiz updated successfully",
            quiz
        });

    } catch (err) {

        console.log("Error in updating quiz:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Publish quiz
const publishQuiz = async (req, res) => {
    try {

        const trainerId = req.user._id;
        const  courseId = req.params.courseId;
        const  quizId = req.params.quizId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        if (!isValidObjectId(quizId)) {
            return res.status(400).json({
                message: "Invalid quiz ID"
            });
        }

        const course = await Course.findOne({
            _id: courseId,
            trainerId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        const quiz = await Quiz.findOne({
            _id: quizId,
            courseId
        });

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (quiz.questions.length === 0) {
            return res.status(400).json({
                message: "Cannot publish quiz without questions"
            });
        }

        const totalMarks = quiz.questions.reduce(
            (total, question) => total + question.marks,
            0
        );

        if (quiz.passingMarks > totalMarks) {
            return res.status(400).json({
                message: "Passing marks cannot exceed total quiz marks"
            });
        }

        quiz.isPublished = true;

        await quiz.save();

        return res.status(200).json({
            message: "Quiz published successfully",
            quiz
        });

    } catch (err) {

        console.log("Error in publishing quiz:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Delete Quiz
const deleteQuiz = async (req, res) => {
    try {

        const trainerId = req.user._id;
        const  courseId = req.params.courseId;
        const  quizId = req.params.quizId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        if (!isValidObjectId(quizId)) {
            return res.status(400).json({
                message: "Invalid quiz ID"
            });
        }

        const course = await Course.findOne({
            _id: courseId,
            trainerId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        const quiz = await Quiz.findOne({
            _id: quizId,
            courseId
        });

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        if (quiz.isPublished) {
            return res.status(400).json({
                message: "Published quizzes cannot be modified"
            });
        }

        await quiz.deleteOne();

        return res.status(200).json({
            message: "Quiz deleted successfully",
            quizId: quiz._id
        });

    } catch (err) {

        console.log("Error in deleting quiz:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// View Quiz results
const getQuizResults = async (req,res)=>{
    try{
        const trainerId = req.user._id;
        const courseId = req.params.courseId;

        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        const quizId = req.params.quizId

        if (!isValidObjectId(quizId)) {
            return res.status(400).json({
                message: "Invalid quiz ID"
            });
        }
        // Course and trainer Validation
        const course = await Course.findOne({
            _id:courseId,
            trainerId
        })

        if(!course){
            return res.status(404).json({
                message:"Course not found or You are not owner"
            })
        }

        // Quiz Validation
        const quiz = await Quiz.findOne({
            _id:quizId,
            courseId
        })
    
        if(!quiz){
            return res.status(404).json({
                message:"Quiz not found"
            })
        }
        // Get all attempts
        const { page, limit, skip } = getPagination(req);

        const filter = {
            quizId,
            courseId
        };

        const [results, total] = await Promise.all([
            QuizResult.find(filter)
                .populate("traineeId", "name email")
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            QuizResult.countDocuments(filter)
        ]);

        return res.status(200).json({
            message: "Result fetched successfully",
            results,
            ...getPaginationMeta(page, limit, total)
        });
    } catch(err){
        console.log("Error in getting quiz results:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
}

// ==============================
// TRAINEE CONTROLLERS
// ==============================

// Get Quiz
const getTraineeQuiz = async (req, res) => {
    try {

        const traineeId = req.user._id;
        const { courseId, quizId } = req.params;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        if (!isValidObjectId(quizId)) {
            return res.status(400).json({
                message: "Invalid quiz ID"
            });
        }

        // Check published course
        const course = await Course.findOne({
            _id: courseId,
            status: "published"
        });

        if (!course) {
            return res.status(404).json({
                message: "Published course not found"
            });
        }

        // Check trainee enrollment
        const enrollment = await Enrollment.findOne({
            traineeId,
            courseId,
            status: { $in: ["active", "completed"] }
        });

        if (!enrollment) {
            return res.status(403).json({
                message: "You are not enrolled in this course"
            });
        }

        // Find published quiz
        const quiz = await Quiz.findOne({
            _id: quizId,
            courseId,
            isPublished: true
        });

        if (!quiz) {
            return res.status(404).json({
                message: "Published quiz not found"
            });
        }

        // Remove correct answers
        const safeQuestions = quiz.questions.map((question) => ({
            _id: question._id,
            question: question.question,
            options: question.options,
            marks: question.marks
        }));

        return res.status(200).json({
            message: "Quiz fetched successfully",
            quiz: {
                _id: quiz._id,
                courseId: quiz.courseId,
                title: quiz.title,
                description: quiz.description,
                passingMarks: quiz.passingMarks,
                questions: safeQuestions
            }
        });

    } catch (err) {

        console.log("Error in getting trainee quiz:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Submit Quiz
const submitQuizAttempt = async (req,res)=>{
    try{
        const traineeId = req.user._id;
        const  courseId = req.params.courseId;
        const quizId  = req.params.quizId;
        const answers  = req.body.answers;
        // console.log(answers)
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        if (!isValidObjectId(quizId)) {
            return res.status(400).json({
                message: "Invalid quiz ID"
            });
        }

        // Validate answers
        if(!Array.isArray(answers)){
            return res.status(400).json({
                message: "Answers must be an array"
            });
        }

        // check if course is published
        const course = await Course.findOne({
            _id:courseId,
            status:"published"
        });

        if(!course){
            return res.status(404).json({
                message: "Published course not found"
            });
        }

        // Check enrollment
        const enrollment = await Enrollment.findOne({
            traineeId,
            courseId,
            status: { $in: ["active", "completed"] }
        });

        if (!enrollment) {
            return res.status(403).json({
                message: "You are not enrolled in this course"
            });
        }

        // Find published quiz
        const quiz = await Quiz.findOne({
            _id: quizId,
            courseId,
            isPublished:true
        });

        if(!quiz){
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        // make sure quiz has questions
        if(quiz.questions.length === 0){
            return res.status(400).json({
                message: "Quiz has no questions"
            });
        }

        // Validate question Id's and answers 
        for(const submittedAnswer of answers){

            const question = quiz.questions.id(submittedAnswer.questionId);

            // console.log(question)

            if(!question){
                return res.status(400).json({
                    message: "Invalid question ID"
                })
            }

            if (!question.options.includes(submittedAnswer.answer)) {
                return res.status(400).json({
                    message: "Invalid answer option"
                });
            }

        }

        // Calculate score
        let obtainedMarks = 0;
        let totalMarks = 0;

        quiz.questions.forEach((question) => {

            // Add question marks to total
            totalMarks += question.marks;

            // Find trainee's answer
            const submittedAnswer = answers.find(
                (item) =>
                    item.questionId.toString() === question._id.toString()
            );

            // If answered and correct
            if (
                submittedAnswer &&
                submittedAnswer.answer === question.correctAnswer
            ) {
                obtainedMarks += question.marks;
            }
        });

        // Calculate percentage
        const percentage = totalMarks === 0
            ? 0
            : Math.round((obtainedMarks / totalMarks) * 100);

        // Determine result
        const passed = obtainedMarks >= quiz.passingMarks;
        // Prevent duplicate question Ids
        const questionIds = answers.map(
            item=>item.questionId.toString()
        );

        if(new Set(questionIds).size !== questionIds.length){
            return res.status(400).json({
                message: "Duplicate question answers are not allowed"
            });
        }

        // Quiz result 
        const quizResult = await QuizResult.create({
            traineeId,
            quizId: quiz._id,
            courseId : course._id,
            totalMarks,
            obtainedMarks,
            percentage,
            passingMarks: quiz.passingMarks,
            passed,
            answers
        });

        return res.status(200).json({
            message: "Quize attempt submitted",
            Result:quizResult
        });
    } catch(err){
        console.log("Error in submitting answers",err);
        return res.status(500).json({
            message:"Server Error"
        });
    }
}


module.exports = {
    createQuiz,
    addQuestion,
    getQuiz,
    updateQuiz,
    publishQuiz,
    deleteQuiz,
    getTraineeQuiz,
    submitQuizAttempt,
    getQuizResults
};