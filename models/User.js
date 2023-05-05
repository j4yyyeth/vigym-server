const { Schema, model } = require('mongoose');

const userSchema = new Schema (
    {
        email: {
            type: String,
            required: true,
            unique: true
        },

        username: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        workouts: [{type: Schema.Types.ObjectId, ref: "Workout"}],

        schedule: [
            {
              dayIndex: Number,
              workout: {
                type: Schema.Types.ObjectId,
                ref: 'Workout',
              },
            },
          ]
    },

    {
        timeseries: true,
        timestamps: true
    }
)

const User = model("User", userSchema);
module.exports = User;