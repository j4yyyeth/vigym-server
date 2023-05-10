const User = require('../models/User');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const Comment = require('../models/Comment');

const all_workouts = async (req, res, next) => {
    try {
      const allWorkouts = await Workout.find().populate('user').populate('exercises');
  
      if (!allWorkouts) {
        res.json({message: 'Error loading workouts'});
      }
  
      res.json(allWorkouts);
    }
    catch (err) {
      console.log(err);
    }
  };

const user_workouts = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate({
            path: 'workouts',
            populate: {path: 'exercises'}
        })

        if (!user) {
            res.json({message: 'User not found'});
        }

        res.json(user.workouts);
    }
    catch (err) {
        console.log(err);
    }
  };

const create_workout = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { exercises, cardio } = req.body;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.json({ message: "User not found" });
      }
  
      const workout = new Workout({ user: user._id, cardio });
      await workout.save();
  
      const createdExercises = await Exercise.insertMany(exercises);
  
      createdExercises.forEach((exercise) => {
        workout.exercises.push(exercise._id);
      })
  
      await workout.save();
  
      user.workouts.push(workout._id);
      await user.save();
  
      res.json({ workout });

    } 
    catch (err) {
      console.log(err);
    }
};

const delete_workout = async (req, res, next) => {
    try {
      const { id: workoutId } = req.params;
      const workout = await Workout.findById(workoutId);
  
      if (!workout) {
        return res.json({message: 'Error loading workout'});
      }
  
      const user = await User.findOne({ workouts: workoutId });
  
      if (!user) {
        return res.json({ message: "User not found" });
      }
  
      await User.updateOne(
        { _id: user._id },
        { $pull: { workouts: workoutId } }
      )
  
      await Promise.all(workout.exercises.map((e) => { return Exercise.findByIdAndDelete(e) }));
      await Comment.deleteMany({ workoutId: workoutId });
      await Workout.findByIdAndDelete(workoutId);
  
      res.json({ message: "Workout deleted" });

    }
    catch (err) {
      console.log(err);
    }
};

const update_workout = async (req, res, next) => {
    try {
      const { workoutId } = req.params;
      const { workout } = req.body;
      
      if (!workout || !workout.exercises) {
        return res.status(400).json({ message: 'Error loading workouts or exercises' });
      }
  
      const updatedWorkout = await Workout.findById(workoutId).populate('exercises');
  
      if (!updatedWorkout) {
        return res.status(404).json({ message: 'Workout not found' });
      }
  
      const exerciseUpdates = workout.exercises.map(async (e, i) => {
        const exerciseId = updatedWorkout.exercises[i]._id;
        await Exercise.findByIdAndUpdate(exerciseId, e);
      })
  
      if (workout.cardio) {
        updatedWorkout.cardio = workout.cardio;
        await updatedWorkout.save();
      }    
  
      await Promise.all(exerciseUpdates);
      const finalWorkout = await Workout.findById(workoutId).populate('exercises');
  
      res.json({updatedWorkout: finalWorkout});
    }
    catch (err) {
      console.log(err);
    }   
};

const workout_schedule = async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).populate("schedule.workout");

      res.json(user.schedule);

    }
    catch (err) {
      console.log(err);
    }
};

const update_schedule = async (req, res) => {
    try {
      const { userId } = req.params;
      const { schedule } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { schedule },
        { new: true }
      ).populate("schedule.workout");

      res.json(user.schedule);

    }
    catch (err) {
      console.log(err);
    }
};

module.exports = {
    all_workouts,
    user_workouts,
    create_workout,
    delete_workout,
    update_workout,
    workout_schedule,
    update_schedule
};