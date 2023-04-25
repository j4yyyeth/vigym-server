var express = require('express');
var router = express.Router();

const User = require('../models/User');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

router.get('/', (req, res, next) => {
  Workout.find()
//   .sort({createdAt: -1})
  .then((response) => res.json(response))
  .catch((err) => console.log(err));
});

router.post('/create/:userId', async (req, res, next) => {
    try {
        const {userId} = req.params.userId;
        const {exercises} = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const workout = new Workout();
        await workout.save();
    
        const createdExercises = await Exercise.insertMany(exercises);

        createdExercises.forEach((exercise) => {
            workout.exercises.push(exercise._id);
        });

        await workout.save();

        user.workouts.push(workout._id);
        await user.save();

        res.status(201).json({ message: 'Workout created successfully', workout });
    } 
    catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
});

module.exports = router;