var express = require("express");
var router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const isAuthenticated = require('../middleware/isAuthenticated')


router.post("/signup", (req, res, next) => {
  if (!req.body.email  || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Please fill out all fields" });
  }

  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({ message: "User is already taken" });
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPass = bcrypt.hashSync(req.body.password, salt);

        User.create({
          password: hashedPass,
          email: req.body.email,
          username: req.body.username
        })
          .then((createdUser) => {
            const payload = { _id: createdUser._id, email: createdUser.email, username: createdUser.username };

            const token = jwt.sign(payload, process.env.SECRET, {
              algorithm: "HS256",
              expiresIn: "24hr" // session time
            });
            res.json({ token: token, id: createdUser._id });
          })
          .catch((err) => {
            res.status(400).json(err.message);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

router.post("/login", (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Please fill out both fields" });
  }

  User.findOne({ username: req.body.username })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(401).json({ message: "Username or Password is incorrect" });
      }

      const doesMatch = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );

      if (doesMatch) {
        const payload = { _id: foundUser._id, email: foundUser.email, username: foundUser.username };

        const token = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "24hr" // session time
        });
        res.json({ token: token, id: foundUser._id, message: `Welcome ${foundUser.email}` });
      } else {
        return res.status(402).json({ message: "Username or Password is incorrect" });
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.get("/verify", isAuthenticated, (req, res) => {
  User.findOne({_id: req.user._id})
    .populate('workouts')
    .then((foundUser) => {
      const payload = { ...foundUser };
      delete payload._doc.password;
      res.status(200).json(payload._doc);
    })
    .catch((err) => {
      console.log(err);
    })
});


module.exports = router;