var express = require('express');
var router = express.Router();
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const User = require('../models/User');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);


router.post('/', async (req, res, next) => {
    const context = process.env.TRAINER_CONTEXT;
    const { message, userId } = req.body;

    const user = await User.findById(userId).populate({
        path: 'workouts',
        populate: {
            path: 'exercises',
        },
    });

    let workoutData = "";
    user.workouts.forEach(workout => {
        workoutData += `Workout ID: ${workout._id}. Exercises: `;
        workout.exercises.forEach(exercise => {
            workoutData += `Exercise: ${exercise.exercise}, Sets: ${exercise.sets}, Reps: ${exercise.reps}, Weight: ${exercise.weight}. `;
        });
        workoutData += `Cardio: Type: ${workout.cardio.type}, Time: ${workout.cardio.time}. `;
    });

    const modifiedContext = `${context}. This user's workout data: ${workoutData}`;

    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: 'assistant', content: modifiedContext},
            {role: 'user', content: message}
        ],
        max_tokens: 350,
        n: 1,
        stop: null,
        temperature: 0.7
    });

    try {
        res.json({response: response.data.choices[0].message.content});
    }
    catch (err) {
        console.log(err);
    }
});


module.exports = router;