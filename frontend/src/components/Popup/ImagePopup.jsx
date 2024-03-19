import React from 'react';
import { useLocation } from 'react-router-dom';

function ImagePopup({ link, name, isOpen, onClose, cards, setSelectedCard }) {
  const location = useLocation();

  const handlePreviousCard = () => {
    const currentIndex = cards.findIndex(card => card.link === link);
    const previousIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
    setSelectedCard(cards[previousIndex]);
  };

  const handleNextCard = () => {
    const currentIndex = cards.findIndex(card => card.link === link);
    const nextIndex = currentIndex === cards.length - 1 ? 0 : currentIndex + 1;
    setSelectedCard(cards[nextIndex]);
  };

  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container popup__container_type_image">
        <button
          type="button"
          className="button popup__container-close-button"
          onClick={onClose}
        ></button>

        {!location.pathname.includes('/messages') && (
          <>
            <button className="popup__container-selector-button popup__container-selector-button-left" onClick={handlePreviousCard}></button>
            <button className="popup__container-selector-button popup__container-selector-button-right" onClick={handleNextCard}></button>
          </>
        )}

        <img className="popup__img" src={link} alt={name} />
        <p className="popup__image-container-title">{name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
