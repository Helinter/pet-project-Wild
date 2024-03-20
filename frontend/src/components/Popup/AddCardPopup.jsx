import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

export default function AddCardPopup({ onClose, isOpen, handleAddCard }) {
  const [placeName, setPlaceName] = useState('');
  const [placeLink, setPlaceLink] = useState('');

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
    if (!isOpen) {
      setPlaceName('');
      setPlaceLink('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddCard(placeName, placeLink);
  };

  return (
    <PopupWithForm
      title="Загрузить тюленя"
      name="placeForm"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Загрузить"
    >
      <span id="formPlace-error" className="error"></span>
      <input
        className="popup__input popup__input_type_place"
        minLength="2"
        maxLength="30"
        type="text"
        name="formPlace"
        placeholder="Название"
        required
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
      />
      <input
        className="popup__input popup__input_type_link"
        type="url"
        name="formLink"
        placeholder="Ссылка на картинку"
        required
        value={placeLink}
        onChange={(e) => setPlaceLink(e.target.value)}
      />
      <span id="formLink-error" className="error"></span>
      
    </PopupWithForm>
  );
}
