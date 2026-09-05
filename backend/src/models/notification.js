const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        type:{
            type: String,
            enum:[
                "announcement",
                "achievement",
                "new_content"
            ],
            required: true
        },

        title:{
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        body: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        isPinned: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        }

    },{
        timestamps: true
    }
)

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

module.exports = Notification;