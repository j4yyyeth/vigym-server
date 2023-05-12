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
    const { message, userId, conversationHistory } = req.body;

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

    const prompt = `${modifiedContext}\n${conversationHistory}\nUser: ${message}\nAssistant:`;


    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
        top_p: 1
    });

    try {
        res.json({response: response.data.choices[0].text});
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;
