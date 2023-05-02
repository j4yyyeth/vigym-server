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

router.put('/edit/:workoutId', async (req, res, next) => {
  try {
    const { workoutId } = req.params;
    const { workout } = req.body;
    
    if (!workout || !workout.exercises) {
      return res.status(400).json({ message: 'Error fetching workouts or exercises' });
    }

    const updatedWorkout = await Workout.findById(workoutId).populate('exercises');

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const exerciseUpdates = workout.exercises.map(async (e, i) => {
      const exerciseId = updatedWorkout.exercises[i]._id;
      await Exercise.findByIdAndUpdate(exerciseId, e);
    });

    await Promise.all(exerciseUpdates);
    const finalWorkout = await Workout.findById(workoutId).populate('exercises');

    res.json({updatedWorkout: finalWorkout});
    console.log('FINALWORKOUT:', finalWorkout)
  }
  catch (err) {
    console.log(err)
  }   
});


module.exports = router;