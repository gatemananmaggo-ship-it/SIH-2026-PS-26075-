const TraineeProfile = require("../models/trainee");

const createProfile = async (req,res)=>{
    try{

        // Get logged in user's ID from authentication middleware
        const userId = req.user._id;

        // Check if profile allready exist
        const existProfile = await TraineeProfile.findOne({userId});

        if(existProfile){
            return res.status(409).json({
                message:"user already exist"
            })
        }

        // Get profile data from request body
        const {
            qualifications,
            workExperience,
            interests,
            skills,
            certificates,
            designation,
            department,
            organization,
            regionalCenter
        } = req.body;

        const traineeProfile = await TraineeProfile.create({
            userId,
            qualifications,
            workExperience,
            interests,
            skills,
            certificates,
            designation: designation ? designation.trim() : "",
            department: department ? department.trim() : "",
            organization: organization ? organization.trim() : "",
            regionalCenter: regionalCenter ? regionalCenter.trim() : ""
        });

        return res.status(201).json({
            message: "Trainee profile created successfully",
            profile: traineeProfile
        });
    } catch(err) {
        console.log("Create trainee profile error:", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getProfile = async (req, res) => {
    try {
        // Get user id from req
        const userId = req.user._id;

        // Find the Profile related to this id
        const profile = await TraineeProfile.findOne({ userId }).populate("userId", "name email role");

        // Profile not found
        if (!profile) {
            return res.status(404).json({
                message: "Trainee profile not found"
            });
        }

        return res.status(200).json({
            message: "Profile Found",
            profile
        });
    } catch (err) {
        console.log("Get trainee profile error:", err);

        return res.status(500).json({
            message: "server Error"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        // Get logged in user's ID 
        const userId = req.user._id;

        // Get updated profile data
        const {
            qualifications,
            workExperience,
            interests,
            skills,
            certificates,
            designation,
            department,
            organization,
            regionalCenter
        } = req.body;

        const updateData = {};
        if (qualifications !== undefined) updateData.qualifications = qualifications;
        if (workExperience !== undefined) updateData.workExperience = workExperience;
        if (interests !== undefined) updateData.interests = interests;
        if (skills !== undefined) updateData.skills = skills;
        if (certificates !== undefined) updateData.certificates = certificates;
        if (designation !== undefined) updateData.designation = designation.trim();
        if (department !== undefined) updateData.department = department.trim();
        if (organization !== undefined) updateData.organization = organization.trim();
        if (regionalCenter !== undefined) updateData.regionalCenter = regionalCenter.trim();

        // Find and update the data 
        const updatedProfile = await TraineeProfile.findOneAndUpdate(
            { userId },
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate("userId", "name email role");

        // Profile not found
        if (!updatedProfile) {
            return res.status(404).json({
                message: "Trainee profile not found"
            });
        }

        return res.status(200).json({
            message: "Trainee profile updated successfully",
            profile: updatedProfile
        });
    }  catch (err){
        console.log("Update trainee profile error:", err);

        return res.status(500).json({
            message:"server Error"
        })
    }
};

module.exports={
    createProfile,
    getProfile,
    updateProfile
};