var express = require('express');
var router = express.Router();

const workoutController = require('../controllers/workoutsController');

router.get('/all', workoutController.all_workouts);

router.get('/user/:userId', workoutController.user_workouts);

router.post("/create/:userId", workoutController.create_workout);

router.delete('/delete/:id', workoutController.delete_workout);

router.put('/edit/:workoutId', workoutController.update_workout);

router.get("/schedule/:userId", workoutController.workout_schedule);

router.put("/schedule/:userId", workoutController.update_schedule);

module.exports = router;