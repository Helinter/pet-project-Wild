import React, {  useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup({ onClose, isOpen, handleUpdateAvatar }) {
  const avatarInputRef = useRef();

  
  function handleSubmit(e) {
    e.preventDefault();
    const newAvatar = avatarInputRef.current.value;
    handleUpdateAvatar( newAvatar
    );
  } 

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
  

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="avatarForm"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Сохранить"
    >
      <span id="formAvatar-error" className="error"></span>
      <input ref={avatarInputRef}  className="popup__input popup__input_type_avatar" type="url" name="formAvatar" placeholder="Ссылка на аватар" required />
      
    </PopupWithForm>
  );
}