const { Schema, model } = require('mongoose');

const commentSchema = new Schema (
    {
        content: {
            type: String,
            required: true
        },
        author: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timeseries: true,
        timestamps: true,
    }
)

const Comment = model('Comment', commentSchema);
module.exports = Comment;