const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const { userValidationSchema } = require('../middlewares/userValidationSchema');
const { avatarValidationSchema } = require('../middlewares/avatarValidationSchema');
const { authMiddleware } = require('../middlewares/auth');

// Роуты для обработки запросов
router.get('/users/me', authMiddleware, async (req, res, next) => {
  try {
    // Передача управления контроллеру
    userController.getUserInfo(req, res, next);
  } catch (error) {
    // Обработка ошибок валидации запроса
    next(error);
  }
});

router.get('/users/:userId', authMiddleware, async (req, res, next) => {
  try {
    // Извлечение userId из req.params
    const userId = req.params.userId;
    // Передача управления контроллеру
    const userInfo = await userController.getUserById(userId);
    res.json(userInfo);
  } catch (error) {
    // Обработка ошибок
    next(error);
  }
});


router.get('/users/:username', authMiddleware, async (req, res, next) => {
  try {
    // Передача управления контроллеру
    await userController.getUserByUsername(req, res, next);
  } catch (error) {
    // Обработка ошибок
    next(error);
  }
});

router.patch('/users/me', authMiddleware, async (req, res, next) => {
  try {
    // Валидация данных перед передачей контроллеру
    await userValidationSchema.validateAsync(req.body);

    // Передача управления контроллеру
    userController.updateUserInfo(req, res, next);
  } catch (error) {
    // Обработка ошибок валидации запроса
    next(error);
  }
}, authMiddleware);

router.patch('/users/me/avatar', authMiddleware, async (req, res, next) => {
  try {
    await avatarValidationSchema.validateAsync(req.body);
    userController.updateAvatar(req, res, next);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
