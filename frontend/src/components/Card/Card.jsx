import React from 'react';
import { useCurrentUser } from '../../context/CurrentUserContext';

function Card({ card, handleClick, handleLikeClick, handleDeleteClick }) {
  const { currentUser, updateCurrentUser } = useCurrentUser();
  
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some(i => i === currentUser._id);

  const handleLike = () => {
    handleLikeClick(card);
  };

  return (
    <div className="element">
      <img className="element__image" src={card.link} alt={card.name} onClick={() => handleClick(card)} />
      <h2 className="element__title">{card.name}</h2>
      <div className="element__likes">
        <button
          type="button"
          className={`element__like-button ${isLiked ? 'element__like-button_active' : ''}`}
          onClick={handleLike}
        ></button>
        <p className="element__like-counter">{card.likes.length}</p>
      </div>
      {isOwn && <button type="button" className='element__delete-button' onClick={() => handleDeleteClick(card)}/>} 
    </div>
  );
}

export default Card;
