import AddButton from '../../images/add-square-02.svg';
import React, { useEffect } from 'react';
import Card from '../Card/Card';
import { api } from '../../utils/MainApi';

function Profile({ isDeletePopupOpen, onClose, setDeletePopupOpen, handleCardClick, setCards, cards, handleDeleteClick, handleLikeClick, handleAddCardClick, currentUser, handleLogout, handleEditAvatarClick, handleEditProfileClick}) {

  useEffect(() => {
    // Получение карточек с сервера
    const fetchCards = async () => {
      try {
        const cardsData = await api.getCards();
        // Отфильтровать карточки по owner === currentUser._id
        const filteredCards = cardsData.filter(card => card.owner === currentUser._id);
        setCards(filteredCards);
      } catch (error) {
        console.error('Ошибка при получении карточек:', error);
      }
    };

    fetchCards();
  }, [currentUser]);

console.log(currentUser)

  return (

    <section className="profile">
      <div className="profile__container">
        <button className="profile__container-avatar-button" onClick={handleEditAvatarClick} ><img src={currentUser.avatar} alt="" className="profile__container-photo" /></button>
        <div className="profile__container-info">
          <div className="profile__container-name-box">
            <h2 className="profile__container-info-name">{currentUser?.name || 'Гость'}</h2>
            <button onClick={handleEditProfileClick} className="profile__container-info-button">Редактировать</button>
            <button onClick={handleLogout} className="profile__container-info-button">Выйти</button>
          </div>
          <div className="profile__container-subs-box">
            <p className="profile__container-subs-box-item">{cards.length} фото</p>
            <p className="profile__container-subs-box-item">{currentUser?.subscribers.length} Подписчиков</p>
            <p className="profile__container-subs-box-item">{currentUser?.subscriptions.length} Подписок</p>
          </div>
          <p className='profile__container-text'>{currentUser?.bio || 'Информация'}</p>
        </div>
      </div>
      <div className="momentous">
          <div className="momentous__item">
            <button className='add-button'>
            <img src={AddButton} onClick={handleAddCardClick} alt="" className="momentous__item-icon" />
            </button>
          </div>
        </div>


        <div className="profile__photos">
        {cards.map(card => (
          <Card
            key={card._id}
            card={card}
            handleClick={handleCardClick}
            handleLikeClick={handleLikeClick}
            handleDeleteClick={handleDeleteClick}
            setDeletePopupOpen={setDeletePopupOpen}
          />
        ))}
      </div>

    </section>

  );
}

export default Profile;
