const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { userValidationSchema } = require('../middlewares/userValidationSchema');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const saltRounds = 10;

// Получение информации о пользователе
exports.getUserInfo = (req, res) => {
  const {
    _id, name, email, bio, age
  } = req.user;

  // Выводим в консоль данные перед отправкой ответа клиенту
  console.log('Данные пользователя:', { _id, name, email, bio, age });

  res.status(200).json({
    _id, name, email, bio, age
  });
};


// Обновление информации о пользователе
exports.updateUserInfo = async (req, res, next) => {
  const { name, email, age, bio } = req.body;

  try {
    // Валидация данных перед обновлением пользователя
    const validatedData = await userValidationSchema.validateAsync({ name, email, age, bio });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      validatedData,
      { new: true, runValidators: true },
    );
    if (updatedUser) {
      // После успешного обновления данных пользователя повторно аутентифицируйте его
      const token = jwt.sign(
        {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          bio: updatedUser.bio,
          age: updatedUser.age,
        },
        NODE_ENV === 'production' ? JWT_SECRET : 'your-dev-secret',
        { expiresIn: '1w' },
      );

      // Обновление токена в куки
      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      // Отправляем обновленные данные пользователя
      res.status(200).json({ success: true, user: updatedUser, token });
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
