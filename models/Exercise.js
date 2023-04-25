const { Schema, model } = require('mongoose');

const exerciseSchema = new Schema (
    {
        exercise: String,
        sets: Number,
        reps: Number,
        weight: Number
    },
    
    {
        timeseries: true,
        timestamps: true,
    }
)

const Exercise = model("Exercise", exerciseSchema);
module.exports = Exercise;