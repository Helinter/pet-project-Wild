import React, { useState, useEffect, useRef } from 'react';
import PopupWithForm from './PopupWithForm';
import AddMedia from '../../images/icons/addMedia.svg';
import { api } from '../../utils/MainApi';

export default function AddCardPopup({ onClose, isOpen, handleAddCard }) {
  const [placeName, setPlaceName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageSelectedNotification, setShowImageSelectedNotification] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadImage();
    handleAddCard(placeName, imageUrl);
    setSelectedImage(null);
    setShowImageSelectedNotification(false)
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setShowImageSelectedNotification(true);
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      const response = await api.uploadImage(formData);
      const imageUrl = response.imageUrl.replace(/\\/g, '/');
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
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
      <div className="chat-input-container" style={{
        display: 'flex',
        height: '30px',
        backgroundColor: 'black',
        opacity: '0.9',
        width: '358px',
        margin: '20px auto',
        justifyContent: 'center'
      }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={inputFileRef}
        />
        <img src={AddMedia} style={{
          top: '3px',
          right: '323px'
        }}
          alt="addMedia" className="chat-input-container-icon" onClick={() => inputFileRef.current.click()} />
        {showImageSelectedNotification && <div className="image-selected-notification" style={{top: '4px'}}>Изображение выбрано</div>}
      </div>
      
      <span id="formLink-error" className="error"></span>

    </PopupWithForm>
  );
}
