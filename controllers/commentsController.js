const Workout = require('../models/Workout');
const Comment = require('../models/Comment');

const comments = async (req, res, next) => {
    const { workoutId } = req.params;
  
    try {
      const workout = await Workout.findById(workoutId);
  
      if (!workout) {
        return res.json({ message: 'Workout not found' });
      }
  
      const comments = await Comment.find({ workoutId: workout._id }).populate('author', 'username');
  
      res.json(comments);
    } 
    catch (err) {
      next(err);
    }
};

const create_comment = async (req, res) => {
    const { content, author } = req.body;
    const { workoutId } = req.params;
  
    try {
      const newComment = new Comment({
        content,
        author,
        workoutId
      })
  
      const savedComment = await newComment.save();
      res.json(savedComment);
    } 
    catch (err) {
      console.log(err);
    }
};

module.exports = {
    comments,
    create_comment
}