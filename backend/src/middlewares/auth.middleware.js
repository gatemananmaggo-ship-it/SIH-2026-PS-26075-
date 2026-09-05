// Working of middleware
// Check session => Find user => Attach user to req => next()

// Local Modules 
const User = require("../models/user");


const authMiddleware = async (req,res,next) =>{
    try {

        // console.log("SESSION:", req.session);
        // console.log("SESSION USER ID:", req.session?.userId);
        
        // Check if user has a session or not
        if(!req.session || !req.session.userId){
            return res.status(401).json({
                message:"Session not found. Authentication required"
            });
        }

        // Find user from session
        const user = await User.findById(req.session.userId);

        // User do not Match
        if(!user){
            return res.status(401).json({
                message:"User not Found"
            });
        }
        
        // Checking that user is active or not
        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account has been deactivated"
            });
        }

        // Atach User to request
        req.user = user;

        // Continue to middleware/controller
        next();

    }catch(err){
        console.log("Auth error",err);
        return res.status(500).json({
            message:"Server error"
        });
    }
}

module.exports = authMiddleware;