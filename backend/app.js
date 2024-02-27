const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Chat = require('./models/Chat');
const helmet = require('helmet');
const { errors, celebrate } = require('celebrate');
const { userValidationSchema } = require('./middlewares/userValidationSchema');
const handleErrors = require('./middlewares/errorMiddleware');
const { requestLogger, errorLogger } = require('./logger/logger');
const { authMiddleware } = require('./middlewares/auth');
const socketio = require('socket.io');
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

const userRouter = require('./routes/user');
app.use(userRouter);

const chatRouter = require('./routes/chats');
app.use(chatRouter); 

const cardRouter = require('./routes/cards');
app.use(cardRouter);

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

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


// Обработка подключения новых клиентов
io.on('connection', (socket) => {
  console.log('New client connected');

// Обработка события отправки сообщения
socket.on('sendMessage', async (message) => {
  try {
    const { senderId, chatId, content } = message;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      console.error('Chat not found');
      return;
    }

    chat.messages.push({ senderId, content });
    await chat.save();

    // Отправляем обновленный чат всем подписчикам чата
    io.emit('newMessage', chat);
  } catch (error) {
    console.error('Error handling sendMessage event:', error);
  }
});


  // Обработка отключения клиента
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});