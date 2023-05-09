var express = require('express');
var router = express.Router();

const commentsController = require('../controllers/commentsController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/:workoutId', isAuthenticated, commentsController.comments);

router.post('/:workoutId', isAuthenticated, commentsController.create_comment);

module.exports = router;