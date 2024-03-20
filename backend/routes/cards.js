const express = require('express');
const {authMiddleware} = require('../middlewares/auth');
const cardController = require('../controllers/cardController');
const validateCardId = require('../middlewares/validateCardId');
const validateCardData = require('../middlewares/validateCardData');

const router = express.Router();

router.get('/cards', authMiddleware, cardController.getAllCards);
router.post('/cards', authMiddleware, validateCardData, cardController.createCard);
router.delete('/cards/:cardId', authMiddleware, validateCardId, cardController.deleteCard);
router.put('/cards/:cardId/likes', authMiddleware, validateCardId, cardController.likeCard);
router.delete('/cards/:cardId/likes', authMiddleware, validateCardId, cardController.dislikeCard);
router.get('/cards/:cardId/comments', authMiddleware, validateCardId, cardController.getCardComments);
router.post('/cards/:cardId/comments', authMiddleware, validateCardId, cardController.addCommentToCard);

module.exports = router;
