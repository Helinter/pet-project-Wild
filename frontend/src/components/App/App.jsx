import Main from '../Main/Main';
import Bar from '../Bar/Bar';
import Login from '../Login/Login';
import Register from '../Register/Register';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { api } from '../../utils/MainApi';
import { useCurrentUser } from '../../context/CurrentUserContext';
import Home from '../Home/Home';
import Search from '../Search/Search';
import Friends from '../Friends/Friends';
import Messages from '../Messages/Messages';
import Profile from '../Profile/Profile';
import EditProfilePopup from '../Popup/EditProfilePopup';
import EditAvatarPopup from '../Popup/EditAvatarPopup'

function App() {
  const navigate = useNavigate();
  const [isLogedin, setIsLogedin] = useState(() => {
    const storedIsLogedin = localStorage.getItem('isLogedin');
    return storedIsLogedin ? JSON.parse(storedIsLogedin) : false;
  });
  const { currentUser, updateCurrentUser } = useCurrentUser();
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);

  useEffect(() => {
    api.checkToken()
      .catch(error => {
        console.error('Ошибка проверки токена:', error);
        handleLogout();
      });
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      updateCurrentUser(parsedUser);
      setIsLogedin(true);
    } else {
      setIsLogedin(false);
    }
  }, []);
  

  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setEditAvatarPopupOpen(true);
  };

  const closeAllPopups = () => {
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLogedin(false);
    navigate('/');
  };

  const handleUpdateUser = async (name, email, bio, age) => {
    try {
      const res = await api.updateUserInfo(name, email, bio, age);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      updateCurrentUser(res.user);
      closeAllPopups();
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
    }
  };
  

  const handleUpdateAvatar = async (avatarLink) => {
    try {
        const res = await api.updateAvatar(avatarLink);
        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {}; // Инициализируем как пустой объект, если отсутствует

        // Обновляем или создаем поле аватара
        currentUser = {
            ...currentUser,
            avatar: res.user?.avatar || avatarLink // Используем аватар из ответа сервера, если он есть, в противном случае используем переданный avatarLink
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateCurrentUser(currentUser);
        closeAllPopups();
    } catch (error) {
        console.error('Ошибка при обновлении аватара:', error);
    }
};






  return (
    <section className="App">
      {isLogedin ? <Bar /> : null}
      <Routes>
        <Route path="/signin" element={isLogedin ? <Navigate to="/" /> : <Login setIsLogedin={setIsLogedin} />} />
        <Route path="/signup" element={isLogedin ? <Navigate to="/" /> : <Register setIsLogedin={setIsLogedin} />} />
        <Route path="/" element={isLogedin ? <Main /> : <Login setIsLogedin={setIsLogedin} />} >
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile updateCurrentUser={updateCurrentUser} currentUser={currentUser} handleLogout={handleLogout} handleEditAvatarClick={handleEditAvatarClick} handleEditProfileClick={handleEditProfileClick} />} />
        </Route>
      </Routes>
      <EditProfilePopup closeAllPopups={closeAllPopups} isOpen={isEditProfilePopupOpen} handleUpdateUser={handleUpdateUser} />
      <EditAvatarPopup closeAllPopups={closeAllPopups} isOpen={isEditAvatarPopupOpen} handleUpdateAvatar={handleUpdateAvatar} />
    </section>
  );
}

export default App;
