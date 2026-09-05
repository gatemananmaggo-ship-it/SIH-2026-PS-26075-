const Course = require("../models/course")
const Users = require("../models/user")
const Enrollment = require("../models/enrollment")
const TrainerSession = require("../models/trainersession")
const Feedback = require("../models/feedback")
const QuizResult = require("../models/quizResult");
const Certificate = require("../models/certificate");
const SessionEnrollment = require("../models/sessionEnrollment");

const adminAnalytics = async (req,res)=>{
    try{
        
        const totalTrainees = await Users.countDocuments({
            role:"trainee"
        });

        const totalTrainers = await Users.countDocuments({
            role:"trainer"
        });

        const totalCourses = await Course.countDocuments();

        const publishedCourses = await Course.countDocuments({
            status:"published"
        });

        const totalEnrollments = await Enrollment.countDocuments();

        const completedEnrollments = await Enrollment.countDocuments({
            status:"completed"
        });

        const totalSessions = await TrainerSession.countDocuments();

        const completedSessions = await TrainerSession.countDocuments({
            status:"completed"
        });

        const totalFeedback = await Feedback.countDocuments();

        const feedbackarr = await Feedback.find();
        const averageRating = feedbackarr.length > 0 ? feedbackarr.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbackarr.length  : 0;

        return res.status(200).json({
            message:"Analytics fetched successfully",
            totalTrainees,
            totalTrainers,
            totalCourses,
            publishedCourses,
            totalEnrollments,
            completedEnrollments,
            totalSessions,
            completedSessions,
            totalFeedback,
            averageRating 
        });

    } catch(err){
        console.log("Error in getting analysis", err);

        return res.status(500).json({
            message:"Server Error"
        })
    }
};

const trainerAnalytics = async (req,res)=>{
    try{
        const trainerId = req.user._id;

        const totalCourses = await Course.countDocuments({
            trainerId
        });

        const publishedCourses = await Course.countDocuments({
            trainerId,
            status:"published"
        });

        const trainerCourses = await Course.find(
            { trainerId },
            { _id: 1 }
        );

        const courseIds = trainerCourses.map(course => course._id);

        const totalEnrollments = await Enrollment.countDocuments({
            courseId: { $in: courseIds }
        });


        const completedEnrollments = await Enrollment.countDocuments({
            courseId: { $in: courseIds },
            status:"completed"
        });

        const totalSessions = await TrainerSession.countDocuments({
            trainerId
        });

        const completedSessions = await TrainerSession.countDocuments({
            trainerId,
            status:"completed"
        });

        const totalFeedback = await Feedback.countDocuments({
            courseId: { $in: courseIds }
        });

        const feedbackarr = await Feedback.find({
            courseId: { $in: courseIds },
        });

        
        const averageRating = feedbackarr.length > 0 ? feedbackarr.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbackarr.length  : 0;
        

        return res.status(200).json({
            message:"Analytics fetched successfully",
            totalCourses,
            publishedCourses,
            totalEnrollments,
            completedEnrollments,
            totalSessions,
            completedSessions,
            totalFeedback,
            averageRating
        });

    } catch(err){
        console.log("Error in getting analysis", err);

        return res.status(500).json({
            message:"Server Error"
        })
    }
};

const traineeAnalytics = async (req,res)=>{
    try{
        const traineeId = req.user._id;

        const totalEnrollments = await Enrollment.countDocuments({
            traineeId
        });

        const completedCourses = await Enrollment.countDocuments({
            traineeId,
            status: "completed"
        });

        const activeCourses = await Enrollment.countDocuments({
            traineeId,
            status: "active"
        });

        const enrollments = await Enrollment.find({
            traineeId
        });

        const averageProgress = enrollments.length > 0 ? enrollments.reduce( (sum, enrollment) => sum + enrollment.progress,0) / enrollments.length : 0;

        const totalQuizAttempts = await QuizResult.countDocuments({
            traineeId
        });

        const totalCertificates = await Certificate.countDocuments({
            traineeId
        });

        const totalSessionEnrollments =
        await SessionEnrollment.countDocuments({
            traineeId
        });
        
        

        return res.status(200).json({
            message:"Analytics fetched successfully",
            totalEnrollments,
            completedCourses,
            activeCourses,
            averageProgress,
            totalQuizAttempts,
            totalCertificates,
            totalSessionEnrollments
        });

    } catch(err){
        console.log("Error in getting analysis", err);

        return res.status(500).json({
            message:"Server Error"
        })
    }
};


module.exports = { 
    adminAnalytics,
    trainerAnalytics,
    traineeAnalytics
}