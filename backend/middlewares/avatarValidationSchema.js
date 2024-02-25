const Joi = require('joi');

const avatarValidationSchema = Joi.object({
  avatar: Joi.string().uri(),
});

module.exports = { avatarValidationSchema };
