const crypto = require("crypto");
const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const TrainerSession = require('../models/trainersession');
const SessionEnrollment = require("../models/sessionEnrollment");

const { isValidObjectId } = require("../utils/validation");
const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");
const { generateJaasJwt, extractRoomName } = require("../utils/jaasJwt");

// ==============================
// TRAINER CONTROLLERS
// ==============================
// Create session
const createSession = async (req,res)=>{
    try{
        const trainerId = req.user._id;

        const {
            courseId,
            title,
            description,
            date,
            startTime,
            endTime,
            maxSeats,
            maxCapacity
        } = req.body;

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

        const sessionDateTime = new Date(sessionDate);
        sessionDateTime.setHours(start[0], start[1], 0, 0);

        if (sessionDateTime < new Date()) {
            return res.status(400).json({
                message: "Session start time cannot be in the past"
            });
        }

        // Verify course ownership
        const course = await Course.findOne({
            _id: courseId,
            trainerId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or u are not the owner"
            });
        }

        // CRITICAL: Always generate a unique, stable JaaS room name on the backend.
        // Client-supplied meeting URLs or room names are never accepted.
        // Format: "capacity-connect-<12 random hex chars>" — used as the JaaS roomName.
        const meetingRoom = `capacity-connect-${crypto.randomBytes(6).toString("hex")}`;

        const session = await TrainerSession.create({
            trainerId,
            courseId,
            title: title ? title.trim() : "",
            description: description ? description.trim() : "",
            date,
            startTime,
            endTime,
            meetingRoom,  // JaaS room identifier (new field)
            maxSeats: Number(maxSeats || maxCapacity) || 30
        });

        return res.status(201).json({
            message: "Created successfully",
            session
        });
    } catch (err) {
        console.log("Error in creating Session", err);

        return res.status(500).json({
            message: 'Server Error'
        });
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

        // Normalize meetingUrl as canonical property (with fallback to legacy meetingLink)
        const normalizedSessions = sessions.map(session => {
            const obj = session.toObject();
            if (!obj.meetingUrl && obj.meetingLink) {
                obj.meetingUrl = obj.meetingLink;
            }
            return obj;
        });

        return res.status(200).json({
            message: "Sessions fetched successfully",
            totalSessions: total,
            sessions: normalizedSessions,
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
            maxSeats,
            maxCapacity,
            status
        } = req.body;

        // If status is provided, reject arbitrary status transitions
        if (status !== undefined && status !== session.status) {
            if (status === "cancelled" && session.status === "scheduled") {
                session.status = "cancelled";
            } else {
                return res.status(400).json({
                    message: "Invalid session status transition. Session status is controlled via start and complete endpoints."
                });
            }
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
        if (title !== undefined) session.title = title.trim();
        if (description !== undefined) session.description = description.trim();
        session.date = sessionDate;
        session.startTime = updatedStartTime;
        session.endTime = updatedEndTime;
        if (maxSeats !== undefined || maxCapacity !== undefined) {
            const parsedSeats = Number(maxSeats || maxCapacity);
            if (!isNaN(parsedSeats) && parsedSeats >= 1) {
                session.maxSeats = parsedSeats;
            }
        }

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

// Start session (Trainer triggers scheduled -> in_progress and retrieves Jitsi room)
const startSession = async (req, res) => {
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

        // Strictly enforce: only scheduled -> in_progress transition
        if (session.status === "in_progress") {
            return res.status(400).json({
                message: "Session is already in progress"
            });
        }

        if (session.status === "completed") {
            return res.status(400).json({
                message: "Session is already completed"
            });
        }

        if (session.status !== "scheduled") {
            return res.status(400).json({
                message: "Only scheduled sessions can be started"
            });
        }

        // Validate session start time on backend (can be started up to 30 minutes before scheduled start)
        if (!session.date || !session.startTime) {
            return res.status(400).json({
                message: "Session date and start time are required to start session"
            });
        }

        try {
            const sessionDate = new Date(session.date);
            const timeParts = session.startTime.split(":");
            if (timeParts.length !== 2) {
                return res.status(400).json({
                    message: "Invalid session start time format"
                });
            }
            const hours = Number(timeParts[0]);
            const minutes = Number(timeParts[1]);
            if (isNaN(hours) || isNaN(minutes) || isNaN(sessionDate.getTime())) {
                return res.status(400).json({
                    message: "Cannot determine session start time"
                });
            }

            sessionDate.setHours(hours, minutes, 0, 0);
            const now = new Date();
            const earliestAllowed = new Date(sessionDate.getTime() - 30 * 60 * 1000);
            if (now < earliestAllowed) {
                return res.status(400).json({
                    message: `Session cannot be started yet. Scheduled for ${session.startTime} (available 30 minutes prior).`
                });
            }
        } catch (timeErr) {
            return res.status(400).json({
                message: "Failed to validate session start time"
            });
        }

        // Resolve the stable JaaS room name.
        // Priority: meetingRoom (new) > extract from legacy meetingUrl > extract from meetingLink > generate fresh.
        let roomName = session.meetingRoom || null;
        if (!roomName) {
            roomName = extractRoomName(session.meetingUrl || session.meetingLink || "");
        }
        if (!roomName) {
            // Fallback: generate and persist a room name for very old sessions
            roomName = `capacity-connect-${crypto.randomBytes(6).toString("hex")}`;
        }

        // CRITICAL SAFETY: Generate JaaS JWT BEFORE transitioning session status.
        // If JWT generation fails (e.g. credentials not configured), the session
        // must remain 'scheduled' — do NOT leave it stuck in 'in_progress'.
        let jaas;
        try {
            jaas = generateJaasJwt(req.user, roomName, true);
        } catch (jwtErr) {
            // JaaS credentials are not configured on the server — return 503.
            // Session status is NOT changed; trainer gets a clear actionable message.
            console.error("[JaaS] JWT generation failed for startSession:", jwtErr.message);
            return res.status(503).json({
                message: "Live classroom is not available: JaaS credentials are not configured on the server. " +
                         "Set JAAS_APP_ID, JAAS_KEY_ID, and JAAS_PRIVATE_KEY in the backend environment."
            });
        }

        // Persist the resolved room name if not already stored
        if (!session.meetingRoom) {
            session.meetingRoom = roomName;
        }

        // Transition scheduled -> in_progress (only reached after successful JWT generation)
        session.status = "in_progress";
        await session.save();

        return res.status(200).json({
            message: "Session started successfully",
            session,
            jaas: {
                appId: jaas.appId,
                roomName: jaas.roomName,
                jwt: jaas.jwt,
                domain: jaas.domain
            }
        });

    } catch (err) {
        console.log("Error starting session:", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Change status of session (in_progress or scheduled -> completed)
const completeSession = async (req, res) => {
    try {
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
        // Only in_progress sessions can be completed (lifecycle: scheduled -> in_progress -> completed)
        if (session.status !== "in_progress") {
            return res.status(400).json({
                message: session.status === "completed"
                    ? "Session is already completed"
                    : "Session must be started (in_progress) before it can be completed"
            });
        }
        
        // Only live session can be completed
        if (session.sessionType !== "live") {
            return res.status(400).json({
                message: "Only live sessions can be completed"
            });
        }

        // Recording Url
        if (recordingUrl !== undefined) {
            session.recordingUrl = recordingUrl.trim();
        }
        session.status = "completed";

        await session.save();

        return res.status(200).json({
            message: "Session completed successfully",
            session
        });
    } catch (err) {
        console.log("Error in marking session complete", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Update session recording URL (post-session attachment & editing)
const updateSessionRecording = async (req, res) => {
    try {
        const trainerId = req.user._id;
        const sessionId = req.params.sessionId;

        if (!isValidObjectId(sessionId)) {
            return res.status(400).json({
                message: "Invalid session ID"
            });
        }

        const { recordingUrl } = req.body;
        if (recordingUrl === undefined) {
            return res.status(400).json({
                message: "recordingUrl is required"
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
                message: "Recording URL can only be attached to completed sessions"
            });
        }

        session.recordingUrl = typeof recordingUrl === "string" ? recordingUrl.trim() : "";
        await session.save();

        return res.status(200).json({
            message: "Recording URL updated successfully",
            session
        });
    } catch (err) {
        console.log("Error updating session recording:", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

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

        // Create the recorded course linking back to the source session
        const course = await Course.create({
            title: session.title,
            description: session.description || "",
            trainerId: session.trainerId,
            sourceSessionId: session._id,

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

// Get session for trainee (shows scheduled, in_progress, and completed sessions with recordings)
const getTraineeSession = async (req, res) => {
    try {
        const traineeId = req.user._id;

        const enrollments = await Enrollment.find({
            traineeId,
            status: { $in: ["active", "completed"] }
        }).select("courseId");

        const courseIds = enrollments.map(
            enrollment => enrollment.courseId
        );

        const { page, limit, skip } = getPagination(req);

        // Include scheduled, in_progress, and completed so trainees can join live and watch recordings
        const filter = {
            courseId: { $in: courseIds },
            status: { $in: ["scheduled", "in_progress", "completed"] }
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

        // Find which of these sessions the current trainee is enrolled in
        const sessionIds = sessions.map(s => s._id);
        const traineeSessionEnrollments = await SessionEnrollment.find({
            traineeId,
            sessionId: { $in: sessionIds }
        }).select("sessionId");

        const enrolledSessionIdSet = new Set(
            traineeSessionEnrollments.map(e => e.sessionId.toString())
        );

        // Strip meeting URL for non-enrolled trainees and add enrollment metadata
        const safeSessions = sessions.map(session => {
            const isEnrolled = enrolledSessionIdSet.has(session._id.toString());
            const sessionObj = session.toObject();

            // Canonical normalization for legacy documents:
            if (!sessionObj.meetingUrl && sessionObj.meetingLink) {
                sessionObj.meetingUrl = sessionObj.meetingLink;
            }
            delete sessionObj.meetingLink;

            // CRITICAL SECURITY: A trainee who is NOT enrolled in the session must NOT
            // obtain the room identifier. Note: meetingRoom alone is not sufficient to join
            // (a backend-issued JWT is required), but we strip it anyway per defense-in-depth.
            if (!isEnrolled) {
                delete sessionObj.meetingUrl;
                delete sessionObj.meetingRoom;
            }

            const availableSeats = Math.max(0, (session.maxSeats || 30) - (session.enrolledCount || 0));

            return {
                ...sessionObj,
                isEnrolled,
                availableSeats,
                remainingSeats: availableSeats
            };
        });

        return res.status(200).json({
            message: "Trainee sessions fetched successfully",
            totalSessions: total,
            sessions: safeSessions,
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

        // Enrollment is allowed ONLY while the session is scheduled.
        // Closed when in_progress, completed, or cancelled.
        if (session.status !== "scheduled") {
            return res.status(400).json({
                message: "Session enrollment is closed"
            });
        }

        // Verify trainee is enrolled in the course
        const enrollment = await Enrollment.findOne({
            traineeId,
            courseId: session.courseId,
            status: { $in: ["active", "completed"] }
        });

        if (!enrollment) {
            return res.status(403).json({
                message: "You are not enrolled in this course"
            });
        }

        // Prevent duplicate enrollment
        const existingEnrollment = await SessionEnrollment.findOne({
            traineeId,
            sessionId
        });

        if (existingEnrollment) {
            return res.status(400).json({
                message: "Already enrolled in this session"
            });
        }

        // Atomically reserve a seat: validate maxSeats > current enrolledCount safely while scheduled
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
            const currentSession = await TrainerSession.findById(sessionId).select("status");
            if (currentSession && currentSession.status !== "scheduled") {
                return res.status(400).json({
                    message: "Session enrollment is closed"
                });
            }
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

        const remainingSeats = Math.max(0, updatedSession.maxSeats - updatedSession.enrolledCount);

        return res.status(201).json({
            message: "Successfully enrolled in session",
            sessionId: updatedSession._id,
            enrolledCount: updatedSession.enrolledCount,
            availableSeats: remainingSeats,
            remainingSeats,
            isEnrolled: true,
            meetingUrl: updatedSession.meetingUrl || updatedSession.meetingLink
        });

    } catch (err) {
        console.log("Error enrolling trainee in session:", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Cancel the session enrollment
const cancelSessionEnrollment = async (req, res) => {
    try {
        const traineeId = req.user._id;
        const sessionId = req.params.sessionId;

        if (!isValidObjectId(sessionId)) {
            return res.status(400).json({
                message: "Invalid session ID"
            });
        }

        // check session exists 
        const session = await TrainerSession.findById(sessionId);

        if (!session) {
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
        let newEnrolledCount = session.enrolledCount;
        if (session.enrolledCount > 0) {
            newEnrolledCount -= 1;
            session.enrolledCount = newEnrolledCount;
            await session.save();
        }

        const availableSeats = Math.max(0, session.maxSeats - newEnrolledCount);

        return res.status(200).json({
            message: "Session enrollment cancelled successfully",
            sessionId,
            enrolledCount: newEnrolledCount,
            availableSeats,
            remainingSeats: availableSeats,
            isEnrolled: false
        });

    } catch (err) {
        console.log("Error cancelling session enrollment:", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Authorize trainee joining a live session — returns a short-lived JaaS JWT
const joinTraineeSession = async (req, res) => {
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

        if (session.status === "cancelled") {
            return res.status(400).json({
                message: "Session has been cancelled"
            });
        }

        if (session.status !== "in_progress") {
            return res.status(400).json({
                message: "Session is not currently live. Join is only allowed while the session is in progress."
            });
        }

        // Verify course enrollment
        const courseEnrollment = await Enrollment.findOne({
            traineeId,
            courseId: session.courseId,
            status: { $in: ["active", "completed"] }
        });

        if (!courseEnrollment) {
            return res.status(403).json({
                message: "You are not enrolled in the course for this session"
            });
        }

        // CRITICAL: Backend access authorization verifies session enrollment
        const sessionEnrollment = await SessionEnrollment.findOne({
            traineeId,
            sessionId
        });

        if (!sessionEnrollment) {
            return res.status(403).json({
                message: "Access denied. You must enroll in this session before joining."
            });
        }

        // Resolve the stable JaaS room name for this session
        const roomName =
            session.meetingRoom ||
            extractRoomName(session.meetingUrl || session.meetingLink || "");

        if (!roomName) {
            return res.status(404).json({
                message: "Meeting room has not been generated for this session. Ask the trainer to start the session first."
            });
        }

        // Generate short-lived JaaS JWT for the trainee (moderator = false)
        let jaas;
        try {
            jaas = generateJaasJwt(req.user, roomName, false);
        } catch (jwtErr) {
            return res.status(503).json({
                message: "Live classroom is not available. JaaS credentials are not configured on the server."
            });
        }

        return res.status(200).json({
            message: "Access granted",
            jaas: {
                appId: jaas.appId,
                roomName: jaas.roomName,
                jwt: jaas.jwt,
                domain: jaas.domain
            }
        });

    } catch (err) {
        console.log("Error authorizing trainee session join:", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Trainer re-joins an already in_progress session they own (fresh JWT)
const trainerJoinSession = async (req, res) => {
    try {
        const trainerId = req.user._id;
        const sessionId = req.params.sessionId;

        if (!isValidObjectId(sessionId)) {
            return res.status(400).json({ message: "Invalid session ID" });
        }

        const session = await TrainerSession.findOne({ _id: sessionId, trainerId });

        if (!session) {
            return res.status(404).json({ message: "Session not found or you are not the owner" });
        }

        if (session.status !== "in_progress") {
            return res.status(400).json({
                message: "Session is not in progress. Start the session first."
            });
        }

        const roomName =
            session.meetingRoom ||
            extractRoomName(session.meetingUrl || session.meetingLink || "");

        if (!roomName) {
            return res.status(404).json({ message: "Meeting room not found for this session" });
        }

        let jaas;
        try {
            jaas = generateJaasJwt(req.user, roomName, true);
        } catch (jwtErr) {
            return res.status(503).json({
                message: "Live classroom is not available. JaaS credentials are not configured on the server."
            });
        }

        return res.status(200).json({
            message: "Access granted",
            session,
            jaas: {
                appId: jaas.appId,
                roomName: jaas.roomName,
                jwt: jaas.jwt,
                domain: jaas.domain
            }
        });

    } catch (err) {
        console.log("Error in trainer session join:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createSession,
    getTrainerSessions,
    updateSession,
    deleteSession,
    getTraineeSession,
    enrollTraineeInSession,
    cancelSessionEnrollment,
    joinTraineeSession,
    trainerJoinSession,
    startSession,
    completeSession,
    updateSessionRecording,
    publishSession
};