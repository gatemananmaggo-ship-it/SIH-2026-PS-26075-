const mongoose = require("mongoose");

const trainersessionSchema = new mongoose.Schema({
    trainerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true        
    },

    title:{
        type: String,
        required:true,
        trim:true
    },

    description:{
        type: String,
        trim: true
    },

    date:{
        type: Date,
        required: true
    },

    startTime: {
        type: String,
        required: true,
        trim: true
    },
    
    endTime: {
        type: String,
        required: true,
        trim: true
    },

    meetingLink: {
        type: String,
        trim: true,
    },

    // Legacy: full https://meet.jit.si/... URL (kept for backward compat with existing documents)
    meetingUrl: {
        type: String,
        trim: true,
    },

    // JaaS: stable room suffix used for 8x8.vc, e.g. "capacity-connect-abc123"
    // New sessions store this instead of a full URL.
    meetingRoom: {
        type: String,
        trim: true,
    },

    status: {
        type: String,
        enum: ["scheduled", "in_progress", "completed", "cancelled"],
        default: "scheduled"
    },

    maxSeats: {
        type: Number,
        // required: true,
        default: 30,
        min:1
    },

    enrolledCount: {
        type: Number,
        default: 0
    },

    recordingUrl: {
        type: String,
        trim: true
    },

    sessionType: {
        type: String,
        enum: ["live", "recorded"],
        default: "live"
    }

},
{
    timestamps: true
}
);

const TrainerSession = mongoose.model("TrainerSession", trainersessionSchema);

module.exports = TrainerSession;