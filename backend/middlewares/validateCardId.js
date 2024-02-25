const Joi = require('joi');
// Middleware для валидации ID карточки
const validateCardId = (req, res, next) => {
  const cardIdSchema = Joi.object({
    cardId: Joi.string().length(24).hex().required(),
  });
  const { error } = cardIdSchema.validate({ cardId: req.params.cardId });
  if (error) {
    // Joi автоматически создаст объект ошибки с нужными свойствами
    return next(error);
  }
  // Если ID прошел валидацию, продолжите выполнение запроса
  return next();
};

module.exports = validateCardId;
