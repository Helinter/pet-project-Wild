const Joi = require('joi');

const userValidationSchema = Joi.object({
  name: Joi.string().min(2).max(30).default('Юзер'),
  email: Joi.string().email(),
  password: Joi.string(),
  bio: Joi.string().max(150),
  age: Joi.number().max(99)
});

module.exports = { userValidationSchema };
