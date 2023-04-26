var express = require('express');
var router = express.Router();

const User = require('../models/User');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

router.get('/user/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate({
        path: 'workouts',
        populate: { path: 'exercises' }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user.workouts);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  });

  router.get('/all', async (req, res, next) => {
    try {
      const allWorkouts = await Workout.find().populate('exercises');

      if (!allWorkouts) {
        return;
      }

      res.status(200).json(allWorkouts);
    }
    catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  })

router.post('/create/:userId', async (req, res, next) => {
    console.log('Request params:', req.params);
    try {
        const {userId} = req.params;
        const {exercises} = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const workout = new Workout({ user: user._id });
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