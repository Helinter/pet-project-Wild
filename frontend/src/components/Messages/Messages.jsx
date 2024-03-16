import React, { useState, useEffect, useRef } from 'react';
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
  const messagesChatRef = useRef(null);
  const inputFileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [showImageSelectedNotification, setShowImageSelectedNotification] = useState(false);

  // При монтировании компонента проверяем localStorage
  useEffect(() => {
    const savedChatId = localStorage.getItem('selectedChatId');
    if (savedChatId) {
      setSelectedChatId(savedChatId);
    }
  }, []);

  // Сохраняем выбранный чат в localStorage при его изменении
  useEffect(() => {
    if (selectedChatId !== null) {
      localStorage.setItem('selectedChatId', selectedChatId);
    }
  }, [selectedChatId]);

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
      scrollToBottom();
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

  // Функция для прокрутки контейнера сообщений вниз
  const scrollToBottom = () => {
    if (messagesChatRef.current) {
      messagesChatRef.current.scrollTop = messagesChatRef.current.scrollHeight;
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [selectedChatId, chats]);


  const handleCreateChat = async () => {
    try {
      const otherUser = await api.getUserByUsername(searchUsername);
      if (otherUser) {
        const createdChat = await api.createChat(currentUser._id, otherUser._id);

        // Проверяем, что createdChat существует и его _id отсутствует в массиве prevChats
        if (createdChat && !chats.some(chat => chat.chat._id === createdChat._id)) {
          // Обновляем список чатов
          const updatedChats = await api.getUserChats();
          setChats(updatedChats);
        }
        setSelectedChatId(createdChat._id);
        setSearchUsername('');
      } else {
        console.log('Пользователь не найден');
      }
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
    }
  };



  const handleMessageSend = async () => {
    if (!selectedChatId || (!messageInput.trim() && !selectedImage)) return;

    try {
      let content = {
        text: messageInput.trim(),
        image: ''
      }; // Инициализируем содержимое сообщения

      if (selectedImage) {
        // Если выбрано изображение, загружаем его и добавляем к содержимому сообщения
        const imageUrl = await uploadImage();
        content.image = imageUrl; // Заполняем поле изображения
      }

      // Отправляем сообщение
      socket.emit('newMessage', {
        senderId: currentUser._id,
        chatId: selectedChatId,
        content: content // Используем обновленное содержимое сообщения
      });

      // Обновляем чаты, добавляя новое сообщение
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.chat._id === selectedChatId) {
            const messageExists = chat.chat.messages.some(message => message.content.text === content.text);
            if (!messageExists) {
              const updatedChat = { ...chat };
              updatedChat.chat.messages.push({
                senderId: currentUser._id,
                content: content
              });
              return updatedChat;
            }
          }
          return chat;
        });
      });

      // Очищаем состояния после отправки сообщения
      setMessageInput('');
      setSelectedImage(null);
      setShowImageSelectedNotification(false)
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Функция для загрузки изображения и возврата URL
  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      const response = await api.uploadImage(formData);
      const imageUrl = response.imageUrl.replace(/\\/g, '/');
      console.log(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Проброс ошибки вверх для обработки в handleMessageSend
    }
  };




  const getMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setShowImageSelectedNotification(true);
  };



  return (
    <section className="messages">
      <div className="messages-list">
        <h2 className="messages-list__name-container">
          <p className="messages-list__name">Чаты</p>
          <div className="chats-usersearch-container">
            <div className="chat-input-container">
              <img src={Send} alt="Send" className="chat-input-container-icon username-search-icon" onClick={handleCreateChat} />
              <input
                type="text"
                placeholder="@username"
                className="chat-input-container__input username-search"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateChat();
                  }
                }}
              />
            </div>
          </div>
        </h2>
        <div className="messages-list__list">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`messages-list__list-item ${selectedChatId === chat.chat?._id ? 'messages-list__list-item_selected' : ''}`}
              onClick={() => handleChatSelect(chat)}
            >
              {chat.otherUser && (
                <>
                  <img className="messages-list__list-item__photo" src={chat.otherUser.avatar} alt="photo" />
                  <p className="messages-list__list-item__name">{chat.otherUser.name}</p>
                  <p className="messages-list__list-item__name messages-list__list-item__username">{chat.otherUser.username}</p>
                </>
              )}
              <div className="messages-list__list-item__indicator"></div>
            </div>
          ))}
        </div>
      </div>
      {selectedChatId && (
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
          <div className="messages-chat-chat" ref={messagesChatRef}>

            {selectedChatId && chats.find(chat => chat.chat._id === selectedChatId)?.chat?.messages.map((message) => (
              <React.Fragment key={message._id}>
                {message.content.image && (
                  <div className={`messages-chat-chat-message ${message.senderId === currentUser._id ? 'messages-chat-chat-message-owners' : ''}`}>
                    <img className='uploaded-image' src={encodeURI(message.content.image)} alt="uploaded" />
                    <p className="messages-chat-chat-message-time">{getMessageTime(message.timestamp)}</p>
                  </div>
                )}

                {message.content.text && (
                  <div className={`messages-chat-chat-message ${message.senderId === currentUser._id ? 'messages-chat-chat-message-owners' : ''}`}>
                    <p>{message.content.text}</p>
                    <p className="messages-chat-chat-message-time">{getMessageTime(message.timestamp)}</p>
                  </div>
                )}
              </React.Fragment>

            ))}


          </div>
          <div className="chat-input-container">

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              ref={inputFileRef}
            />
            <img src={AddMedia} alt="addMedia" className="chat-input-container-icon" onClick={() => inputFileRef.current.click()} />
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
            {showImageSelectedNotification && <div className="image-selected-notification">Изображение выбрано</div>}
          </div>
        </div>
      )}
    </section>
  );

}

export default Messages;
