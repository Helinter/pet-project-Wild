import React, { useState, useEffect, useRef } from 'react';
import { useCurrentUser } from '../../context/CurrentUserContext';
import io from 'socket.io-client';
import AddMedia from '../../images/icons/addMedia.svg';
import Micro from '../../images/icons/micro.svg';
import Send from '../../images/icons8-бумажный-самолетик-64 (1).png';
import { api } from '../../utils/MainApi';
import PopupWithForm from '../Popup/PopupWithForm.jsx';

const socket = io('https://api.wild.nomoredomainsmonster.ru');

function Messages({ windowWidth, handleButtonClick, handleCardClick, selectedChatId, setSelectedChatId, selectedImage, setSelectedImage, showImageSelectedNotification, setShowImageSelectedNotification, uploadImage, handleImageUpload, isDemoUserVisible, setDemoUserVisible, }) {
  const { currentUser } = useCurrentUser();
  const [chats, setChats] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesChatRef = useRef(null);
  const inputFileRef = useRef(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [deletePopupType, setDeletePopupType] = useState(null);
  const [isChatDeletePopupOpen, setIsChatDeletePopupOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [contextMenuType, setContextMenuType] = useState(null);



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

        if (createdChat && !chats.some(chat => chat.chat._id === createdChat._id)) {
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
      };

      if (selectedImage) {
        const imageUrl = await uploadImage();
        content.image = imageUrl;
      }

      socket.emit('newMessage', {
        senderId: currentUser._id,
        chatId: selectedChatId,
        content: content
      });

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

      setMessageInput('');
      setSelectedImage(null);
      setShowImageSelectedNotification(false)
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };

  const handleContextMenu = (event, chat) => {
    event.preventDefault();
    setSelectedChatId(chat.chat._id);
    setContextMenuType('chat');
    setContextMenuVisible(true);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleContextMenuMessage = (event, messageId) => {
    event.preventDefault();
    setSelectedMessageId(messageId);
    setContextMenuType('message');
    setContextMenuVisible(true);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  };



  const handleCloseContextMenu = () => {
    setContextMenuVisible(false);
  };

  const handleDeleteChat = () => {
    api.deleteChat(selectedChatId);
    setChats(prevChats => prevChats.filter(chat => chat.chat._id !== selectedChatId));
    setSelectedChatId(null);
    localStorage.removeItem('selectedChatId');
    handleCloseContextMenu();
  };

  const handleClearChat = () => {
    api.clearChat(selectedChatId);
    setChats(prevChats => prevChats.map(chat => chat.chat._id === selectedChatId ? { ...chat, chat: { ...chat.chat, messages: [] } } : chat));
    handleCloseContextMenu();
  };

  const openDeletePopup = () => {
    setDeletePopupType('delete');
    setIsChatDeletePopupOpen(true);
  }

  const openClearPopup = () => {
    setDeletePopupType('clear');
    setIsChatDeletePopupOpen(true);
  }

  const closeDeletePopup = () => {
    setIsChatDeletePopupOpen(false)
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    if (deletePopupType === 'clear') {
      handleClearChat();
      closeDeletePopup();
    } else {
      handleDeleteChat();
      closeDeletePopup();
    }
  }

  const handleShowUserPage = async () => {
    const foundChat = chats.find(chat => chat.chat._id === selectedChatId);
    if (foundChat) {
      const otherUser = await api.getUserById(foundChat.otherUser._id);
      handleButtonClick(otherUser);
    }
  };

  const handleDeleteMessage = () => {
    api.deleteMessage(selectedChatId, selectedMessageId)
      .then(() => {
        setChats(prevChats => {
          return prevChats.map(chat => {
            if (chat.chat._id === selectedChatId) {
              const updatedMessages = chat.chat.messages.filter(message => message._id !== selectedMessageId);
              return { ...chat, chat: { ...chat.chat, messages: updatedMessages } };
            }
            return chat;
          });
        });
        setSelectedMessageId(null);
        setContextMenuVisible(false);
      })
      .catch(error => console.error('Error deleting message:', error));
  };

  const goToChats = () =>{
    setSelectedChatId(null);
  }


  return (
    <>
      {!isDemoUserVisible && (<section className="messages" onClick={handleCloseContextMenu}>
      <div className={`messages-list ${windowWidth < 668 && !selectedChatId ? "fullscreen" : ""} ${windowWidth < 668 && selectedChatId ? "display-none" : ""}`}>
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
                onContextMenu={(e) => handleContextMenu(e, chat)}

              >
                {chat.otherUser && (
                  <>
                    <img className="messages-list__list-item__photo" src={chat.otherUser.avatar} alt="photo" />
                    <div className='name__container'>
                    <p className="messages-list__list-item__name">{chat.otherUser.name}</p>
                    <p className="messages-list__list-item__name messages-list__list-item__username">{chat.otherUser.username}</p>
                    </div>
                  </>
                )}
                <div className="messages-list__list-item__indicator"></div>
              </div>

            ))}
            {contextMenuVisible && contextMenuType === 'chat' && (
              <div className="context-menu" style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}>
                <div className="context-menu-item" onClick={handleShowUserPage}>
                  Страница
                </div>
                <div className="context-menu-item" onClick={openClearPopup}>
                  Очистить чат
                </div>
                <div className="context-menu-item" onClick={openDeletePopup}>
                  Удалить чат
                </div>
              </div>
            )}

            {contextMenuVisible && contextMenuType === 'message' && (
              <div className="context-menu" style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}>
                <div className="context-menu-item" onClick={handleDeleteMessage}>
                  Удалить сообщение
                </div>
              </div>
            )}



          </div>
        </div>
        {selectedChatId && (
         <div className={`messages-chat ${windowWidth < 668 && selectedChatId ? "fullscreen" : ""} ${windowWidth < 668 && !selectedChatId ? "display-none" : ""}`}>
            <div className="messages-chat-header">
              {windowWidth < 668 && selectedChatId && (
                <>
                <button className='go-to-chats' onClick={goToChats}></button>
                </>
              )}
              {selectedChatId && (
                <>
                  <img
                    className="messages-chat-header__photo"
                    src={chats.find(chat => chat.chat._id === selectedChatId)?.otherUser.avatar}
                    alt="photo"
                    onClick={handleShowUserPage}
                  />


                  <p className="messages-chat-header__name">{chats.find(chat => chat.chat._id === selectedChatId)?.otherUser.name}</p>
                  <div className="messages-chat-header__indicator"></div>
                </>
              )}
            </div>
            <div className="messages-chat-chat" ref={messagesChatRef}>
              {selectedChatId && chats.find(chat => chat.chat._id === selectedChatId)?.chat?.messages.map((message) => (
                <React.Fragment key={message._id}>
                  <div className={`messages-chat-chat-message ${message.senderId === currentUser._id ? 'messages-chat-chat-message-owners' : ''}`} onContextMenu={(e) => handleContextMenuMessage(e, message._id)}>

                    {message.content.image && (
                      <img
                        className='uploaded-image'
                        src={encodeURI(message.content.image)}
                        alt="uploaded"
                        onClick={() => handleCardClick({ link: encodeURI(message.content.image) })}
                      />
                    )}
                    {message.content.text && (
                      <p className="message">{message.content.text}</p>
                    )}
                    <p className="messages-chat-chat-message-time">{getMessageTime(message.timestamp)}</p>
                  </div>
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
        <PopupWithForm
          title={deletePopupType === 'clear' ? "Вы уверены, что хотите очистить чат?" : "Вы уверены, что хотите удалить чат?"}
          name={deletePopupType === 'clear' ? "clearForm" : "deleteForm"}
          isOpen={isChatDeletePopupOpen}
          onClose={closeDeletePopup}
          onSubmit={handleSubmit}
          buttonText={deletePopupType === 'clear' ? "Очистить" : "Удалить"}
        >
        </PopupWithForm>
      </section>
      )}
    </>
  );
}

export default Messages;
