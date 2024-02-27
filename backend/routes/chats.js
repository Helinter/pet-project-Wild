const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/auth');
const chatController = require('../controllers/chatController');


router.get('/chats', authMiddleware, chatController.getUserChats);
router.post('/chats', authMiddleware, chatController.createChat);
router.post('/chats/messages', chatController.createMessage);

module.exports = router;
