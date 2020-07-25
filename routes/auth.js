const router = require("express").Router();
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const { signToken, removeToken } = require("../helpers/jwt-helper");
const createError = require("http-errors");

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
  try {
    const token = await signToken(user._id.toString());
    res.header("auth-token", token).send(token);
  } catch (error) {
    const httpError = createError.InternalServerError(error.message);
    res.status(httpError.status).send(httpError);
  }
});

router.post("/logout", async (req, res) => {
  const authToken = req.header("auth-token");

  try {
    await removeToken(authToken);
    res.send("Logged Out Successfully");
  } catch (error) {
    const httpError = createError.InternalServerError(error.message);
    res.status(httpError.status).send(httpError);
  }
});

module.exports = router;
