var express = require('express');
var router = express.Router();

const commentsController = require('../controllers/commentsController');

router.get('/:workoutId', commentsController.comments);

router.post('/:workoutId', commentsController.create_comment);

module.exports = router;