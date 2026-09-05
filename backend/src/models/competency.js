const mongoose = require("mongoose");

const competencySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        category: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        }
    },
    {
        timestamps: true
    }
);

const Competency = mongoose.model(
    "Competency",
    competencySchema
);

module.exports = Competency;