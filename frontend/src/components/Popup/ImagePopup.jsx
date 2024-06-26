import { api } from '../../utils/MainApi';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ImagePopup({ selectedCard, link, name, isOpen, onClose, cards, setSelectedCard, handleButtonClick, setImagePopupOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);
  const [isAddingComment, setIsAddingComment] = useState(false);


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

  const handleEscape = (event) => {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  };

const openDemoUser= async (user) =>{
  const demoUser = await api.getUserByUsername(user.username);
      handleButtonClick(demoUser);
      setImagePopupOpen(false);
}

  useEffect(() => {
    setComments([]);
    document.body.classList.toggle('popup-opened', isOpen);
    document.addEventListener('keydown', handleEscape);
    // Загрузка комментариев при открытии попапа
    if (isOpen) {

      (async () => {
        try {
          const commentsData = await api.getCardComments(selectedCard._id);
          // Получаем информацию о пользователе для каждого комментария
          const commentsWithUserInfo = await Promise.all(commentsData.map(async (comment) => {
            const user = await api.getUserById(comment.userId);
            return {
              ...comment,
              user: {
                username: user.username,
                avatar: user.avatar,
              },
            };
          }));
          setComments(commentsWithUserInfo);
        } catch (error) {
          console.error('Ошибка при загрузке комментариев:', error);
        }
      })();
    }
    return () => {
      document.body.classList.remove('popup-opened');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, selectedCard]);

  const handleCommentInputChange = (event) => {
    setCommentInput(event.target.value);
  };

const handleAddComment = async () => {
  if (commentInput.trim() === '' || isAddingComment) return;
  setIsAddingComment(true);
  try {
    const newComment = await api.addCommentToCard(selectedCard._id, { text: commentInput.trim() });
    const commentsWithUserInfo = await Promise.all(newComment.map(async (comment) => {
      const user = await api.getUserById(comment.userId);
      return {
        ...comment,
        user: {
          username: user.username,
          avatar: user.avatar,
        },
      };
    }));
    setComments(commentsWithUserInfo);
    setCommentInput('');
  } catch (error) {
    console.error('Ошибка при добавлении комментария:', error);
  } finally {
    setIsAddingComment(false);
  }
};


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddComment();
    }
  };


  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container popup__container_type_image">
        <button
          type="button"
          className="button popup__container-close-button"
          onClick={onClose}
        ></button>

        {navigate && !location.pathname.includes('/messages') && (
          <>
            <button className="popup__container-selector-button popup__container-selector-button-left" onClick={handlePreviousCard}></button>
            <button className="popup__container-selector-button popup__container-selector-button-right" onClick={handleNextCard}></button>
          </>
        )}

        <img className="popup__img" src={link} alt={name} />
        <p className="popup__image-container-title">{name}</p>

     
          <div className="comment-section">
            <div className="comment-input-container">
              <input
                type="text"
                className="comment-input"
                placeholder="Добавить комментарий"
                value={commentInput}
                onChange={handleCommentInputChange}
                onKeyPress={handleKeyPress}
              />
              <button className="add-comment-button" onClick={handleAddComment} disabled={isAddingComment}>Добавить</button>

            </div>
            <ul className="comment-list">
              {comments.slice().reverse().map((comment, index) => (
                <li className="comment" key={index}>
                  {comment.user && comment.user.avatar && (
                    <img src={comment.user.avatar} alt={comment.user.username} className="comment-avatar" onClick={()=>{openDemoUser(comment.user)}}/>
                  )}
                  <div className="comment-container">
                    {comment.user && comment.user.username && (
                      <p className="comment-username">{comment.user.username}</p>
                    )}
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
  
      </div>
    </div>
  );
}

export default ImagePopup;
