// External module
const express = require('express');

// Including Local Module 
const {registerUser,loginUser,logoutUser} = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")


// Creating Router
const authrouter = express.Router()

// ===============================
// PUBLIC ROUTES
// ===============================

// Register
authrouter.post("/register", registerUser);

// Login
authrouter.post("/login", loginUser);

// ===============================
// SESSION/AUTH ROUTES
// ===============================

// Check current session
authrouter.get("/session", authMiddleware, (req, res) => {
    res.status(200).json({
        authenticated: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Logout
authrouter.post("/logout", logoutUser);

// ===============================
// PROTECTED ROUTES
// ===============================

// Test protected route
authrouter.get('/protected',authMiddleware,(req,res)=>{
    // console.log("SESSION:", req.session);
    // console.log("USER:", req.user);
    res.status(200).json({
        message:"You have access to protected route",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});



module.exports=authrouter