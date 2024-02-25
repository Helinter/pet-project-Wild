const Joi = require('joi');

const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i; // Регулярное выражение для валидации URL

const joiCardSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  link: Joi.string().pattern(urlRegex).required(),
  owner: Joi.string(),
  likes: Joi.array().items(Joi.string()).default([]),
});

module.exports = joiCardSchema;
