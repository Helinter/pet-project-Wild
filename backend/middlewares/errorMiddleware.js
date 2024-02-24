const mongoose = require('mongoose');

const handleErrors = (err, req, res) => {
// Проверка на наличие пользовательского сообщения об ошибке
  const errorMessage = err.message || 'Internal Server Error';

  // Обработка ошибок Mongoose CastError (некорректный ID)
  if (err instanceof mongoose.CastError) {
    return res.status(400).json({ error: 'Invalid ID provided' });
  }

  // Обработка ошибок валидации данных (ValidationError)
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Invalid data provided' });
  }

  // Обработка ошибок некорректного ObjectId в запросе
  if (err instanceof mongoose.Error.CastError && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Invalid ObjectId provided' });
  }

  // Обработка ошибок "Пользователь не найден"
  if (err.message === 'User not found') {
    return res.status(404).json({ error: 'User not found' });
  }

  // Обработка ошибок "Ошибка базы данных"
  if (err.message === 'Internal Server Error') {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Обработка ошибок "Неверный email или пароль"
  if (err.message === 'Invalid email or password') {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  // Обработка ошибки дублирования уникального поля (email)
  if (err.code === 11000 && err.keyPattern.email) {
    return res.status(409).json({ error: 'Email is already in use' });
  }
  // Остальные ошибки считаем ошибкой сервера
  return res.status(500).json({ error: errorMessage });
};

module.exports = handleErrors;
