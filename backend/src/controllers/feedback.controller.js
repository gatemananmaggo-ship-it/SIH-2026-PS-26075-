const Feedback = require("../models/feedback")
const Course = require("../models/course")
const Enrollment = require("../models/enrollment")
const { isValidObjectId } = require("../utils/validation");

const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");

// ==============================
// TRAINEE CONTROLLLER
// ==============================

const submitFeedback = async (req,res)=>{
    try{
        const traineeId = req.user._id;
        const {courseId} = req.params;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        const { rating, comment } = req.body

        // Validating rating
        if(rating ===undefined || rating <1 || rating >5){
            return res.status(400).json({
                message:"Rating must be b/w 1 to 5"
            })
        }

        // console.log(courseId)
        // console.log(typeof courseId)

        const course = await Course.findOne({
            _id:courseId
        });

        if(!course){
            return res.status(404).json({
                message:"Course Not Found"
            })
        }

        const enrollment = await Enrollment.findOne({
            traineeId,
            courseId,
            status:"active"
        })

        if(!enrollment){
            return res.status(404).json({
                message:"You r not enrolled in course"
            })
        }

        // Prevent duplicate feedback
        const existingFeedback = await Feedback.findOne({
            traineeId,
            courseId
        });

        if (existingFeedback) {
            return res.status(400).json({
                message: "You have already submitted feedback for this course"
            });
        }

        const feedback = await Feedback.create({
            traineeId,
            courseId,
            rating,
            comment
        });

        return res.status(201).json({
            message: "Feedback submitted successfully",
            feedback
        });
    }catch(err){
        console.log("Error in submitting feedback",err);
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

// ==============================
// TRAINER CONTROLLLER
// ==============================

const getCourseFeedback = async (req,res)=>{
    try{
        const trainerId = req.user._id;
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course = await Course.findOne({
            _id:courseId,
            trainerId
        });

        if(!course){
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        const feedback = await Feedback.find({
            courseId
        }).populate("traineeId","name email").sort({createdAt: -1});

        return res.status(200).json({
            message: "Course feedback fetched successfully",
            courseId,
            totalFeedback: feedback.length,
            feedback
        });

    }catch(err){
        console.log("Error in fetching feedback",err);
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

// ==============================
// ADMIN CONTROLLLER
// ==============================

// const getAllFeedback = async (req, res) => {
//     try {
//         const { courseId, trainerId } = req.query;

//         if (courseId && !isValidObjectId(courseId)) {
//             return res.status(400).json({
//                 message: "Invalid course ID"
//             });
//         }

//         if (trainerId && !isValidObjectId(trainerId)) {
//             return res.status(400).json({
//                 message: "Invalid trainer ID"
//             });
//         }
        
//         // Build feedback filter
//         const feedbackFilter = {};

//         const { page, limit, skip } = getPagination(req);

//         const [feedback, total] = await Promise.all([
//             Feedback.find(feedbackFilter)
//                 .populate("traineeId", "name email")
//                 .populate("courseId", "title trainerId")
//                 .sort({ createdAt: -1, _id: -1 })
//                 .skip(skip)
//                 .limit(limit),

//             Feedback.countDocuments(feedbackFilter)
//         ]);

//         if (courseId) {
//             feedbackFilter.courseId = courseId;
//         }

//         // If trainerId is provided, first find their courses
//         if (trainerId) {
//             const trainerCourses = await Course.find({
//                 trainerId
//             }).select("_id");

//             const courseIds = trainerCourses.map(course => course._id);

//             feedbackFilter.courseId = {
//                 $in: courseIds
//             };

//             // If both courseId and trainerId are supplied,
//             // make sure the course belongs to that trainer.
//             if (courseId) {
//                 const ownsCourse = courseIds.some(
//                     id => id.toString() === courseId
//                 );

//                 if (!ownsCourse) {
//                     return res.status(200).json({
//                         message: "Feedback fetched successfully",
//                         totalFeedback: 0,
//                         feedback: []
//                     });
//                 }

//                 feedbackFilter.courseId = courseId;
//             }
//         }

//         const feedback = await Feedback.find(feedbackFilter)
//             .populate("traineeId", "name email")
//             .populate("courseId", "title trainerId")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             message: "Feedback fetched successfully",
//             totalFeedback: feedback.length,
//             feedback
//         });

//     } catch (err) {
//         console.log("Error getting all feedback:", err);

//         return res.status(500).json({
//             message: "Server Error"
//         });
//     }
// };


const getAllFeedback = async (req, res) => {
    try {
        const { courseId, trainerId } = req.query;

        // Validate query parameters
        if (courseId && !isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        if (trainerId && !isValidObjectId(trainerId)) {
            return res.status(400).json({
                message: "Invalid trainer ID"
            });
        }

        // Build feedback filter FIRST
        const feedbackFilter = {};

        if (courseId) {
            feedbackFilter.courseId = courseId;
        }

        // If trainerId is provided, find trainer's courses
        if (trainerId) {
            const trainerCourses = await Course.find({
                trainerId
            }).select("_id");

            const courseIds = trainerCourses.map(course => course._id);

            // If both courseId and trainerId are supplied,
            // make sure the course belongs to that trainer.
            if (courseId) {
                const ownsCourse = courseIds.some(
                    id => id.toString() === courseId
                );

                if (!ownsCourse) {
                    const { page, limit } = getPagination(req);

                    return res.status(200).json({
                        message: "Feedback fetched successfully",
                        totalFeedback: 0,
                        feedback: [],
                        page,
                        limit,
                        total: 0,
                        totalPages: 0
                    });
                }

                feedbackFilter.courseId = courseId;
            } else {
                feedbackFilter.courseId = {
                    $in: courseIds
                };
            }
        }

        // Pagination
        const { page, limit, skip } = getPagination(req);

        // Fetch only the required page + total count
        const [feedback, total] = await Promise.all([
            Feedback.find(feedbackFilter)
                .populate("traineeId", "name email")
                .populate("courseId", "title trainerId")
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            Feedback.countDocuments(feedbackFilter)
        ]);

        return res.status(200).json({
            message: "Feedback fetched successfully",
            totalFeedback: total,
            feedback,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        });

    } catch (err) {
        console.log("Error getting all feedback:", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};



module.exports={
    submitFeedback,
    getCourseFeedback,
    getAllFeedback
}