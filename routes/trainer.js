var express = require('express');
var router = express.Router();
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);


router.post('/', async (req, res, next) => {
    const { message } = req.body;

    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: 'user', content: message}
        ],
        max_tokens: 150,
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


