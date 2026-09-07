const mongoose = require("mongoose");

const traineeProfileSchema = new mongoose.Schema(
    {
        // Link profile to the authenticated User
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        // Educational qualifications
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

        // Previous/current work experience
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

        // Areas the trainee is interested in
        interests: [
            {
                type: String,
                trim: true
            }
        ],

        // Skills possessed by trainee
        skills: [
            {
                type: String,
                trim: true
            }
        ],

        designation: {
            type: String,
            trim: true,
            default: ""
        },

        department: {
            type: String,
            trim: true,
            default: ""
        },

        organization: {
            type: String,
            trim: true,
            default: ""
        },

        regionalCenter: {
            type: String,
            trim: true,
            default: ""
        },

        // Professional certificates
        certificates: [
            {
                name: {
                    type: String,
                    trim: true
                },
                issuingOrganization: {
                    type: String,
                    trim: true
                },
                issueDate: {
                    type: Date
                },
                certificateUrl: {
                    type: String,
                    trim: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);
const TraineeProfile = mongoose.model(
    "TraineeProfile",
    traineeProfileSchema
);

module.exports = TraineeProfile;
