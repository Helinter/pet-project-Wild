import React, { useState, useEffect, useRef } from 'react';
import PopupWithForm from './PopupWithForm';

export default function AddCardPopup({ onClose, isOpen, handleAddCard, setSelectedImage, showImageSelectedNotification, setShowImageSelectedNotification, uploadImage, handleImageUpload, selectedImage, setIsPopupButtonDisabled, isPopupButtonDisabled }) {
  const [placeName, setPlaceName] = useState('');
  const inputFileRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('popup-opened', isOpen);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.classList.remove('popup-opened');
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
    }
  }, [isOpen]);

  useEffect(() => {
    if (placeName !== "" && selectedImage) {
      setIsPopupButtonDisabled(false)
    }else {
      setIsPopupButtonDisabled(true)
    }
    
  }, [placeName, selectedImage])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadImage();
    handleAddCard(placeName, imageUrl);
    setSelectedImage(null);
    setShowImageSelectedNotification(false);
  };

  return (
    <PopupWithForm
      title="Загрузить тюленя"
      name="placeForm"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Загрузить"
      isPopupButtonDisabled={isPopupButtonDisabled}

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

        {showImageSelectedNotification && <div className="image-selected-notification" style={{ top: '4px' }}>Изображение выбрано</div>}
      </div>

      <span id="formLink-error" className="error"></span>

    </PopupWithForm>
  );
}
