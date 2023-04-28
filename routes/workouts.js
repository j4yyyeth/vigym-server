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
        return res.json({ message: 'User not found' });
      }
  
      res.json(user.workouts);
    } 
    catch (err) {
      console.log(err);
    }
  });

  router.get('/all', async (req, res, next) => {
    try {
      const allWorkouts = await Workout.find().populate('exercises');

      if (!allWorkouts) {
        return;
      }
      res.json(allWorkouts);
    }
    catch (err) {
      console.log(err);
    }
  })

router.post('/create/:userId', async (req, res, next) => {
    try {
        const {userId} = req.params;
        const {exercises} = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ message: 'User not found' });
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

        res.json({ message: 'Workout created successfully', workout });
    } 
    catch (err) {
      console.log(err);
    }
});

router.delete('/delete/:id', async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return res.json({ message: 'Workout not found' });
    }

    await Workout.findByIdAndDelete(workoutId);

    res.json({ message: 'Workout deleted' });

  } 
  catch (err) {
    console.log(err);
  }
});

router.put('/update/:id', async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const workout = await Workout.findByIdAndUpdate(workoutId, req.body, {new: true});

    if (!workout) {
      return res.json({ message: 'Workout not found' });
    }

    await Workout.findByIdAndUpdate(workoutId);
  }
  catch (err) {
    console.log(err)
  }   
});

module.exports = router;