const Notification = require('../models/notification');

const getHomePage = async (req,res)=>{
    try{
        const notifications = await Notification.find({
            isActive: true
        }).sort({
            isPinned: -1,
            createdAt: -1
        });

        return res.status(200).json({
            message:"notifications fetched successfully",
            notifications
        })

    }catch(err){
        console.log("Error in fetching homepage",err);
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

module.exports = {
    getHomePage
};