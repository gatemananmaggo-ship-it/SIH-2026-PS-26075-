const TrainerProfile = require('../models/trainer');

const createProfile = async (req,res)=>{
    try{

        // Get logged in user's ID from authentication middleware
        const userId = req.user._id;
    
        // Check if profile already exist
        const existProfile = await TrainerProfile.findOne({userId});
    
        if(existProfile){
            return res.status(409).json({
                message:"profile already exist"
            });
        }
    
        // Get Profile data from request body
        const{
            qualifications,
            workExperience,
            expertise,
            skills,
            subjects,
            bio
        } = req.body;
    
        const trainerProfile = await TrainerProfile.create({
            userId,
            qualifications,
            workExperience,
            expertise,
            skills,
            subjects,
            bio
        });
        return res.status(201).json({
            message: "Trainer profile created successfully",
            profile: trainerProfile
        });
    }catch(err){
        console.log("Error in creating trainer profile",err);
        res.status(500).json({
            message:"server error"
        })
    }
}

const getProfile = async (req,res)=>{
    try{

        // Get user form user._id
        const userId = req.user._id;
    
        // Find the Profile related to this id
        const profile = await TrainerProfile.findOne({userId});
    
        if(!profile){
            return res.status(404).json({
                message:"Trainer profile not found"
            });
        }
    return res.status(200).json({
            message:"Profie Found",
            profile
        });
    }catch(err){
        console.log("Error in getting trainer profile",err);
        res.status(500).json({
            message:"server error"
        })
    }
}

const updateProfile = async (req,res)=>{
    try{
        // Get logged-in user's Id
        const userId = req.user._id

        // Get Updated fields
        const{
            qualifications,
            workExperience,
            expertise,
            skills,
            subjects,
            bio
        } = req.body;

        // Find and Update the data 
        const updatedProfile = await TrainerProfile.findOneAndUpdate({userId},{
            qualifications,
            workExperience,
            expertise,
            skills,
            subjects,
            bio
        },{
            new: true,
            runValidators: true
        })

        // Profile not Found
        if(!updatedProfile){
            return res.status(404).json({
                message:"Trainer profile not found"
            });
        }

        return res.status(200).json({
            message: "Trainer profile updated successfully",
            profile: updatedProfile
        });
    } catch(err){
        console.log("Update trainer profile error:", err);

        return res.status(500).json({
            message:"server Error"
        })
    }
}

module.exports={
    createProfile,
    getProfile,
    updateProfile
};