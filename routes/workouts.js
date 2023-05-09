var express = require('express');
var router = express.Router();

const workoutController = require('../controllers/workoutsController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/all', workoutController.all_workouts);

router.get('/user/:userId', isAuthenticated, workoutController.user_workouts);

router.post("/create/:userId", isAuthenticated, workoutController.create_workout);

router.delete('/delete/:id', isAuthenticated, workoutController.delete_workout);

router.put('/edit/:workoutId',  isAuthenticated, workoutController.update_workout);

router.get("/schedule/:userId", workoutController.workout_schedule);

router.put("/schedule/:userId", workoutController.update_schedule);

module.exports = router;