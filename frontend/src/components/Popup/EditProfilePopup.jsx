import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { useCurrentUser } from '../../context/CurrentUserContext';

export default function EditProfilePopup({ isOpen, handleUpdateUser }) {


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');

  const { currentUser, updateCurrentUser } = useCurrentUser();

  useEffect(() => {
    // Проверяем, что currentUser определен
    if (currentUser && currentUser.name !== undefined) {
      setName(currentUser.name);
      setBio(currentUser.bio);
      setEmail(currentUser.email);
      setAge(currentUser.age);
    }
  }, [currentUser, isOpen]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateUser(name, email, bio, age)
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="profileForm"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      buttonText="Сохранить"
    >
      <span id="formName-error" className="error"></span>
      <input
        className="popup__input popup__input_type_name"
        minLength="2"
        maxLength="40"
        type="text"
        name="formName"
        required
        placeholder="Имя"
        value={name}
        onChange={handleNameChange}
      />
      <input
        className="popup__input popup__input_type_job"
        minLength="2"
        maxLength="150"
        type="text"
        name="formJob"
        required
        placeholder="Информация"
        value={bio}
        onChange={handleBioChange}
      />
      <span id="formJob-error" className="error"></span>

      <span id="formEmail-error" className="error"></span>
      <input
        className="popup__input popup__input_type_job"
        minLength="2"
        maxLength="30"
        type="text"
        name="formEmail"
        required
        placeholder="Почта"
        value={email}
        onChange={handleEmailChange}
      />

      <input
        className="popup__input popup__input_type_job"
        minLength="2"
        maxLength="2"
        type="text"
        name="formAge"
        required
        placeholder="Возраст"
        value={age}
        onChange={handleAgeChange}
      />
      <span id="formAge-error" className="error"></span>


    </PopupWithForm>
  );
}
