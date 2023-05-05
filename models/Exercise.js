const { Schema, model } = require('mongoose');

const exerciseSchema = new Schema (
    {
        exercise: {
            type: String,
            required: true
        },
        sets: {
            type: Number,
            required: true
        },
        reps: {
            type: Number,
            required: true
        },
        weight: Number,
        cardio: {
            type: Boolean,
            default: false
        },
        cardioType: String,
        cardioTime: Number,
    },
    
    {
        timeseries: true,
        timestamps: true,
    }
)

const Exercise = model("Exercise", exerciseSchema);
module.exports = Exercise;