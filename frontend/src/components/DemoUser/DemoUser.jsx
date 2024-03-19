import React, { useEffect } from 'react';
import Card from '../Card/Card';
import { api } from '../../utils/MainApi';

function DemoUser({ onCardDelete, onCardClick, onCardLike, setDemoUserVisible, user, handleCardClick, setCards, cards, handleDeleteClick, handleLikeClick}) {

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

  const handleBackClick = (user) => {
    setDemoUserVisible(false);
  };

  return (

    <section className="demoUser">
      <button className="back-button" onClick={handleBackClick}>Назад</button>
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
