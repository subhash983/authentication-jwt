const router = require("express").Router();
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

router.post("/register", async (req, res) => {
  //validating data
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //Checking if user exists
  const emailExists = await User.findOne({
    email: req.body.email,
  });
  if (emailExists) {
    return res.status(400).send("Email ID is already taken");
  }

  //Hash password
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create New User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //Validation
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //Checking if user exists
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.status(400).send("Email ID or password invalid");
  }

  //checking if password matching
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Email ID or password invalid");
  }

  //Create jwt token
  const token = jwt.sign({ _id: user._id }, config.JWT_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
