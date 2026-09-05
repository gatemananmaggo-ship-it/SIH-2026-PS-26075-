const Course = require("../models/course");
const Lesson = require("../models/lesson");

const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");

// const getTrainerLibrary = async (req, res) => {
//     try {

//         const trainerId = req.user._id;

//         const search = req.query.search;
//         const category = req.query.category;
//         const level= req.query.level;

//         const filter = {
//             trainerId
//         }

//         if(search){
//             filter.$or = [
//                 {
//                     title: {
//                         $regex: search,
//                         $options: "i"
//                     }
//                 },
//                 {
//                     description: {
//                         $regex: search,
//                         $options: "i"
//                     }
//                 },
//             ];
//         }

//         if(category){
//             filter.category= category;
//         }

//         if(level){
//             filter.level = level;
//         }


//         // Get courses owned by the logged-in trainer
//         const courses = await Course.find(filter).sort({ createdAt: -1 });

//         // Attach lessons to each course
//         const library = await Promise.all(
//             courses.map(async (course) => {

//                 const lessons = await Lesson.find({
//                     courseId: course._id
//                 }).sort({ order: 1 });

//                 return {
//                     course,
//                     lessons
//                 };
//             })
//         );

//         return res.status(200).json({
//             message: "Trainer library fetched successfully",
//             totalCourses: library.length,
//             library
//         });

//     } catch (err) {

//         console.log("Error getting trainer library:", err);

//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// };

const getTrainerLibrary = async (req, res) => {
    try {

        const trainerId = req.user._id;

        const search = req.query.search;
        const category = req.query.category;
        const level = req.query.level;

        // Build course filter
        const filter = {
            trainerId
        };

        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (level) {
            filter.level = level;
        }

        // Pagination
        const { page, limit, skip } = getPagination(req);

        // Fetch only the required page of courses
        // Also count total courses using the SAME filter
        const [courses, totalCourses] = await Promise.all([
            Course.find(filter)
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            Course.countDocuments(filter)
        ]);

        // Attach lessons to each course
        const library = await Promise.all(
            courses.map(async (course) => {

                const lessons = await Lesson.find({
                    courseId: course._id
                }).sort({ order: 1 });

                return {
                    course,
                    lessons
                };
            })
        );

        return res.status(200).json({
            message: "Trainer library fetched successfully",
            totalCourses,
            library,
            ...getPaginationMeta(page, limit, totalCourses)
        });

    } catch (err) {

        console.log("Error getting trainer library:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};



module.exports = {
    getTrainerLibrary
};