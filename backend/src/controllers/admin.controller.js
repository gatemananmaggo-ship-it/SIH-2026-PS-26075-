const User = require("../models/user");
const { isValidObjectId } = require("../utils/validation");
const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");

// Fetching All Users
// const getAllUsers = async (req,res)=>{
//     try{
//         // Find all users
//         const users = await User.find({role: { $in: ["trainee", "trainer"] } }).select("-password");

//         // role: { $in: ["trainee", "trainer"] }
//         // means:
//         // Find users whose role is either "trainee" OR "trainer".

//         // .select("-password") => means: Get everything except the password.

//         return res.status(200).json({
//             message:"Users fetched successfully",
//             users
//         });
//     } catch (err){
//         console.log("Error in fetching users", err);
//         return res.status(500).json({
//             message: "server error"
//         });
//     }
// };

const getAllUsers = async (req,res)=>{
    try{

        const { page, limit, skip } = getPagination(req);

        const filter = {
            role: { $in: ["trainee", "trainer"] }
        };

        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            User.countDocuments(filter)
        ]);

        return res.status(200).json({
            message:"Users fetched successfully",
            users,
            ...getPaginationMeta(page, limit, total)
        });

    } catch (err){

        console.log("Error in fetching users", err);

        return res.status(500).json({
            message: "server error"
        });
    }
};

// Fetching All Pending Users
// const getPendingUsers = async (req,res)=>{
//     try{
//         // Find all users
//         const users = await User.find({role: { $in: ["trainee", "trainer"] } , isApproved:false }).select("-password");

//         return res.status(200).json({
//             message:"Pending Users fetched successfully",
//             users
//         });
//     } catch (err){
//         console.log("Error in fetching pending users", err);
//         return res.status(500).json({
//             message: "server error"
//         });
//     }
// };

const getPendingUsers = async (req,res)=>{
    try{

        const { page, limit, skip } = getPagination(req);

        const filter = {
            role: { $in: ["trainee", "trainer"] },
            isApproved: false
        };

        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            User.countDocuments(filter)
        ]);

        return res.status(200).json({
            message:"Pending Users fetched successfully",
            users,
            ...getPaginationMeta(page, limit, total)
        });

    } catch (err){

        console.log("Error in fetching pending users", err);

        return res.status(500).json({
            message: "server error"
        });
    }
};

// To approve users
const approveUser = async (req,res)=>{
    try{
        // Getting user id from URL
        const userId = req.params.id;
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        // Find user 
        const user = await User.findOne({
            _id : userId,
            role: {$in: ["trainer","trainee"]}
        });

        // User not found
        if(!user){
            return res.status(404).json({
                message:"User not Found"
            });
        }

        // Check if user is already approved
        if(user.isApproved){
            return res.status(400).json({
                message:"User is already Approved"
            });
        }

        // Approve User
        user.isApproved= true;
        
        await user.save()

        return res.status(200).json({
            message:"Changed status",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                isActive: user.isActive
            }
        })

    }catch (err) {

        console.log("Error in approving user:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// To approve users
const updateUserStatus = async (req,res)=>{
    try{
        // Getting user id from URL
        const userId = req.params.id;
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        // Get status from request body
        const { isActive } = req.body;

        // Validate isActive
        if(typeof isActive !== "boolean"){
            return res.status(400).json({
                message:"isActive must be true or false"
            });
        }

        // Finding trainer or trainee
        const user = await User.findOne({
            _id : userId,
            role: { $in: ["trainee", "trainer"] }
        });

        // User not found
        if(!user){
            return res.status(404).json({
                message:"User not Found"
            });
        }

        // Update account 
        user.isActive = isActive;

        await user.save();
        
        return res.status(200).json({
            message: isActive
                ? "User activated successfully"
                : "User deactivated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                isActive: user.isActive
            }
        })

    }catch (err) {

        console.log("Error in updating status :", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// To approve users
const changeUserRole = async (req,res)=>{
    try{
        // Getting user id from URL
        const userId = req.params.id;
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        // Get role from request body
        const { role } = req.body;

        // Validate role
        if(!["trainer","trainee"].includes(role)){
            return res.status(400).json({
                message:"Role must be either trainee or trainer"
            });
        }

        // Finding only trainer or trainee
        const user = await User.findOne({
            _id : userId,
            role: { $in: ["trainee", "trainer"] }
        });

        // User not found
        if(!user){
            return res.status(404).json({
                message:"User not Found"
            });
        }

        // Check if same role 
        if(user.role === role){
            return res.status(400).json({
                message:`User is already a ${role}`
            })
        }

        // Change role 
        user.role = role;

        await user.save();
        
        return res.status(200).json({
            message: "User role updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                isActive: user.isActive
            }
        })

    }catch (err) {

        console.log("Error in updating status :", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Dashborad Statistics
const getDashboardStats = async (req, res)=>{
    try {
        // Total Trainees
        const totalTrainees = await User.countDocuments({
            role: "trainee"
        });

        // Total Trainers
        const totalTrainers = await User.countDocuments({
            role: "trainer"
        });

        // Pending Approval
        const pendingApprovals = await User.countDocuments({
            role:{$in: ["trainee",'trainer']},
            isApproved:false
        });

        // Active Users
        const activeUsers = await User.countDocuments({
            role:{$in: ["trainee",'trainer']},
            isActive: true
        });

        // Inactive Users
        const inactiveUsers = await User.countDocuments({
            role:{$in: ["trainee",'trainer']},
            isActive: false
        });
        
        // Toatl Users
        const totalUsers = await User.countDocuments({
            role:{$in: ["trainee",'trainer']}
        });

        return res.status(200).json({
            message: "Dashboard statistics fetched successfully",
            stats: {
                totalUsers,
                totalTrainees,
                totalTrainers,
                pendingApprovals,
                activeUsers,
                inactiveUsers
            }
        })
        
    }catch (err) {
    
        console.log("Error in getting dashboard statistics:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
}


module.exports={
    getAllUsers,
    getPendingUsers,
    approveUser,
    updateUserStatus,
    changeUserRole,
    getDashboardStats
};