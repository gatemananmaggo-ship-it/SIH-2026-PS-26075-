const Lesson = require("../models/lesson")
const Course = require("../models/course")
const Enrollment = require("../models/enrollment")

const { isValidObjectId } = require("../utils/validation");


// ==============================
// TRAINER CONTROLLERS
// ==============================

// Creating lesson
const createLesson = async (req,res)=>{
    try{
        // Getting trainer id from user 
        const trainerId = req.user._id;
        
        // getting course id from url
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
    return res.status(400).json({
        message: "Invalid course ID"
    });
}

        // Lesson data
        const {
            title,
            description,
            content,
            videoUrl,
            order,
            duration
        } = req.body;

        // Check that course exists and belongs to this trainer
        const course = await Course.findOne({
            _id: courseId,
            trainerId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        // create lesson
        const lesson = await Lesson.create({
            courseId,
            title,
            description,
            content,
            videoUrl,
            order,
            duration
        });

        return res.status(201).json({
            message:"Lesson created successfully",
            lesson
        });

    } catch(err){
        console.log("Error in creating course",err)

        return res.status(500).json({
            message:"Server Error"
        });

    }
};

// Get views on lesson
const getCourseLessons = async(req,res)=>{
    try{
        const trainerId = req.user._id;
        
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Check Ownership
        const course = await Course.findOne({
            _id : courseId,
            trainerId
        })

        if(!course){
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            })
        }

        // Find lessons belonging to this course
        const lessons = await Lesson.find({
            courseId
        }).sort({ order: 1 });

        return res.status(200).json({
            message:"Course lessons fetched successfully",
            lessons
        })



    } catch(err){
        console.log("Error in fetching lessons",err);
        return res.status(500).json({
            message:"Server Error"
        });
    }
};

// Update Lesson
const updateLesson = async (req,res)=>{
    try{
        const trainerId = req.user._id;
        
        const { courseId, lessonId } = req.params;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        if (!isValidObjectId(lessonId)) {
            return res.status(400).json({
                message: "Invalid lesson ID"
            });
        }

        // checking that course belong to trainer?
        const course = await Course.findOne({
            _id:courseId,
            trainerId
        })
        if(!course){
            return res.status(404).json({
                message:"Course not found or You are not the owner"
            })
        }

        // Get Updated fields
        const {
            title,
            description,
            content,
            videoUrl,
            order,
            duration
        } = req.body;

        // Find Lesson from that course
        const lesson = await Lesson.findOne({
            _id:lessonId,
            courseId
        })
        if(!lesson){
            return res.status(404).json({
                message:"lesson not found"
            })
        }
        // Update the fields
        lesson.title = title;
        lesson.description = description;
        lesson.content = content;
        lesson.videoUrl = videoUrl;
        lesson.order = order;
        lesson.duration = duration;

        await lesson.save();

        return res.status(200).json({
            message:"lesson updated successfully",
            lesson
        });
    }catch(err){
        console.log("Error in updating lesson:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
}

// Delete Lesson
const deleteLesson = async (req,res)=>{
    try{
        const trainerId = req.user._id;
        
        const { courseId, lessonId } = req.params;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        if (!isValidObjectId(lessonId)) {
            return res.status(400).json({
                message: "Invalid lesson ID"
            });
        }

        // checking that course belong to trainer?
        const course = await Course.findOne({
            _id:courseId,
            trainerId
        })
        if(!course){
            return res.status(404).json({
                message:"Course not found or You are not the owner"
            })
        }

        // Find Lesson from that course and delete
        const lesson = await Lesson.findOneAndDelete({
            _id:lessonId,
            courseId
        });

        if(!lesson){
            return res.status(404).json({
                message:"lesson not found"
            })
        }

        return res.status(200).json({
            message:"lesson deleted successfully",
            lesson
        });
    }catch(err){
        console.log("Error in deleting lesson:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
}

// ==============================
// TRAINEE CONTROLLERS
// ==============================

// Get course lessons
const getTraineeCourseLessons = async (req, res) =>{
    try{
        const traineeId = req.user._id;
        
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course = await Course.findOne({
            _id: courseId,
            status:"published"
        });

        if(!course){
            return res.status(404).json({
                message: "Published course not found"
            })
        }

        const enrollment = await Enrollment.findOne({
            traineeId,
            courseId,
            status:"active"
        });
        if(!enrollment){
            return res.status(403).json({
                message: "You are not enrolled in this course"
            });
        }

        // Get lessons
        const lessons = await Lesson.find({
            courseId
        }).sort({ order: 1 });

        return res.status(200).json({
            message: "Course lessons fetched successfully",
            lessons
        });

    }catch (err) {

        console.log("Error in getting trainee course lessons:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Lessons Completed
const markLessonComplete = async (req,res)=>{
    try{
        const traineeId = req.user._id;
        
        const { courseId, lessonId } = req.params;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        if (!isValidObjectId(lessonId)) {
            return res.status(400).json({
                message: "Invalid lesson ID"
            });
        }

        // Check that course exists and is publish
        const course =  await Course.findOne({
            _id:courseId,
            status:"published"
        })
        if (!course) {
            return res.status(404).json({
                message: "Published course not found"
            });
        }

        // Check trainee enrollment
        const enrollment = await Enrollment.findOne({
            traineeId,
            courseId,
            status: "active"
        });

        if (!enrollment) {
            return res.status(403).json({
                message: "You are not enrolled in this course"
            });
        }

        // Check lesson belongs to this course
        const lesson = await Lesson.findOne({
            _id: lessonId,
            courseId
        });

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }
        // Check if lesson is already completed
        if (enrollment.completedLessons.includes(lessonId)) {
            return res.status(409).json({
                message: "Lesson is already completed"
            });
        }

        // Add lesson to completed lessons
        enrollment.completedLessons.push(lessonId);

        // Get total lessons in course
        const totalLessons = await Lesson.countDocuments({
            courseId
        });

        // Calculate progress
        const completedLessons = enrollment.completedLessons.length;

        const progress = totalLessons === 0
            ? 0
            : Math.round((completedLessons / totalLessons) * 100);

        // Update enrollment progress
        enrollment.progress = progress;

        // Mark enrollment completed when all lessons are completed
        if (progress === 100) {
            enrollment.status = "completed";
        }

        await enrollment.save();

        return res.status(200).json({
            message: "Lesson marked as completed",
            progress: enrollment.progress,
            status: enrollment.status,
            completedLessons: enrollment.completedLessons
        });

    }catch(err){
        console.log("Error in marking course complete")
        return res.status(500).json({
            message:"Server Error"
        })
    }
};

const getCourseProgress = async (req,res)=>{
    try{
        const traineeId = req.user._id;
        
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Check enrollment
        const enrollment = await Enrollment.findOne({
            traineeId,
            courseId
        });

        if (!enrollment) {
            return res.status(403).json({
                message: "You are not enrolled in this course"
            });
        }

        // Count total lectures
        const totalLessons = await Lesson.countDocuments({
            courseId
        })

        const completedLessons = enrollment.completedLessons.length;

        const progress = totalLessons === 0
        ? 0
        : Math.round(
            (completedLessons / totalLessons) * 100
        );

        return res.status(200).json({
            message: "Course progress fetched successfully",
            progress: {
                courseId,
                totalLessons,
                completedLessons,
                progress,
                status: enrollment.status
            }
        });
    } catch (err) {

        console.log("Error in getting course progress:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createLesson,
    getCourseLessons,
    updateLesson,
    deleteLesson,
    getTraineeCourseLessons,
    markLessonComplete,
    getCourseProgress
};