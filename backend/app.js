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

// Директория, где хранятся ваши изображения
const pathToUploads = './uploads';

// Настройка маршрута для обслуживания статических файлов из директории с изображениями
app.use('/uploads', express.static(pathToUploads, {
  setHeaders: (res, path, stat) => {
    // Установка заголовка Cross-Origin-Resource-Policy на cross-origin
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));


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
  cors: true // Разрешить доступ со всех источников
});

// Обработка подключения новых клиентов
io.on('connection', (socket) => {
  console.log('New client connected');

// Обработка события отправки сообщения
socket.on('newMessage', async (message) => {
  try {
    // Создание сообщения в базе данных
  console.log('получено сообщение');
  const createdMessage = await createMessage(message);
  
  // Отправка сообщения всем клиентам через сокеты
  console.log('отправка сообщения пользователю', createdMessage);
  io.emit('newMessage', createdMessage);
} catch (error) {
  console.error('Error handling newMessage event:', error);
}
});

// Функция для создания сообщения в базе данных
const createMessage = async (messageData) => {
  try {
    const { senderId, chatId, content } = messageData;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    // Создаем объект content, который содержит текст и, если есть, ссылку на изображение
    const messageContent = { text: content.text, image: null };

    // Если есть ссылка на изображение, добавляем ее в content
    if (content.image) {
      messageContent.image = content.image;
    }

    chat.messages.push({ senderId, content: messageContent });
    await chat.save();

    return { message: 'Message created successfully', chat };
  } catch (error) {
    throw error;
  }
};


  // Обработка отключения клиента
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});



