const Chat = require('../models/Chat');
const User = require('../models/User');


exports.getUserChats = async (req, res, next) => {
  try {
    // Получаем ID текущего пользователя из объекта req.user
    const userId = req.user._id;

    // Находим все чаты, в которых пользователь участвует
    const chats = await Chat.find({ $or: [{ user1Id: userId }, { user2Id: userId }] });

    // Для каждого чата получаем информацию о другом пользователе
    const chatsWithUserInfo = await Promise.all(chats.map(async (chat) => {
      const otherUserId = chat.user1Id.toString() === userId.toString() ? chat.user2Id : chat.user1Id;
      const otherUser = await User.findById(otherUserId);
      return {
        chat,
        otherUser: {
          _id: otherUser._id,
          name: otherUser.name,
          avatar: otherUser.avatar
        }
      };
    }));

    res.json(chatsWithUserInfo);
  } catch (error) {
    next(error);
  }
};




exports.createChat = async (req, res, next) => {
  try {
    const { user1Id, user2Id } = req.body;

    // Проверяем, существует ли уже чат между пользователями user1Id и user2Id
    const existingChat = await Chat.findOne({
      $or: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id }
      ]
    });

    if (existingChat) {
      // Если чат уже существует, отправляем его в ответе
      return res.status(200).json(existingChat);
    }

    // Если чат не существует, создаем новый чат
    const chat = await Chat.create({ user1Id, user2Id, messages: [] });
    res.status(201).json(chat);
  } catch (error) {
    next(error);
  }
};


exports.createMessage = async (req, res, next) => {
  try {
    const { senderId, chatId, content } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.messages.push({ senderId, content });
    await chat.save();

    res.status(201).json({ message: 'Message created successfully', chat });
  } catch (error) {
    next(error);
  }
};