const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors, celebrate } = require('celebrate');
const { userValidationSchema } = require('./middlewares/userValidationSchema');
const handleErrors = require('./middlewares/errorMiddleware');
const { requestLogger, errorLogger } = require('./logger/logger');
const { authMiddleware } = require('./middlewares/auth');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const { PORT = 2999 } = process.env;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/Wild';

app.use(requestLogger);

app.use(helmet());

mongoose.connect(MONGODB_URI, {
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const userController = require('./controllers/userController');
const router = require('./routes/routes');

app.use(router);

// Роут для логина
app.post('/signin', celebrate({ body: userValidationSchema }), userController.login);

// Роут для регистрации
app.post('/signup', celebrate({ body: userValidationSchema }), userController.createUser);

app.use(errors());

app.use(authMiddleware);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});


app.use(errorLogger);
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})