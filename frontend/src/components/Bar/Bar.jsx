import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Home from '../../images/Vector3Home.svg';
import Search from '../../images/icons/Search.svg';
import Message_Notification from '../../images/icons/Message_Notification.svg';
import Profile from '../../images/icons/user-profile-circle.svg';
import Logo from '../../images/logoza.png';

const Bar = ({isDemoUserVisible, setDemoUserVisible, handleBarClose}) => {
  const location = useLocation();
  const [selectedLink, setSelectedLink] = useState(location.pathname);


  // Установка ссылки
  useEffect(() => {
    setSelectedLink(location.pathname);
  }, [location]);

  const handleLinkClick = () =>{
    setDemoUserVisible(false);
    handleBarClose();
  }

  return (
    <div className="bar">
      <div className="logo">
        <img className="logo-image" src={Logo} alt="Логотип" />
      </div>
      <ul className="bar__nav-links">
        <li className="bar__nav-link-box">
          <Link to="/home" className={`bar__nav-link ${selectedLink === '/home' ? 'bar__nav-link-selected' : ''}`}onClick={handleLinkClick}>
            <img className="bar__nav-link-icon" src={Home} alt="Главная" />
            Главная
          </Link>
        </li>
        <li className="bar__nav-link-box">
          <Link to="/search" className={`bar__nav-link ${selectedLink === '/search' ? 'bar__nav-link-selected' : ''}`}onClick={handleLinkClick}>
            <img className="bar__nav-link-icon" src={Search} alt="Поиск" />
            Поиск
          </Link>
        </li>
        <li className="bar__nav-link-box">
          <Link to="/messages" className={`bar__nav-link ${selectedLink === '/messages' ? 'bar__nav-link-selected' : ''}`}onClick={handleLinkClick}>
            <img className="bar__nav-link-icon" src={Message_Notification} alt="Сообщения" />
            Сообщения
          </Link>
        </li>
        <li className="bar__nav-link-box last-link">
          <Link to="/profile" className={`bar__nav-link ${selectedLink === '/profile' ? 'bar__nav-link-selected' : ''}`}onClick={handleLinkClick}>
            <img className="bar__nav-link-icon" src={Profile} alt="Профиль" />
            Профиль
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Bar;
