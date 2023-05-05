const { Schema, model } = require('mongoose');

const workoutSchema = new Schema (
    {
        exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }],
        cardio: {
            type: {
              type: String
            },
            time: Number
          },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
    },
    
    {
        timeseries: true,
        timestamps: true
    }
)

const Workout = model("Workout", workoutSchema);
module.exports = Workout;
