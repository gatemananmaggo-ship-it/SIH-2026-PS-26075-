// External Module
const bcrypt = require('bcryptjs');


// Local Module
const User = require('../models/user');

const registerUser = async (req, res)=>{
    try {
        const { name , email , password} = req.body;

        // 1. Validating fields
        if(!name || !email || !password)
            return res.status(400).json({
                message: "Name, email and password are required"
            });

        // 2. Check wether user already exist or not
        const existUser = await User.findOne({email});

        if(existUser){
            return res.status(409).json({
            message: "User with this email already exists"
            });
        }

        // 3. Hash pasword
        const hash_pass = await bcrypt.hash(password, 12)

        // 4. Creating User
        const user = await User.create({
            name,
            email,
            password:hash_pass
        });

        //5. Sending User fields as response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: "Server error"
        });        
    }
};

// Login functionality
const loginUser = async (req,res)=>{
    try{
        const{email,password} = req.body;

        // 1. Empty enrty fields
        if(!email || !password){
            return res.status(400).json({
                message:"Email and password required!!"
            });
        }

        // 2. Finding User
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                message:"User not found"
            });
        }

        // 3. Checking Password
        const isPassCorrect = await bcrypt.compare(password,user.password);

        if (!isPassCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account has been deactivated"
            });
        }

        // maintaining session
        req.session.userId = user._id;
        // console.log(req.session.userId);
        req.session.role = user.role;
        // console.log(req.session.role);

        // 5. Sucessful Login
        res.status(200).json({
            message:"Login Sucessful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }catch(err){
        console.error("Login error:", err);

        res.status(500).json({
            message: "Server error"
        });
    }
} 

// Logout functionality
const logoutUser = async (req,res)=>{
    // destroying session
    req.session.destroy((err)=>{
        if(err){
            console.error("Logout error", err)
    
            return res.status(500).json({
                message:"Could not logout"
            });
        }
        res.clearCookie("connect.sid");

        return res.status(200).json({
            message: "Logout successful"
        });
    });
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
