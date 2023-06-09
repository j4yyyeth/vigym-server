var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

var commentsRouter = require('./routes/comments');
var authRouter = require('./routes/auth');
var exercisesRouter = require('./routes/exercises');
var workoutsRouter = require('./routes/workouts');
var trainerRouter = require('./routes/trainer');

const { error } = require('console');

var app = express();

app.set('trust proxy', 1);
app.enable('trust proxy');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    cors({
      origin: [process.env.FRONTEND_URI]  
    })
  );

app.use('/comments', commentsRouter);
app.use('/auth', authRouter);
app.use('/exercises', exercisesRouter);
app.use('/workouts', workoutsRouter);
app.use('/trainer', trainerRouter);

app.use(function (req, res, next) {
    next(createError(404));
  });

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

module.exports = app;