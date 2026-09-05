const mongoose = require("mongoose");

const trainerProfileSchema = new mongoose.Schema(
    {
        // Link trainer profile to User
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        // Trainer's professional qualification
        qualifications: [
            {
                degree: {
                    type: String,
                    trim: true
                },
                institution: {
                    type: String,
                    trim: true
                },
                year: {
                    type: Number
                }
            }
        ],

        // Trainer's professional experience
        workExperience: [
            {
                organization: {
                    type: String,
                    trim: true
                },
                designation: {
                    type: String,
                    trim: true
                },
                startDate: {
                    type: Date
                },
                endDate: {
                    type: Date
                },
                description: {
                    type: String,
                    trim: true
                }
            }
        ],

        // Areas in which trainer has expertise
        expertise: [
            {
                type: String,
                trim: true
            }
        ],

        // Skills possessed by trainer
        skills: [
            {
                type: String,
                trim: true
            }
        ],

        // Subjects trainer can teach
        subjects: [
            {
                type: String,
                trim: true
            }
        ],

        // Optional professional biography
        bio: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const TrainerProfile = mongoose.model(
    "TrainerProfile",
    trainerProfileSchema
);

module.exports = TrainerProfile;