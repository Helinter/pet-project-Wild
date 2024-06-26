import React, { useEffect } from 'react';

function PopupWithForm({ title, name, isOpen, onClose, children, onSubmit, buttonText, isPopupButtonDisabled}) {
  const popupClassName = `popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`;

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
    <div className={popupClassName}>
      <div className="popup__container">
        <button type="button" className="button popup__container-close-button" onClick={onClose}></button>
        <h2 className="popup__container-title">{title}</h2>
        <form name={name} className="form" noValidate onSubmit={onSubmit}>
          {children}
          <button type="submit" className="popup__container-button" id="cardSubmit" disabled={isPopupButtonDisabled ? "disabled" : ""}>
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
