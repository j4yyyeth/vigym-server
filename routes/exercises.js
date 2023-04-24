var express = require('express');
var router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.get("/", async (req, res, next) => {
    const options = {
        method: 'GET',
        url: 'https://exercisedb.p.rapidapi.com/exercises',
        headers: {
          'content-type': 'application/octet-stream',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        res.json(response.data);
      } catch (err) {
        console.log(err)
      }
});

module.exports = router;
