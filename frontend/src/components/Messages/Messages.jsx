import AddMedia from '../../images/icons/addMedia.svg';
import Micro from '../../images/icons/micro.svg';
import Send from '../../images/icons8-бумажный-самолетик-64 (1).png';
import { api } from '../../utils/MainApi';
import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../../context/CurrentUserContext';
import io from 'socket.io-client';

const socket = io('http://localhost:2999');
function Messages() {
  const { currentUser, updateCurrentUser } = useCurrentUser();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const fetchedChats = await api.getUserChats();
        setChats(fetchedChats);
      } catch (error) {
        console.error('Error fetching user chats:', error);
      }
    };

    fetchChats();
  }, []);

 useEffect(() => {
  // Подписка на событие нового сообщения от сервера сокетов
  socket.on('newMessage', (updatedChat) => {

    
    console.log('Received new message:', updatedChat);
    
    // Обновляем состояние чата с новым сообщением
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.chat._id === updatedChat.chat._id) {
          return { ...chat, chat: updatedChat.chat };
        }
        return chat;
      });
    });
  });

  // Отписка от событий при размонтировании компонента
  return () => {
    socket.off('newMessage');
  };
}, []);

  

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleMessageSend = async () => {
    if (!selectedChat || !messageInput.trim()) return;

    try {
      await api.sendMessage(currentUser._id, selectedChat.chat._id, messageInput.trim());
      setMessageInput(''); // Очищаем поле ввода после отправки
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <section className="messages">
      <div className="messages-list">
        <h2 className="messages-list__name">Чаты</h2>
        <div className="messages-list__list">
          {chats.map((chat) => (
            <div
              key={chat.chat._id}
              className={`messages-list__list-item ${selectedChat === chat ? 'messages-list__list-item_selected' : ''}`}
              onClick={() => handleChatSelect(chat)}
            >
              <img className="messages-list__list-item__photo" src={chat.otherUser.avatar} alt="photo" />
              <p className="messages-list__list-item__name">{chat.otherUser.name}</p>
              <div className="messages-list__list-item__indicator"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="messages-chat">
        <div className="messages-chat-header">
          {selectedChat && (
            <>
              <img className="messages-chat-header__photo" src={selectedChat.otherUser.avatar} alt="photo" />
              <p className="messages-chat-header__name">{selectedChat.otherUser.name}</p>
              <div className="messages-chat-header__indicator"></div>
            </>
          )}
        </div>
        <div className="messages-chat-chat">
          {selectedChat && selectedChat.chat.messages.map((message, index) => (
            <p
              key={index}
              className={`messages-chat-chat-message ${message.senderId === currentUser._id ? 'messages-chat-chat-message-owners' : ''}`}
            >
              {message.content}
            </p>
          ))}
        </div>

        <div className="chat-input-container">
          <img src={AddMedia} alt="addMedia" className="chat-input-container-icon" />
          <img src={Micro} alt="Micro" className="chat-input-container-icon" />
          <img src={Send} alt="Send" className="chat-input-container-icon" onClick={handleMessageSend} />
          <input
            type="text"
            placeholder="Сообщение"
            className="chat-input-container__input"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

export default Messages;
