const { Schema, model } = require('mongoose');

const commentSchema = new Schema (
    {
        content: {
            type: String,
            required: true
        },

        author: { 
            type: Schema.Types.ObjectId, 
            ref: 'User' 
        },

        workoutId: {
            type: Schema.Types.ObjectId,
            ref: 'Workout',
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timeseries: true,
        timestamps: true
    }
)

const Comment = model('Comment', commentSchema);
module.exports = Comment;