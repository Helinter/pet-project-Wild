import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { useCurrentUser } from '../../context/CurrentUserContext';

export default function EditProfilePopup({ onClose, isOpen, handleUpdateUser }) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [username, setUsername] = useState('');

  const { currentUser, updateCurrentUser } = useCurrentUser();

  useEffect(() => {
    document.body.classList.toggle('popup-opened', isOpen); // Добавляем или убираем класс в зависимости от состояния isOpen
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.classList.remove('popup-opened'); // Убираем класс при размонтировании компонента
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleEscape = (event) => {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  };
  
  useEffect(() => {
    // Проверяем, что currentUser определен
    if (currentUser && currentUser.name !== undefined) {
      setName(currentUser.name);
      setBio(currentUser.bio);
      setEmail(currentUser.email);
      setAge(currentUser.age);
      setUsername(currentUser.username);
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

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleUpdateUser(name, email, bio, age, username); // Передаем значение юзернейма в функцию обновления пользователя
  };

  return (
    <PopupWithForm
      onClose={onClose}
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

      <input
        className="popup__input popup__input_type_job"
        minLength="3"
        maxLength="11"
        type="text"
        name="formUsername"
        required
        placeholder="Юзернейм"
        value={username}
        onChange={handleUsernameChange}
      />
      <span id="formUsername-error" className="error"></span>

    </PopupWithForm>
  );
}
