const Joi = require('joi');

const userValidationSchema = Joi.object({
  name: Joi.string().min(2).max(30).default('Юзер'),
  email: Joi.string().email(),
  password: Joi.string(),
});

module.exports = { userValidationSchema };
