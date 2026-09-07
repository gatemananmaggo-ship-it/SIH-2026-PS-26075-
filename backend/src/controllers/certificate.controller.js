const crypto = require("crypto");

const Certificate = require("../models/certificate");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");
const Quiz = require("../models/quiz");
const QuizResult = require("../models/quizResult");

const { isValidObjectId } = require("../utils/validation");

const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");

// ==============================
// TRAINEE CONTROLLERS
// ==============================
// Checking eligibility
const checkCertificateEligibility = async (req,res)=>{
    try{
        
        const traineeId = req.user._id;
        
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Check course exist
        const course = await Course.findOne({
            _id: courseId
        });

        if(!course){
            return res.status(404).json({
                message: "course not found"
            });
        }

        // Check enrollment
        const enrollment = await Enrollment.findOne({
            traineeId,
            courseId,
            status: { $in: ["active", "completed"] }
        });

        if(!enrollment){
            return res.status(404).json({
                message: "enrollment not found"
            });
        }
        // Check course progress
        if(enrollment.progress < 100){
            return res.status(200).json({
                eligible: false,
                message: "Course not completed",
                progress: enrollment.progress
            });
        }

        // Get all published quizzes
        const quizzes = await Quiz.find({
            courseId,
            isPublished:true
        });

        // Check every quiz
        for(const quiz of quizzes){
            const passedResult = await QuizResult.findOne({
                traineeId,
                courseId,
                quizId: quiz._id,
                passed: true
            })

            if(!passedResult){
                return res.status(200).json({
                    eligible : false,
                    message: `Quiz "${quiz.title}" has not been passed`
                })
            }
        }

        // Everything completed
        return res.status(200).json({
            eligible: true,
            message: "Trainee is eligible for certificate",
            courseId,
            traineeId
        })


    } catch(err){
        console.log(
            "Error checking certificate eligibility:",
            err
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
}

// Generate Certificate
const generateCertificate = async (req,res)=>{
    try{
        const traineeId = req.user._id;
        
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Check course exist
        const course = await Course.findOne({
            _id: courseId
        });

        if(!course){
            return res.status(404).json({
                message: "course not found"
            });
        }

        // Check enrollment
        const enrollment = await Enrollment.findOne({
            traineeId,
            courseId,
            status: { $in: ["active", "completed"] }
        });

        if(!enrollment){
            return res.status(404).json({
                message: "enrollment not found"
            });
        }
        // Check course progress
        if(enrollment.progress < 100){
            return res.status(400).json({
                message: "Course has not been completed"
            });
        }

        // Get published quizzes
        const quizzes = await Quiz.find({
            courseId,
            isPublished:true
        })

        // Check every quiz has a passing result
        for(const quiz of quizzes){
            const passedResults=  await QuizResult.findOne({
                traineeId,
                courseId,
                quizId : quiz._id,
                passed:true
            });

            if (!passedResults) {
                return res.status(400).json({
                    message: `Quiz "${quiz.title}" has not been passed`
                });
            }
        }

        // Check wheather certificate already exists
        const existingCertificate = await Certificate.findOne({
            traineeId,
            courseId
        });

        if (existingCertificate) {
            return res.status(409).json({
                message: "Certificate already generated",
                certificate: existingCertificate
            });
        }

        // Generate unique certificate number
        const certificateNumber =
            `CERT-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

        // Create Certificate 
        const certificate = await Certificate.create({
            traineeId,
            courseId,
            certificateNumber
        });

        return res.status(201).json({
            message: "Certificate generated successfully",
            certificate
        });

    }catch(err){
        console.log("Error generating certificate:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
}

// Get single course certificate
const getCertificate = async (req,res)=>{
    try{
        const traineeId = req.user._id;
        
        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Find certificate belonging to this trainee and course
        const certificate = await Certificate.findOne({
            traineeId,
            courseId
        }).populate("traineeId","name email").populate("courseId", "title");

        if(!certificate){
            return res.status(404).json({
                message: "Certificate not found"
            });
        }

        return res.status(200).json({
            message: "Certificate fetched successfully",
            certificate
        });

    }catch(err){
       console.log("Error getting certificate:", err);

        return res.status(500).json({
            message: "Server error"
        }); 
    }
}

// Get all certificates belonging to logged-in trainee
const getMyCertificates = async (req, res) => {
    try {
        const traineeId = req.user._id;

        const certificates = await Certificate.find({
            traineeId
        })
        .populate("courseId", "title category level duration thumbnail")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Certificates fetched successfully",
            totalCertificates: certificates.length,
            certificates
        });
    } catch (err) {
        console.log("Error getting trainee certificates:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const verifyCertificate = async (req, res) => {
    try {

        const { certificateNumber } = req.params;

        const certificate = await Certificate.findOne({
            certificateNumber
        })
        .populate("traineeId", "name")
        .populate("courseId", "title");

        if (!certificate) {
            return res.status(404).json({
                valid: false,
                message: "Invalid certificate"
            });
        }

        return res.status(200).json({
            valid: true,
            message: "Certificate is valid",
            certificate: {
                certificateNumber: certificate.certificateNumber,
                traineeName: certificate.traineeId.name,
                courseTitle: certificate.courseId.title,
                issuedAt: certificate.issuedAt
            }
        });

    } catch (err) {

        console.log("Error verifying certificate:", err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// ==============================
// ADMIN CONTROLLERS
// ==============================

// Get all certificates
// const getAllCertificates = async(req,res)=>{
//     try{
//         const certificates = await Certificate.find().populate("traineeId", "name email").populate("courseId", "title trainerId").sort({ createdAt: -1 });

//         return res.status(200).json({
//             message: "Certificates fetched successfully",
//             totalCertificates: certificates.length,
//             certificates
//         })


//     }catch(err){
//         console.log("Error in fetching all certificates",err);
//         return res.status(500).json({
//             message:"Server Error"
//         })
//     }
// }

const getAllCertificates = async(req,res)=>{
    try{

        const { page, limit, skip } = getPagination(req);

        const [certificates, total] = await Promise.all([
            Certificate.find()
                .populate("traineeId", "name email")
                .populate("courseId", "title trainerId")
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            Certificate.countDocuments()
        ]);

        return res.status(200).json({
            message: "Certificates fetched successfully",
            totalCertificates: total,
            certificates,
            ...getPaginationMeta(page, limit, total)
        });

    } catch(err){

        console.log("Error in fetching all certificates",err);

        return res.status(500).json({
            message:"Server Error"
        });
    }
};

// ==============================
// TRAINER CONTROLLERS
// ==============================

// Get Particular certificates
const getCourseCertificates = async(req,res)=>{
    try{
        const trainerId = req.user._id;

        const courseId = req.params.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Verify course ownership
        const course = await Course.findOne({
            _id:courseId,
            trainerId
        })

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you are not the owner"
            });
        }

        // Getting certificate
        const certificates = await Certificate.find({
            courseId
        }).populate("traineeId", "name email").populate("courseId", "title trainerId").sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Certificates fetched successfully",
            course:{
                id:course._id,
                title: course.title
            },
            totalCertificates: certificates.length,
            certificates
        })
    }catch(err){
        console.log("Error in fetching all certificates",err);
        return res.status(500).json({
            message:"Server Error"
        })
    }
};


module.exports = {
    checkCertificateEligibility,
    generateCertificate,
    getCertificate,
    getMyCertificates,
    verifyCertificate,
    getAllCertificates,
    getCourseCertificates
};