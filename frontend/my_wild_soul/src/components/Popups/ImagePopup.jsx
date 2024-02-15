import React from 'react';

function ImagePopup({ link, name, isOpen, onClose }) {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container popup__container_type_image">
        <button
          type="button"
          className="button popup__container-close-button"
          onClick={onClose}
        ></button>
        <img className="popup__img" src={link} alt={name} />
        <p className="popup__image-container-title">{name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
