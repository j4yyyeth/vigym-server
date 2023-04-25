const { Schema, model } = require('mongoose');

const workoutSchema = new Schema (
    {
        exercises: [{type: Schema.Types.ObjectId, ref: "Exercise"}]
    },
    
    {
        timeseries: true,
        timestamps: true,
    }
)

const Workout = model("Workout", workoutSchema);
module.exports = Workout;