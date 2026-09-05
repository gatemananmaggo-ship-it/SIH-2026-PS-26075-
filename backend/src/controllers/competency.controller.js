const Competency = require('../models/competency')
const { isValidObjectId } = require("../utils/validation");

const {
    getPagination,
    getPaginationMeta
} = require("../utils/pagination");

const createCompetency = async(req,res)=>{
    try{
        const adminId = req.user._id;

        const {
            name,
            category,
            description
        } = req.body

        if (!name || !category) {
            return res.status(400).json({
                message: "name and category are required"
            });
        }

        const competency = await Competency.create({
            name,
            category,
            description
        });

        return res.status(201).json({
            message:"Competency created successfully",
            competency
        })

        

    }catch(err){
        console.log("Error in creating Competency",err);
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

// const getCompetencies = async(req,res)=>{
//     try{
//         const competencies = await Competency.find().sort({createdAt: -1});

//         if(competencies.length === 0){
//             return res.status(404).json({
//                 message:"No Competency found"
//             });
//         }

//         return res.status(200).json({
//             message:"Competencies fetched successfully",
//             competencies
//         });
//     }catch(err){
//         console.log("Error in fetching Competencies",err);
//         return res.status(500).json({
//             message:"Server Error"
//         })
//     }
// }

const getCompetencies = async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);

        const [competencies, total] = await Promise.all([
            Competency.find()
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit),

            Competency.countDocuments()
        ]);

        if (total === 0) {
            return res.status(404).json({
                message: "No Competency found",
                competencies: [],
                ...getPaginationMeta(page, limit, total)
            });
        }

        return res.status(200).json({
            message: "Competencies fetched successfully",
            competencies,
            ...getPaginationMeta(page, limit, total)
        });

    } catch (err) {
        console.log("Error in fetching Competencies", err);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

const updateCompetency = async(req,res)=>{
    try{
        const adminId = req.user._id;
        const competencyId = req.params.competencyId;
        if (!isValidObjectId(competencyId)) {
            return res.status(400).json({
                message: "Invalid competency ID"
            });
        }

        const {
            name,
            category,
            description
        } = req.body

        const competency = await Competency.findOne({
            _id: competencyId
        })         

        if(!competency){
            return res.status(404).json({
                message:"Competency not found or you are not the owner"
            })
        }

        // Update fields
        if(name!==undefined)competency.name = name;
        if(category !== undefined )competency.category = category;
        if( description !== undefined )competency.description = description;
        
        
        await  competency.save()

        return res.status(200).json({
            message:"Competency updated scessfully",
            competency
        });


    }catch(err){
        console.log("Error in updating Competency",err);
        return res.status(500).json({
            message:"Server Error"
        });
    }
}

const deleteCompetency = async(req,res)=>{
    try{
        const adminId = req.user._id;
        const competencyId = req.params.competencyId;
        if (!isValidObjectId(competencyId)) {
            return res.status(400).json({
                message: "Invalid competency ID"
            });
        }

        // Find and delete only if Competency belongs to this admin
        const competency = await Competency.findOneAndDelete({
            _id: competencyId
        });

        // Competency not Found / not owned by admin
        if(!competency){
            return res.status(404).json({
                message: "Competency not found or you are not the owner"
            });
        }

        return res.status(200).json({
            message: "Competency deleted successfully",
            competencyId: competency._id
        });



    }catch(err){
        console.log("Error in deleting Competency",err);
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

module.exports={
    createCompetency,
    getCompetencies,
    updateCompetency,
    deleteCompetency
}