import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../../context/CurrentUserContext';
import io from 'socket.io-client';
import AddMedia from '../../images/icons/addMedia.svg';
import Micro from '../../images/icons/micro.svg';
import Send from '../../images/icons8-бумажный-самолетик-64 (1).png';
import { api } from '../../utils/MainApi';

const socket = io('http://localhost:2999');

function Messages() {
  const { currentUser } = useCurrentUser();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
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
    const handleNewMessage = (updatedChat) => {
      console.log('получено сообщение:', updatedChat);
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.chat && chat.chat._id === updatedChat.chat._id) {
            return { ...chat, chat: updatedChat.chat };
          }
          return chat;
        });
      });
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      const isChatStillExists = chats.some(chat => chat.chat._id === selectedChatId);
      if (!isChatStillExists) {
        setSelectedChatId(null);
      }
    }
  }, [chats]);

  const handleChatSelect = (chat) => {
    setSelectedChatId(chat.chat._id);
  };

  const handleMessageSend = async () => {
    if (!selectedChatId || !messageInput.trim()) return;

    try {
      socket.emit('newMessage', {
        senderId: currentUser._id,
        chatId: selectedChatId,
        content: messageInput.trim()
      });

      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.chat._id === selectedChatId) {
            const messageExists = chat.chat.messages.some(message => message.content === messageInput.trim());
            if (!messageExists) {
              const updatedChat = { ...chat };
              updatedChat.chat.messages.push({
                senderId: currentUser._id,
                content: messageInput.trim()
              });
              return updatedChat;
            }
          }
          return chat;
        });
      });

      setMessageInput('');
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
              key={chat._id}
              className={`messages-list__list-item ${selectedChatId === chat.chat._id ? 'messages-list__list-item_selected' : ''}`}
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
          {selectedChatId && (
            <>
              <img className="messages-chat-header__photo" src={chats.find(chat => chat.chat._id === selectedChatId)?.otherUser.avatar} alt="photo" />
              <p className="messages-chat-header__name">{chats.find(chat => chat.chat._id === selectedChatId)?.otherUser.name}</p>
              <div className="messages-chat-header__indicator"></div>
            </>
          )}
        </div>
        <div className="messages-chat-chat">
          {selectedChatId && chats.find(chat => chat.chat._id === selectedChatId)?.chat?.messages.map((message, index) => (
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleMessageSend();
              }
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default Messages;
