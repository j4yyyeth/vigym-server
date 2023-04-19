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

const Workout = model("Workoout", workoutSchema);
module.exports = Workout;