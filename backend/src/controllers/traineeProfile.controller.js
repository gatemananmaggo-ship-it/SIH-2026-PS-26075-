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
            certificates
        } = req.body;

        const traineeProfile = await TraineeProfile.create({
            userId,
            qualifications,
            workExperience,
            interests,
            skills,
            certificates
        })

        return res.status(201).json({
            message: "Trainee profile created successfully",
            profile: traineeProfile
        })
    }catch(err){
        console.log("Create trainee profile error:", err);
        return res.status(500).json({
            message:"Server error"
        })

    }
};

const getProfile = async (req,res)=>{
    try{
        // Get user id from req
        const userId = req.user._id;

        // Find the Profile related to this id
        const profile = await TraineeProfile.findOne({userId});

        // Profile not found
        if(!profile){
            return res.status(404).json({
                message:"Trainee profile not found"
            });
        }

        return res.status(200).json({
            message:"Profie Found",
            profile
        });
    } catch (err){
        console.log("Get trainee profile error:", err);

        return res.status(500).json({
            message:"server Error"
        })
    }
};

const updateProfile = async (req,res)=>{
    try{
        // Get logged in user's ID 
        const userId = req.user._id;

        // Get updated profile data
        const {
            qualifications,
            workExperience,
            interests,
            skills,
            certificates
        } = req.body;

        // Find and update the data 
        const updatedProfile = await TraineeProfile.findOneAndUpdate(
            {userId},
            {
                qualifications,
                workExperience,
                interests,
                skills,
                certificates
            },
            {
                new: true,
                runValidators: true
            }
        );

        // Profile not found
        if(!updatedProfile){
            return res.status(404).json({
                message:"Trainee profile not found"
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