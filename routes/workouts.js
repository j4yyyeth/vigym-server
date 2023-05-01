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
    })

    if (!user) {
      res.json({message: 'no user'})
    }

    res.json(user.workouts);
  }
  catch (err) {
    console.log(err)
  }
})

router.get('/all', async (req, res, next) => {
  try {
    const allWorkouts = await Workout.find().populate('exercises');

    if (!allWorkouts) {
      res.json({message: 'error loading workouts'});
    }

    res.json(allWorkouts);
  }
  catch (err) {
    console.log(err);
  }
})

router.post('/create/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { exercises } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({message: 'User not found'});
    }

    const workout = new Workout({user: user._id});
    await workout.save();

    const createdExercises = await Exercise.insertMany(exercises);
    
    createdExercises.forEach((exercise) => {
      workout.exercises.push(exercise._id);
    })

    await workout.save();

    user.workouts.push(workout._id);
    await user.save();

    res.json({workout});
  }
  catch (err) {
    console.log(err);
  }
})

router.delete('/delete/:id', async (req, res, next) => {
  try {
    const { workoutId } = req.params.id;
    const workout = await Workout.findById(workoutId);
  
    if (!workout) {
      res.json({message: 'error getting workout'});
    }
  
    await Promise.all(workout.exercises.map((e) => { return Exercise.findByIdAndDelete(e) }));

    await Workout.findByIdAndDelete(workoutId);
  }
  catch (err) {
    console.log(err);
  }

})

router.put('/edit/:id', async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const updatedWorkout = req.body.workout;

    const workout = await Workout.findByIdAndUpdate(workoutId, updatedWorkout, { new: true });

    if (!workout) {
      return res.json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout updated successfully', workout });
  }
  catch (err) {
    console.log(err)
  }   
});


module.exports = router;