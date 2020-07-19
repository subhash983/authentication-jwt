const Joi = require("joi");

//Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@#$%^&*()]{3,30}$")),
  });
  return schema.validate(data);
};
//Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@#$%^&*()]{3,30}$")),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
};
