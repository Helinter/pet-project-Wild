import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import { api } from '../../utils/MainApi';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../context/CurrentUserContext';

function DemoUser({ onCardDelete, onCardClick, onCardLike, setDemoUserVisible, user, setCards, cards, selectedChatId, setSelectedChatId }) {

  const [chatExists, setChatExists] = useState(false);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    // Получение карточек с сервера
    const fetchCards = async () => {
      try {
        const cardsData = await api.getCards();
        // Отфильтровать карточки по owner === user._id
        const filteredCards = cardsData.filter(card => card.owner === user._id);
        setCards(filteredCards);
      } catch (error) {
        console.error('Ошибка при получении карточек:', error);
      }
    };

    fetchCards();
  }, [user]);

  const navigate = useNavigate();


  const handleBackClick = (user) => {
    setDemoUserVisible(false);
  };

  const handleChatClick = async () => {
    const chats = await api.getUserChats();
    const existingChat = chats.find(chat => chat.otherUser._id === user._id);
    if (chatExists) {
      // Если чат уже существует, переходим к нему
      if (existingChat) {
        setSelectedChatId(existingChat.chat._id); // Устанавливаем selectedChatId в _id существующего чата
        navigate('/messages');
      } else {
        console.error('Не удалось найти существующий чат');
      }
    } else {
      try {
        // Создаем новый чат с этим пользователем
        const newChat = await api.createChat(user._id, currentUser._id);
        if (newChat) {
          setSelectedChatId(newChat._id); // Устанавливаем selectedChatId в новый _id чата
          localStorage.setItem('selectedChatId', newChat._id); // Сохраняем новый selectedChatId в localStorage
          navigate('/messages');
        } else {
          console.error('Ошибка при создании чата');
        }
      } catch (error) {
        console.error('Ошибка при создании чата:', error);
      }
    }
  };





  return (

    <section className="demoUser">
      <button className="back-button" onClick={handleBackClick}>Назад</button>
      <button className="chat-button" onClick={handleChatClick}>Преейти в чат</button>
      <div className="demoUser__container">
        <button className="demoUser__container-avatar-button"><img src={user.avatar} alt="" className="profile__container-photo" /></button>
        <div className="demoUser__container-info">
          <div className="demoUser__container-name-box">
            <h2 className="demoUser__container-info-name">{user?.name || 'Гость'}</h2>
          </div>
          <div className="demoUser__container-subs-box">
            <p className="demoUser__container-subs-box-item">{cards.length} фото</p>
            <p className="demoUser__container-subs-box-item">0 подписчиков</p>
            <p className="demoUser__container-subs-box-item">0 подписок</p>
          </div>
          <p className='demoUser__container-text'>{user?.bio || 'Информация'}</p>
        </div>
      </div>
      <div className="demoUser__photos">
        {cards.map(card => (
          <Card
            key={card._id}
            card={card}
            handleClick={onCardClick}
            handleLikeClick={onCardLike}
            handleDeleteClick={onCardDelete}
          />
        ))}
      </div>

    </section>

  );
}

export default DemoUser;
