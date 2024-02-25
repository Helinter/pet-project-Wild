const Card = require('../models/Card');
const NotFoundError = require('../middlewares/NotFoundError'); // Подключаем класс ошибки

exports.getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    next(error); // Передаем ошибку централизованному обработчику ошибок
  }
};

exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const newCard = new Card({ name, link, owner: req.user._id });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    next(error); // Передаем ошибку централизованному обработчику ошибок
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (card.owner.toString() !== req.user._id.toString()) {
      next(new Error('Insufficient permissions to delete this card')); // Используем стандартный класс ошибки для отсутствия разрешений
    } else {
      const deletedCard = await Card.findByIdAndDelete(req.params.cardId);
      if (deletedCard) {
        res.json(deletedCard);
      } else {
        next(new NotFoundError('Карточка не найдена'));
      }
    }
  } catch (error) {
    next(error); // Передаем ошибку централизованному обработчику ошибок
  }
};

exports.likeCard = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (updatedCard) {
      res.json(updatedCard);
    } else {
      next(new NotFoundError('Карточка не найдена'));
    }
  } catch (error) {
    next(error); // Передаем ошибку централизованному обработчику ошибок
  }
};

exports.dislikeCard = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (updatedCard) {
      res.json(updatedCard);
    } else {
      next(new NotFoundError('Карточка не найдена'));
    }
  } catch (error) {
    next(error); // Передаем ошибку централизованному обработчику ошибок
  }
};
