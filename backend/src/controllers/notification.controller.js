const Notification = require('../models/notification')
const { isValidObjectId } = require("../utils/validation");
const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");


const createNotification = async(req,res)=>{
    try{
        const adminId = req.user._id;

        const {
            type,
            title,
            body,
            isPinned,
            isActive
        } = req.body

        if (!type || !title || !body) {
            return res.status(400).json({
                message: "type, title and body are required"
            });
        }

        const notification = await Notification.create({
            type,
            title,
            createdBy:adminId,
            body,
            isPinned,
            isActive
        });

        return res.status(201).json({
            message:"notification created successfully",
            notification
        })

        

    }catch(err){
        console.log("Error in creating notification",err);
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

// const getNotifications = async(req,res)=>{
//     try{
//         const adminId = req.user._id;

//         const notifications = await Notification.find({
//             createdBy : adminId
//         }).sort({createdAt: -1});

//         if(notifications.length === 0){
//             return res.status(404).json({
//                 message:"No notification found"
//             });
//         }

//         return res.status(200).json({
//             message:"notifications fetched successfully",
//             notifications
//         });
//     }catch(err){
//         console.log("Error in fetching notifications",err);
//         return res.status(500).json({
//             message:"Server Error"
//         })
//     }
// }
const getNotifications = async (req, res) => {
    try {
        const adminId = req.user._id;

        // Pagination
        const { page, limit, skip } = getPagination(req);

        // Keep the same filter
        const filter = {
            createdBy: adminId
        };

        // Fetch current page + total count
        const [notifications, total] = await Promise.all([
            Notification.find(filter)
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            Notification.countDocuments(filter)
        ]);

        if (total === 0) {
            return res.status(404).json({
                message: "No notification found",
                notifications: [],
                ...getPaginationMeta(page, limit, total)
            });
        }

        return res.status(200).json({
            message: "Notifications fetched successfully",
            notifications,
            ...getPaginationMeta(page, limit, total)
        });

    } catch (err) {
        console.log("Error in fetching notifications", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};
const updateNotification = async(req,res)=>{
    try{
        const adminId = req.user._id;
        const notificationId = req.params.notificationId;

        if (!isValidObjectId(notificationId)) {
            return res.status(400).json({
                message: "Invalid notification ID"
            });
        }

        const {
            type,
            title,
            body,
            isPinned,
            isActive
        } = req.body

        const notification = await Notification.findOne({
            _id: notificationId,
            createdBy: adminId
        })         

        if(!notification){
            return res.status(404).json({
                message:"notification not found or you are not the owner"
            })
        }

        // Update fields
        if(title!==undefined)notification.title = title;
        if(type !== undefined )notification.type = type;
        if( body !== undefined )notification.body = body;
        if( isPinned !== undefined )notification.isPinned = isPinned;
        if( isActive !== undefined )notification.isActive = isActive;
        
        await  notification.save()

        return res.status(200).json({
            message:"Updated scessfully"
        })


    }catch(err){
        console.log("Error in updating notification",err);
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

const deleteNotification = async(req,res)=>{
    try{
        const adminId = req.user._id;
        const notificationId = req.params.notificationId;

        if (!isValidObjectId(notificationId)) {
            return res.status(400).json({
                message: "Invalid notification ID"
            });
        }

        // Find and delete only if notification belongs to this admin
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            createdBy: adminId
        });

        // notification not Found / not owned by admin
        if(!notification){
            return res.status(404).json({
                message: "notification not found or you are not the owner"
            });
        }

        return res.status(200).json({
            message: "notification deleted successfully",
            notificationId: notification._id
        });



    }catch(err){
        console.log("Error in deleting notification",err);
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

module.exports={
    createNotification,
    getNotifications,
    updateNotification,
    deleteNotification
}