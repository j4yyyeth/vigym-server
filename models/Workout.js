const { Schema, model } = require('mongoose');

const workoutSchema = new Schema (
    {
        exercises: [{type: Schema.Types.ObjectId, ref: "Exercise"}],
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    
    {
        timeseries: true,
        timestamps: true,
    }
)

const Workout = model("Workout", workoutSchema);
module.exports = Workout;
