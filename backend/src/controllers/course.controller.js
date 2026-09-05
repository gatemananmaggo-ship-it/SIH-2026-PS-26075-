const Course = require('../models/course');
const Competency = require('../models/competency');
const Lesson = require("../models/lesson");
const Enrollment = require("../models/enrollment");
const Quiz = require("../models/quiz");
const QuizResult = require("../models/quizResult");
const Certificate = require("../models/certificate");
const Feedback = require("../models/feedback");
const TrainerSession = require("../models/trainersession");
const SessionEnrollment = require("../models/sessionEnrollment");

const { isValidObjectId } = require("../utils/validation");
const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");

// ==============================
// TRAINER CONTROLLERS
// ==============================
// Create Course
const createCourse = async (req,res)=>{
    try{
        // console.log(req.body)
        // Get logged-in Trainer's id
        const trainerId = req.user._id;
        if (!isValidObjectId(trainerId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        
    
        // Get Course data from request
        const {
            title,
            description,
            category,
            level,
            duration,
            thumbnail
        } = req.body
    
        // Creating course
        const course = await Course.create({
            title,
            description,
            trainerId,
            category,
            level,
            duration,
            thumbnail
        });
        
        return res.status(200).json({
            message:"Course created successfully",
            course
        });
    } catch(err){
        console.log("Error in creating Course:", err);

        return res.status(500).json({
            message:"Server Error"
        })
    }
}

// Fetch all courses trainer specific
const getMyCourses = async (req, res) => {
    try {
        const trainerId = req.user._id;

        const { page, limit, skip } = getPagination(req);

        const filter = {
            trainerId
        };

        const [courses, total] = await Promise.all([
            Course.find(filter)
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            Course.countDocuments(filter)
        ]);

        return res.status(200).json({
            message: "Trainer courses fetched successfully",
            courses,
            ...getPaginationMeta(page, limit, total)
        });

    } catch (err) {
        console.log("Error in getting trainer courses:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// updateCourse
const updateCourse = async(req,res)=>{
    try{
        // Get courseId from URL
        const courseId = req.params.id;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        // testing
        // console.log(req.params.id)
        // console.log(typeof courseId)

        // Get trainer logged-in trainer's id
        const trainerId = req.user._id;
        if (!isValidObjectId(trainerId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        
        
        // testing
        // console.log(req.user._id)
        // console.log(typeof trainerId)

        // Get updated fields
        const {
            title,
            description,
            category,
            level,
            duration,
            thumbnail
        } = req.body;

        // Find course belonging to this trainer
        const course = await Course.findOne({
            _id: courseId,
            trainerId: trainerId
        });

        // console.log(course)
        // Course not found
        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        // Update fields
        if(title!==undefined)course.title = title;
        if(description !== undefined )course.description = description;
        if( category !== undefined )course.category = category;
        if( level !== undefined )course.level = level;
        if(duration !== undefined)course.duration = duration;
        if(thumbnail !== undefined)course.thumbnail = thumbnail;

        // Save updated course
        await course.save();

        return res.status(200).json({
            message: "Course updated successfully",
            course
        });

    } catch (err){
        console.log("Error in updating Course",err)

        return res.status(500).json({
            message:"server error"
        })
    }
}

// Delete Course
const deleteCourse = async (req, res) => {
    try {
        const trainerId = req.user._id;
        if (!isValidObjectId(trainerId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        
        const courseId = req.params.id;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Find course owned by this trainer
        const course = await Course.findOne({
            _id: courseId,
            trainerId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        // Find quizzes first because QuizResult depends on quiz IDs
        const quizzes = await Quiz.find(
            { courseId },
            { _id: 1 }
        );


        // Find sessions because SessionEnrollment depends on session IDs
        const sessions = await TrainerSession.find(
            { courseId },
            { _id: 1 }
        );

        const sessionIds = sessions.map(session => session._id);

        // Delete dependent records
        await Lesson.deleteMany({ courseId });
        await Enrollment.deleteMany({ courseId });
        await QuizResult.deleteMany({ courseId });
        await Quiz.deleteMany({ courseId });
        await Certificate.deleteMany({ courseId });
        await Feedback.deleteMany({ courseId });

        if (sessionIds.length > 0) {
            await SessionEnrollment.deleteMany({
                sessionId: { $in: sessionIds }
            });
        }

        await TrainerSession.deleteMany({ courseId });

        // Finally delete the course
        await course.deleteOne();

        return res.status(200).json({
            message: "Course and related data deleted successfully",
            courseId: course._id
        });

    } catch (err) {
        console.log("Error in deleting Course:", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Publish Course status : draft -> published
const publishCourse = async (req,res)=>{
    try{
        // Get Specific trainer id from req.user and course id from URL
        const trainerId = req.user._id;
        if (!isValidObjectId(trainerId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        
        
        const courseId = req.params.id;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        

        // Find and delete only if course belongs to this trainer
        const course = await Course.findOne({
            _id: courseId,
            trainerId: trainerId
        });

        // Course not found or not owned by trainer
        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        // Check if already published
        if(course.status === "published"){
            return res.status(400).json({
                message:"Course already Published"
            })
        }

        // Publish course
        course.status = "published";

        await course.save();

        return res.status(200).json({
            message: "Course published successfully",
            course
        });
    }catch(err){
        console.log("Error in Changing Status", err)

        return res.status(500).json({
            message:"Server Error"
        })
    }
}


// ==============================
// TRAINEE CONTROLLERS
// ==============================

// Getting published courses
const getPublishedCourses = async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);

        const filter = {
            status: "published"
        };

        const [courses, total] = await Promise.all([
            Course.find(filter)
                .populate("trainerId", "name email")
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            Course.countDocuments(filter)
        ]);

        return res.status(200).json({
            message: "Published courses fetched successfully",
            courses,
            ...getPaginationMeta(page, limit, total)
        });

    } catch (err) {
        console.log("Error in Getting published courses for trainee", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// ==============================
// ADMIN CONTROLLERS
// ==============================

const mapCompetenciesToCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { competencyIds } = req.body;

        if (!Array.isArray(competencyIds)) {
            return res.status(400).json({
                message: "competencyIds must be an array"
            });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const competencies = await Competency.find({
            _id: { $in: competencyIds }
        });

        if (competencies.length !== competencyIds.length) {
            return res.status(400).json({
                message: "One or more competency IDs are invalid"
            });
        }

        course.competencies = competencyIds;

        await course.save();

        await course.populate("competencies");

        return res.status(200).json({
            message: "Competencies mapped to course successfully",
            course
        });

    } catch (err) {
        console.log("Error in mapping competencies to course", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    createCourse,
    getMyCourses,
    updateCourse,
    deleteCourse,
    publishCourse,
    getPublishedCourses,
    mapCompetenciesToCourse
};