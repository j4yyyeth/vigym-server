const { Schema, model } = require('mongoose');

const userSchema = newSchema (
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

        workouts: [{type: Schema.Types.ObjectId, ref: "Workout"}]
    }
)

const User = model("User", userSchema);
module.exports = User;