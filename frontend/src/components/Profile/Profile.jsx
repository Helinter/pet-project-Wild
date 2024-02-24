import AddButton from '../../images/add-square-02.svg';
import Photo from '../../images/icons/photo_2024-01-06_15-31-50.jpg';
import Tulen from '../../images/1655674618_42-kartinkin-net-p-kartinki-tyulenei-45.jpg';
import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../../context/CurrentUserContext';

function Profile({handleLogout}) {
  const { currentUser, updateCurrentUser } = useCurrentUser();
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);

  const handleClick = () =>{
    alert('Пока не готово')
  }

  const handleCardClick = () => {
    setImagePopupOpen(true);
  };

  const closeAllPopups = () => {
    setImagePopupOpen(false);
  };

  

  return (

    <section className="profile">
      <div className="profile__container">
        <img src={Photo} alt="" className="profile__container-photo" />
        <div className="profile__container-info">
          <div className="profile__container-name-box">
            <h2 className="profile__container-info-name">{currentUser?.name || 'Гость'}</h2>
            <button onClick={handleClick} className="profile__container-info-button">Редактировать</button>
            <button onClick={handleLogout} className="profile__container-info-button">Выйти</button>
          </div>
          <div className="profile__container-subs-box">
            <p className="profile__container-subs-box-item">18 публикаций</p>
            <p className="profile__container-subs-box-item">99 подписчиков</p>
            <p className="profile__container-subs-box-item">12 подписок</p>
          </div>
          <p className='profile__container-text'>Разработчик и любитель тюленей</p>
        </div>
      </div>
      <div className="momentous">
          <div className="momentous__item">
            <button onClick={handleClick} className='add-button'>
            <img src={AddButton} alt="" className="momentous__item-icon" />
            </button>
          </div>
        </div>


        <div className="profile__photos">
          <img onClick={handleCardClick} src={Tulen} alt="" />
          <img src={Tulen} alt="" />
          <img src={Tulen} alt="" />
          <img src={Tulen} alt="" />
          <img src={Tulen} alt="" />
          <img src={Tulen} alt="" />
          <img src={Tulen} alt="" />
          <img src={Tulen} alt="" />
          <img src={Tulen} alt="" />
          <img src={Tulen} alt="" />
        </div>

    </section>

  );
}

export default Profile;
