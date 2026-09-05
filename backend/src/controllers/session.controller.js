const Course = require('../models/course')
const Enrollment = require('../models/enrollment')
const TrainerSession = require('../models/trainersession')
const SessionEnrollment = require("../models/sessionEnrollment");

const { isValidObjectId } = require("../utils/validation");
const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");

// ==============================
// TRAINER CONTROLLERS
// ==============================
// Create session
const createSession = async (req,res)=>{
    try{
        const trainerId = req.user._id;

        const{
            courseId,
            title,
            description,
            date,
            startTime,
            endTime,
            meetingLink

        } = req.body

        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        if (!startTime || !endTime) {
            return res.status(400).json({
                message: "Start time and end time are required"
            });
        }

        if (!date) {
            return res.status(400).json({
                message: "Session date is required"
            });
        }

        const start = startTime.split(":").map(Number);
        const end = endTime.split(":").map(Number);

        const startMinutes = start[0] * 60 + start[1];
        const endMinutes = end[0] * 60 + end[1];

        if (endMinutes <= startMinutes) {
            return res.status(400).json({
                message: "End time must be after start time"
            });
        }

        const sessionDate = new Date(date);

        if (isNaN(sessionDate.getTime())) {
            return res.status(400).json({
                message: "Invalid session date"
            });
        }

        if (sessionDate < new Date()) {
            return res.status(400).json({
                message: "Session date cannot be in the past"
            });
        }

        // Verify course and trainee
        const course = await Course.findOne({
            _id:  courseId,
            trainerId
        })

        if(!course){
            return res.status(404).json({
                message:"Course not found or u are not the owner"
            })
        }

        const session = await TrainerSession.create({
            trainerId,
            courseId,
            title,
            description,
            date,
            startTime,
            endTime,
            meetingLink
        });

        return res.status(201).json({
            message:"Created successfully",
            session
        })
    }catch(err){
        console.log("Error in creating Session",err);

        return res.status(500).json({
            message:'Server Error'
        })
    }
}

// Get session 
// const getTrainerSessions = async (req, res) => {
//     try {

//         const trainerId = req.user._id;

//         const sessions = await TrainerSession.find({
//             trainerId
//         })
//         .populate("courseId", "title")
//         .sort({ date: 1, startTime: 1 });

//         return res.status(200).json({
//             message: "Sessions fetched successfully",
//             totalSessions: sessions.length,
//             sessions
//         });

//     } catch (err) {

//         console.log("Error getting trainer sessions:", err);

//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// };
const getTrainerSessions = async (req, res) => {
    try {
        const trainerId = req.user._id;

        // Pagination
        const { page, limit, skip } = getPagination(req);

        // Keep trainer-specific filter
        const filter = {
            trainerId
        };

        // Fetch current page + total count
        const [sessions, total] = await Promise.all([
            TrainerSession.find(filter)
                .populate("courseId", "title")
                .sort({ date: 1, startTime: 1, _id: 1 })
                .skip(skip)
                .limit(limit),

            TrainerSession.countDocuments(filter)
        ]);

        return res.status(200).json({
            message: "Sessions fetched successfully",
            totalSessions: total,
            sessions,
            ...getPaginationMeta(page, limit, total)
        });

    } catch (err) {
        console.log("Error getting trainer sessions:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// Update session
const updateSession = async (req, res) => {
    try {
        const trainerId = req.user._id;
        const sessionId = req.params.sessionId;

        if (!isValidObjectId(sessionId)) {
            return res.status(400).json({
                message: "Invalid session ID"
            });
        }

        const session = await TrainerSession.findOne({
            _id: sessionId,
            trainerId
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        if (session.status !== "scheduled") {
            return res.status(400).json({
                message: "Only scheduled sessions can be modified"
            });
        }

        const {
            title,
            description,
            date,
            startTime,
            endTime,
            meetingLink,
            status
        } = req.body;

        // Validate status
        if (
            status !== undefined &&
            !["scheduled", "completed", "cancelled"].includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid session status"
            });
        }

        // Use updated values, or existing values if not changed
        const updatedDate = date !== undefined ? date : session.date;
        const updatedStartTime =
            startTime !== undefined ? startTime : session.startTime;
        const updatedEndTime =
            endTime !== undefined ? endTime : session.endTime;

        // Validate date
        if (!updatedDate) {
            return res.status(400).json({
                message: "Session date is required"
            });
        }

        const sessionDate = new Date(updatedDate);

        if (isNaN(sessionDate.getTime())) {
            return res.status(400).json({
                message: "Invalid session date"
            });
        }

        if (sessionDate < new Date()) {
            return res.status(400).json({
                message: "Session date cannot be in the past"
            });
        }

        // Validate time format
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (
            !timeRegex.test(updatedStartTime) ||
            !timeRegex.test(updatedEndTime)
        ) {
            return res.status(400).json({
                message: "Invalid session time. Use HH:MM format"
            });
        }

        // Convert time to minutes
        const [startHour, startMinute] = updatedStartTime
            .split(":")
            .map(Number);

        const [endHour, endMinute] = updatedEndTime
            .split(":")
            .map(Number);

        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        if (endMinutes <= startMinutes) {
            return res.status(400).json({
                message: "End time must be after start time"
            });
        }

        // Apply updates
        if (title !== undefined) session.title = title;
        if (description !== undefined) session.description = description;
        if (date !== undefined) session.date = date;
        if (startTime !== undefined) session.startTime = startTime;
        if (endTime !== undefined) session.endTime = endTime;
        if (meetingLink !== undefined) session.meetingLink = meetingLink;
        if (status !== undefined) session.status = status;

        await session.save();

        return res.status(200).json({
            message: "Updated successfully",
            session
        });

    } catch (err) {
        console.log("Error updating session:", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Delete session 
const deleteSession = async (req, res) => {
    try {
        const trainerId = req.user._id;
        const sessionId = req.params.sessionId;

        if (!isValidObjectId(sessionId)) {
            return res.status(400).json({
                message: "Invalid session ID"
            });
        }

        const session = await TrainerSession.findOne({
            _id: sessionId,
            trainerId
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        if (session.status !== "scheduled") {
            return res.status(400).json({
                message: "Only scheduled sessions can be deleted"
            });
        }

        await TrainerSession.findOneAndDelete({
            _id: sessionId,
            trainerId
        });

        return res.status(200).json({
            message: "Deleted successfully"
        });

    } catch (err) {
        console.log("Error in delete:", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Change status of session
const completeSession = async (req,res)=>{
    try{
        const trainerId = req.user._id;
        const sessionId = req.params.sessionId;

        if (!isValidObjectId(sessionId)) {
            return res.status(400).json({
                message: "Invalid session ID"
            });
        }
        const recordingUrl = req.body.recordingUrl;

        // Find session owned by this trainer
        const session = await TrainerSession.findOne({
            _id: sessionId,
            trainerId
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }
        // Only scheduled sessions can be completed
        if(session.status !== "scheduled"){
            return res.status(400).json({
                message:"Only scheduled sessions can be completed"
            });
        }
        
        // Only live session can be completed
        if(session.sessionType !== "live"){
            return res.status(400).json({
                message:"Only live sessions can be completed"
            });
        }

        // Recording Url
        if(recordingUrl !== undefined){
            session.recordingUrl = recordingUrl;
        }
        session.status = "completed";

        await session.save();

        return res.status(200).json({
            message: "Session completed successfully",
            session
        });
    }catch(err){
        console.log("Error in marking session complete",err);

        return res.status(500).json({
            message:"Server Error"
        })
    }
}

// Publish Session
const publishSession = async (req, res) => {
    try {
        const trainerId = req.user._id;
        const { sessionId } = req.params;
        if (!isValidObjectId(sessionId)) {
            return res.status(400).json({
                message: "Invalid session ID"
            });
        }

        const session = await TrainerSession.findOne({
            _id: sessionId,
            trainerId
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        if (session.status !== "completed") {
            return res.status(400).json({
                message: "Only completed sessions can be published"
            });
        }

        if (session.sessionType !== "live") {
            return res.status(400).json({
                message: "This session has already been published"
            });
        }

        if (!session.recordingUrl) {
            return res.status(400).json({
                message: "Recording URL is required before publishing"
            });
        }

        // Create the recorded course
        const course = await Course.create({
            title: session.title,
            description: session.description || "",
            trainerId: session.trainerId,

            // Required Course fields
            category: "Live Session",
            level: "beginner",
            duration: 0,

            thumbnail: null,
            status: "published"
        });

        // Mark session as recorded/published
        session.sessionType = "recorded";

        await session.save();

        return res.status(201).json({
            message: "Session published successfully",
            course,
            session
        });

    } catch (err) {
        console.log("Error publishing session:", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};



// ==============================
// TRAINEE CONTROLLERS
// ==============================

// Get session for trainee

const getTraineeSession = async (req, res) => {
    try {
        const traineeId = req.user._id;

        const enrollments = await Enrollment.find({
            traineeId
        }).select("courseId");

        const courseIds = enrollments.map(
            enrollment => enrollment.courseId
        );

        const { page, limit, skip } = getPagination(req);

        const filter = {
            courseId: { $in: courseIds },
            status: "scheduled"
        };

        const [sessions, total] = await Promise.all([
            TrainerSession.find(filter)
                .populate("courseId", "title")
                .populate("trainerId", "name")
                .sort({ date: 1, startTime: 1, _id: 1 })
                .skip(skip)
                .limit(limit),

            TrainerSession.countDocuments(filter)
        ]);

        return res.status(200).json({
            message: "Trainee sessions fetched successfully",
            totalSessions: total,
            sessions,
            ...getPaginationMeta(page, limit, total)
        });

    } catch (err) {
        console.log("Error in fetching sessions for trainee", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};
// Enroll in session
const enrollTraineeInSession = async (req, res) => {
    try {

        const traineeId = req.user._id;
        const sessionId = req.params.sessionId;

        if (!isValidObjectId(sessionId)) {
            return res.status(400).json({
                message: "Invalid session ID"
            });
        }

        const session = await TrainerSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        if (session.sessionType !== "live") {
            return res.status(400).json({
                message: "Only live sessions can be enrolled in"
            });
        }

        if (session.status !== "scheduled") {
            return res.status(400).json({
                message: "Session is not available for enrollment"
            });
        }

        // Verify trainee is enrolled in the course
        const enrollment = await Enrollment.findOne({
            traineeId,
            courseId: session.courseId,
            status: "active"
        });

        if (!enrollment) {
            return res.status(403).json({
                message: "You are not enrolled in this course"
            });
        }

        // Prevent duplicate enrollment
        const existingEnrollment =
            await SessionEnrollment.findOne({
                traineeId,
                sessionId
            });

        if (existingEnrollment) {
            return res.status(400).json({
                message: "Already enrolled in this session"
            });
        }

        // Atomically reserve a seat
        const updatedSession = await TrainerSession.findOneAndUpdate(
            {
                _id: sessionId,
                status: "scheduled",
                $expr: {
                    $lt: ["$enrolledCount", "$maxSeats"]
                }
            },
            {
                $inc: {
                    enrolledCount: 1
                }
            },
            {
                new: true
            }
        );

        if (!updatedSession) {
            return res.status(400).json({
                message: "Session is full or unavailable"
            });
        }

        try {
            // Create session enrollment
            await SessionEnrollment.create({
                traineeId,
                sessionId
            });

        } catch (err) {
            // Roll back reserved seat if enrollment creation fails
            await TrainerSession.findByIdAndUpdate(
                sessionId,
                {
                    $inc: {
                        enrolledCount: -1
                    }
                }
            );

            throw err;
        }

        return res.status(201).json({
            message: "Successfully enrolled in session",
            enrolledCount: updatedSession.enrolledCount,
            remainingSeats:
                updatedSession.maxSeats - updatedSession.enrolledCount
        });

    } catch (err) {

        console.log(
            "Error enrolling trainee in session:",
            err
        );

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Cancel the session enrollment
const cancelSessionEnrollment = async (req,res) =>{
    try{
        const traineeId = req.user._id;
        const sessionId = req.params.sessionId;

        if (!isValidObjectId(sessionId)) {
            return res.status(400).json({
                message: "Invalid session ID"
            });
        }

        // check session exists 
        const session = await TrainerSession.findById(sessionId)

        if(!session){
            return res.status(404).json({
                message: "Session not found"
            });
        }

        // Find trainee's session enrolment
        const sessionEnrollment = await SessionEnrollment.findOne({
            traineeId,
            sessionId
        });

        if (!sessionEnrollment) {
            return res.status(404).json({
                message: "You are not enrolled in this session"
            });
        }

        // Remove enrollment
        await SessionEnrollment.deleteOne({
            _id: sessionEnrollment._id
        });

        // Decrease count safely
        if (session.enrolledCount > 0) {
            session.enrolledCount -= 1;
            await session.save();
        }

        return res.status(200).json({
            message: "Session enrollment cancelled successfully",
            enrolledCount: session.enrolledCount,
            remainingSeats: session.maxSeats - session.enrolledCount
        });



    }catch (err) {

        console.log(
            "Error cancelling session enrollment:",
            err
        );

        return res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports={
    createSession,
    getTrainerSessions,
    updateSession,
    deleteSession,
    getTraineeSession,
    enrollTraineeInSession,
    cancelSessionEnrollment,
    completeSession,
    publishSession
}