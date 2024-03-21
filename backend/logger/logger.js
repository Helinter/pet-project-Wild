const winston = require('winston');
const expressWinston = require('express-winston');
const fs = require('fs');

// Создание папки для хранения логов, если ее нет
const logsFolder = 'logs';
if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder);
}

// Функция для определения, нужно ли логировать данный запрос
function shouldLog(req) {
  // Если запрос идет на /cards/:cardId/comments или /users/:userId, не логируем его
  return !req.url.match(/\/cards\/[a-zA-Z0-9]+\/comments/) && !req.url.match(/\/users\/[a-zA-Z0-9]+$/);
}

// Логгер для запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: `${logsFolder}/request.log`,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
  meta: false,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  ignoreRoute(req) {
    // Игнорируем логирование для определенных запросов
    return !shouldLog(req);
  },
});

// Логгер для ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: `${logsFolder}/error.log`,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});

module.exports = { requestLogger, errorLogger };
