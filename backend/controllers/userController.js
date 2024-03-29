const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { userValidationSchema } = require('../middlewares/userValidationSchema');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const saltRounds = 10;

// Получение информации о пользователе
exports.getUserInfo = async (req, res) => {
  try {
    // Получаем пользователя из базы данных
    const user = await User.findById(req.user._id);

    // Проверяем, найден ли пользователь
    if (!user) {
      throw new Error('User not found');
    }

    // Отправляем ответ с полными данными пользователя
    res.status(200).json({ success: true, user });
  } catch (error) {
    // Обрабатываем ошибку
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getUserByUsername = async (username, res, next) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Возвращаем данные пользователя
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error(`Error fetching user by ID: ${error.message}`);
  }
};



// Обновление информации о пользователе
exports.updateUserInfo = async (req, res, next) => {
  const { name, email, age, bio, username } = req.body;

  try {
    // Валидация данных перед обновлением пользователя
    const validatedData = await userValidationSchema.validateAsync({ name, email, age, bio, username });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      validatedData,
      { new: true, runValidators: true },
    );
    if (updatedUser) {
      // Обновление данных пользователя успешно выполнено
      res.status(200).json({ success: true, user: updatedUser });
    } else {
      throw new NotFoundError('User not found');
    }
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          age: user.age,
          avatar: user.avatar,
          username: user.username,
        },
        NODE_ENV === 'production' ? JWT_SECRET : '7e48151e23b2943091c18f0e3e6e0c6c625f514b47d726c773a39df19eac1e0e',
        { expiresIn: '1w' },
      );

      // Удаляем поле password из объекта user
      const userResponse = { ...user.toObject() };
      delete userResponse.password;

      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.status(200).json({ success: true, user: userResponse, token });
    } else {
      next(new UnauthorizedError('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  const {
    name = 'Юзер',
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Удаляем поле password из объекта, возвращаемого в ответе
    const userResponse = { ...newUser.toObject() };
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      throw new NotFoundError('User not found');
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.subscribeToUser = async (req, res, next) => {
  const { userId } = req.params;
  const { currentUserID } = req.body; // Получаем ID текущего пользователя из тела запроса
  try {
    // Проверяем, что пользователь, на которого подписываемся, существует
    const userToSubscribe = await User.findById(userId);
    if (!userToSubscribe) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Добавляем текущего пользователя в подписчики выбранного пользователя
    userToSubscribe.subscribers.push(currentUserID);
    await userToSubscribe.save();

    // Добавляем выбранного пользователя в подписки текущего пользователя
    const currentUser = await User.findById(currentUserID);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }
    currentUser.subscriptions.push(userId);
    await currentUser.save();

    res.status(200).json({ message: 'Successfully subscribed to user' });
  } catch (error) {
    next(error);
  }
};


exports.unsubscribeFromUser = async (req, res, next) => {
  const { userId } = req.params;
  const { currentUserID } = req.body; // Получаем ID текущего пользователя из тела запроса
  try {
    // Проверяем, что пользователь, от которого отписываемся, существует
    const userToUnsubscribe = await User.findById(userId);
    if (!userToUnsubscribe) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Удаляем текущего пользователя из подписчиков выбранного пользователя
    userToUnsubscribe.subscribers = userToUnsubscribe.subscribers.filter(subscriber => subscriber.toString() !== currentUserID);
    await userToUnsubscribe.save();

    // Удаляем выбранного пользователя из подписок текущего пользователя
    const currentUser = await User.findById(currentUserID);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }
    currentUser.subscriptions = currentUser.subscriptions.filter(subscription => subscription.toString() !== userId);
    await currentUser.save();

    res.status(200).json({ message: 'Successfully unsubscribed from user' });
  } catch (error) {
    next(error);
  }
};