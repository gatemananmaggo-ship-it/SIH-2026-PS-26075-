const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const { isValidObjectId } = require("../utils/validation");
const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");

// ==============================
// TRAINEE CONTROLLERS
// ==============================

// Enroll in course
const enrollCourse = async (req,res)=>{
    try{
        // Get logged-in trainee Id and Course id from url
        const traineeId = req.user._id;
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Check if exist and published
        const course = await Course.findOne({
            _id: courseId,
            status:"published"
        });

        if(!course){
            return res.status(404).json({
                message: "Published course not found"
            });
        }

        // Check if trainee already enrolled
        const existingEnrollment = await Enrollment.findOne({
            traineeId,
            courseId
        });

        if (existingEnrollment) {
            return res.status(409).json({
                message: "You are already enrolled in this course"
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            traineeId,
            courseId
        });

        return res.status(201).json({
            message: "Course enrollment successful",
            enrollment
        });

    }catch(err){
        console.log("Error in enrolling",err);

        return res.status(500).json({
            message:"Server Error"
        })
    }
};

// View Enrollments
// const getMyEnrollments = async(req,res)=>{
//     try{
//         // Get trainee's id 
//         const traineeId = req.user._id;

//         // Find enrollments bellonging to this trainee
//         const enrollments = await Enrollment.find({
//             traineeId
//         }).populate(
//             "courseId",
//             "title description category level duration thumbnail status"
//         );

//         return res.status(200).json({
//             message: "Enrollments fetched successfully",
//             enrollments
//         });
//     }catch (err) {

//         console.log("Error in getting enrollments:", err);

//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// }
const getMyEnrollments = async (req, res) => {
    try {
        // Get trainee's id
        const traineeId = req.user._id;

        // Pagination
        const { page, limit, skip } = getPagination(req);

        // Find enrollments belonging to this trainee
        const filter = {
            traineeId
        };

        const [enrollments, total] = await Promise.all([
            Enrollment.find(filter)
                .populate(
                    "courseId",
                    "title description category level duration thumbnail status"
                )
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            Enrollment.countDocuments(filter)
        ]);

        return res.status(200).json({
            message: "Enrollments fetched successfully",
            enrollments,
            ...getPaginationMeta(page, limit, total)
        });

    } catch (err) {

        console.log("Error in getting enrollments:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ==============================
// TRAINER CONTROLLERS
// ==============================

// Getting the stats of prticular course
const getCourseEnrollmentStats = async (req,res) => {
    try{
        const trainerId = req.user._id;
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // // Make sure the course belongs to this trainer
        const course = await Course.findOne({
            _id: courseId,
            trainerId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        // Count enrollments
        const totalEnrollments = await Enrollment.countDocuments({
            courseId
        });

        // Count active trainees
        const activeEnrollments = await Enrollment.countDocuments({
            courseId,
            status: "active"
        });

        // Count completed trainees
        const completedEnrollments = await Enrollment.countDocuments({
            courseId,
            status: "completed"
        });

        return res.status(200).json({
            message: "Course enrollment statistics fetched successfully",
            statistics: {
                courseId,
                courseTitle: course.title,
                totalEnrollments,
                activeEnrollments,
                completedEnrollments
            }
        });

    }catch (err) {

        console.log("Error in getting enrollment statistics:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
}


module.exports={
    enrollCourse,
    getMyEnrollments,
    getCourseEnrollmentStats
};