
const mongoose= require('mongoose');

// Basically for Identity => Authentication => Role => Account status

const userSchema = new mongoose.Schema(
    {
        name: {type: String , required: true, trim: true},
        email: {type: String , required: true , trim: true , unique: true , lowercase: true},
        password: {type: String, required: true},
        role: {type: String, enum: ["trainee", "trainer", "admin"],default: "trainee", required: true},
        isApproved: {type: Boolean , default: false}, // false → waiting for admin approval || true  → approved
        isActive : {type: Boolean , default: true} , // admin can remove any account
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;