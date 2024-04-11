import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import { api } from '../../utils/MainApi';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../context/CurrentUserContext';

function DemoUser({ onCardDelete, onCardClick, onCardLike, setDemoUserVisible, user, setUser, setCards, cards, selectedChatId, setSelectedChatId }) {

  const [chatExists, setChatExists] = useState(false);
  const { currentUser, updateCurrentUser } = useCurrentUser();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли идентификатор пользователя в подписках текущего пользователя
    const isUserSubscribed = currentUser.subscriptions.includes(user._id);
    // Устанавливаем соответствующее значение для isSubscribed
    setIsSubscribed(isUserSubscribed);
  }, [user, currentUser.subscriptions, setIsSubscribed]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

// Функция для обновления данных о пользователе
const updateUser = async () => {
  try {
    const updatedUserData = await api.getUserById(user._id); // Получаем обновленные данные о пользователе с сервера
    setUser(updatedUserData); // Обновляем состояние пользователя
  } catch (error) {
    console.error('Ошибка при обновлении данных о пользователе:', error);
  }
};

useEffect(()=>{
  updateUser()
}, [])


  const handleBackClick = () => {
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
    setDemoUserVisible(false);
  };


  const handleSubscriptionClick = async () => {
    try {
      if (isSubscribed) {
        // Отписываемся от пользователя
        await api.unsubscribeFromUser(user._id, currentUser._id);
        setIsSubscribed(false);

        const res = await api.getUserInfo();
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      updateCurrentUser(res.user);

        console.log('Отписка от пользователя успешно выполнена');
        updateUser();
        console.log('обновленный юзер', currentUser)
      } else {
        
        // Подписываемся на пользователя
        await api.subscribeToUser(user._id, currentUser._id);
        setIsSubscribed(true);

        const res = await api.getUserInfo();
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      updateCurrentUser(res.user);

        console.log('Подписка на пользователя успешно выполнена');
        updateUser();
        console.log('обновленный юзер', currentUser)
      }
    } catch (error) {
      console.error('Ошибка при изменении подписки на пользователя:', error);
    }
  };



  return (

    <section className="demoUser">
      
      <div className="demoUser__container">
        <button className="demoUser__container-avatar-button" style={{ cursor: 'default' }}><img src={user.avatar} alt="" className="profile__container-photo" /></button>
        <div className="demoUser__container-info">
          <div className="demoUser__container-name-box">
            <h2 className="demoUser__container-info-name">{user?.name || 'Гость'}</h2>
          </div>
          <div className="demoUser__container-subs-box">
            <p className="demoUser__container-subs-box-item">{cards.length} фото</p>
            <p className="demoUser__container-subs-box-item">{user.subscribers.length} подписчиков</p>
            <p className="demoUser__container-subs-box-item">{user.subscriptions.length} подписок</p>
          </div>
          <p className='demoUser__container-text'>{user?.bio || 'Информация'}</p>
        </div>
        <div className="buttons-container">
      <button className="back-button" onClick={handleBackClick}>Назад</button>
      <button className="chat-button" onClick={handleChatClick}>Преейти в чат</button>
      <button
        className={isSubscribed ? 'unsubscribe-button' : 'subscribe-button'}
        onClick={handleSubscriptionClick}
        style={{ display: user._id !== currentUser._id ? 'block' : 'none' }}
      >
        {isSubscribed ? 'Отписаться' : 'Подписаться'}
      </button>
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
