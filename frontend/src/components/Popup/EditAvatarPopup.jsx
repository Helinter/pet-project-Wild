import React, {  useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup({ onClose, isOpen, handleUpdateAvatar, selectedImage, handleImageUpload, showImageSelectedNotification, uploadImage, setSelectedImage, setShowImageSelectedNotification}) {
  const inputFileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAvatar = await uploadImage();
    handleUpdateAvatar( newAvatar
    );
    setSelectedImage(null);
    setShowImageSelectedNotification(false);
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
      <div className="chat-input-container" onClick={() => inputFileRef.current.click()} style={{
        display: 'flex',
        height: '30px',
        backgroundColor: 'bisque',
        opacity: '0.9',
        width: '358px',
        margin: '20px auto',
        borderRadius: '3px',
        color: 'black',
        cursor: 'pointer',
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)'
      }}
      >{!selectedImage && <p style={{
        margin: '0',
      }}>
        Выберите изображение</p>}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={inputFileRef}
        />

        {showImageSelectedNotification && <div className="image-selected-notification" style={{ top: '4px' }}>Фото выбрано, изменить?</div>}
      </div>


    </PopupWithForm>
  );
}