import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

export default function AddCardPopup({ isOpen, closeAllPopups, handleAddCard }) {
  const [placeName, setPlaceName] = useState('');
  const [placeLink, setPlaceLink] = useState('');


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
      onClose={closeAllPopups}
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
