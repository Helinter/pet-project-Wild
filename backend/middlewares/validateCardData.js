const joiCardSchema = require('./JoiCard');

// Middleware для валидации данных карточек
const validateCardData = (req, res, next) => {
  const { error } = joiCardSchema.validate(req.body);
  if (error) {
    // Joi автоматически создаст объект ошибки с нужными свойствами
    return next(error);
  }
  // Если данные прошли валидацию, продолжите выполнение запроса
  return next();
};

module.exports = validateCardData;
