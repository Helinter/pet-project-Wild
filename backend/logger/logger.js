const winston = require('winston');
const expressWinston = require('express-winston');
const fs = require('fs');

// Создайте папку для хранения логов, если ее нет
const logsFolder = 'logs';
if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder);
}

// Создайте логгер для запросов
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
  ignoreRoute() {
    return false;
  },
});

// Создайте логгер для ошибок
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
