const Joi = require('joi');

const avatarValidationSchema = Joi.object({
  avatar: Joi.string()
});

module.exports = { avatarValidationSchema };
