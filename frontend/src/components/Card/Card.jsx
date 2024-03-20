import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../context/CurrentUserContext';
import { api } from '../../utils/MainApi';

function Card({ card, handleClick, handleLikeClick, handleDeleteClick }) {
  const { currentUser } = useCurrentUser();
  const location = useLocation();
  const [ownerName, setOwnerName] = useState('');

  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some(i => i === currentUser._id);
  const shouldDisplayUsername = location.pathname !== '/profile';

  useEffect(() => {
    const fetchOwnerName = async () => {
      try {
        const user = await api.getUserById(card.owner);
        setOwnerName(user.username);
      } catch (error) {
        console.error('Error fetching owner name:', error);
      }
    };

    if (shouldDisplayUsername) {
      fetchOwnerName();
    }
  }, [card.owner, shouldDisplayUsername]);

  const handleLike = () => {
    handleLikeClick(card);
  };

  return (
    <div className="element">
      {shouldDisplayUsername && <p className="element__username">{ownerName}</p>}
      <img className="element__image" src={card.link} alt={card.name} onClick={() => handleClick(card)} />
      <h2 className="element__title">{card.name}</h2>
      <button
          type="button"
          className="element__comment-button"
          onClick={() => handleClick(card)}
        ></button>
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
