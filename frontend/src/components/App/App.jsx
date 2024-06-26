import Main from '../Main/Main';
import Bar from '../Bar/Bar';
import Login from '../Login/Login';
import Register from '../Register/Register';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../utils/MainApi';
import { useCurrentUser } from '../../context/CurrentUserContext';
import Home from '../Home/Home';
import Search from '../Search/Search';
import Messages from '../Messages/Messages';
import Profile from '../Profile/Profile';
import EditProfilePopup from '../Popup/EditProfilePopup';
import EditAvatarPopup from '../Popup/EditAvatarPopup';
import AddCardPopup from '../Popup/AddCardPopup';
import ImagePopup from '../Popup/ImagePopup';
import PopupWithForm from '../Popup/PopupWithForm.jsx';
import DemoUser from '../DemoUser/DemoUser';


function App() {
  const navigate = useNavigate();
  const [isLogedin, setIsLogedin] = useState(() => {
    const storedIsLogedin = localStorage.getItem('isLogedin');
    return storedIsLogedin ? JSON.parse(storedIsLogedin) : false;
  });
  const { currentUser, updateCurrentUser } = useCurrentUser();
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isAddCardPopupOpen, setAddCardPopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isDemoUserVisible, setDemoUserVisible] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageSelectedNotification, setShowImageSelectedNotification] = useState(false);
  const [isPopupButtonDisabled, setIsPopupButtonDisabled] = useState(true);
  const [isBarVisible, setIsBarVisible] = useState(false);
  const [demoUser, setDemoUser] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const location = useLocation();

  if (location.pathname === '/') {
    navigate('/home', { replace: true });
  }

  useEffect(() => {
    api.checkToken()

      .catch(error => {
        console.error('Ошибка проверки токена:', error);
        handleLogout();
      });
      const storedDemoUser = localStorage.getItem('demoUser');
    if (storedDemoUser) {
      setDemoUser(JSON.parse(storedDemoUser));
    }

    const storedIsDemoUserVisible = localStorage.getItem('isDemoUserVisible');
    if (storedIsDemoUserVisible) {
      setDemoUserVisible(JSON.parse(storedIsDemoUserVisible));
    }
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

  const handleAddCardClick = () => {
    setAddCardPopupOpen(true);
  };

  const closeAllPopups = () => {
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setAddCardPopupOpen(false);
    setImagePopupOpen(false);
    setDeletePopupOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLogedin(false);
    navigate('/');
  };

  const handleUpdateUser = async (name, email, bio, age, username) => {
    try {
      const res = await api.updateUserInfo(name, email, bio, age, username);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      updateCurrentUser(res.user);
      closeAllPopups();
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
    }
  };


  const handleAddCard = async (name, link) => {
    try {
      const res = await api.addCard(name, link);
      console.log('card added: ', res);
      setCards([...cards, res]);
      closeAllPopups();
    } catch (error) {
      console.error('Ошибка при добавлении карточки:', error);
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

  const handleLikeClick = (card) => {
    const isLiked = card.likes.some(i => i === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      });

  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setImagePopupOpen(true);
  };

  const handleDeleteClick = (card) => {
    setSelectedCard(card);
    setDeletePopupOpen(true)
  };


  const handleDeleteCard = (card) => {
    api.deleteCard(card._id)
      .then(() => {
        // Создаем новый массив, исключая удаленную карточку
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .catch((error) => {
        console.error('Ошибка при удалении карточки:', error);
      });
  };


  const handleSubmit = (e, card) => {
    e.preventDefault();
    console.log(card)
    handleDeleteCard(card);
    closeAllPopups();
  }

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

  const handleBurgerClick = () => {
    setIsBarVisible(true);
  }

  const handleBarClose = () => {
    setIsBarVisible(false);
  }

  const handleButtonClick = (user) => {
    setDemoUserVisible(true);
    setDemoUser(user);
    setShowDropdown(false);
  };

  return (
    <section className="App">
      {(isLogedin && (isBarVisible || windowWidth > 900)) ? <Bar
        isDemoUserVisible={isDemoUserVisible}
        setDemoUserVisible={setDemoUserVisible}
        handleBarClose={handleBarClose}
      /> : null}
      {(!isBarVisible && windowWidth < 900) &&<button className="burger-button" onClick={handleBurgerClick}></button>}
      {(isBarVisible && windowWidth < 900) && <button className="bar-close-button" onClick={handleBarClose}></button>}
      <Routes>
        <Route path="/signin" element={isLogedin ? <Navigate to="/home" /> : <Login
          setIsLogedin={setIsLogedin}
        />} />
        <Route path="/signup" element={isLogedin ? <Navigate to="/home" /> : <Register
          setIsLogedin={setIsLogedin}
        />} />
        <Route path="/" element={isLogedin ? <Main /> : <Login
          setIsLogedin={setIsLogedin}
        />} >
          <Route path="/home" element={<Home
            cards={cards}
            setCards={setCards}
            onCardClick={handleCardClick}
            onCardLike={handleLikeClick}
            onCardDelete={handleDeleteClick}
            setDeletePopupOpen={setDeletePopupOpen}
            onClose={closeAllPopups}
            isDeletePopupOpen={isDeletePopupOpen}
            isDemoUserVisible={isDemoUserVisible}
            setDemoUserVisible={setDemoUserVisible}
            handleButtonClick={handleButtonClick}
          />} />
          <Route path="/search" element={<Search
            cards={cards}
            setCards={setCards}
            onCardClick={handleCardClick}
            onCardLike={handleLikeClick}
            onCardDelete={handleDeleteClick}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            isDemoUserVisible={isDemoUserVisible}
            setDemoUserVisible={setDemoUserVisible}
            currentUser={currentUser}
            demoUser={demoUser}
            setDemoUser={setDemoUser}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            handleButtonClick={handleButtonClick}
          />} />
          <Route path="/messages" element={<Messages
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            handleCardClick={handleCardClick}
            onClose={closeAllPopups}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            showImageSelectedNotification={showImageSelectedNotification}
            setShowImageSelectedNotification={setShowImageSelectedNotification}
            uploadImage={uploadImage}
            handleImageUpload={handleImageUpload}
            isDemoUserVisible={isDemoUserVisible}
            setDemoUserVisible={setDemoUserVisible}
            handleButtonClick={handleButtonClick}
            windowWidth={windowWidth}
          />} />
          <Route path="/profile" element={<Profile
            handleCardClick={handleCardClick}
            cards={cards}
            setCards={setCards}
            handleLikeClick={handleLikeClick}
            handleDeleteClick={handleDeleteClick}
            handleAddCardClick={handleAddCardClick}
            updateCurrentUser={updateCurrentUser}
            currentUser={currentUser}
            handleLogout={handleLogout}
            handleEditAvatarClick={handleEditAvatarClick}
            handleEditProfileClick={handleEditProfileClick}
            setDeletePopupOpen={setDeletePopupOpen}
            isDemoUserVisible={isDemoUserVisible}
            setDemoUserVisible={setDemoUserVisible}
            handleButtonClick={handleButtonClick}
          />} />
        </Route>
      </Routes>
      <EditProfilePopup
        onClose={closeAllPopups}
        isOpen={isEditProfilePopupOpen}
        handleUpdateUser={handleUpdateUser}
      />
      <EditAvatarPopup
        onClose={closeAllPopups}
        isOpen={isEditAvatarPopupOpen}
        handleUpdateAvatar={handleUpdateAvatar}
        selectedImage={selectedImage}
        handleImageUpload={handleImageUpload}
        showImageSelectedNotification={showImageSelectedNotification}
        uploadImage={uploadImage}
        setSelectedImage={setSelectedImage}
        setShowImageSelectedNotification={setShowImageSelectedNotification}
      />
      <AddCardPopup
        onClose={closeAllPopups}
        isOpen={isAddCardPopupOpen}
        handleAddCard={handleAddCard}
        setSelectedImage={setSelectedImage}
        showImageSelectedNotification={showImageSelectedNotification}
        setShowImageSelectedNotification={setShowImageSelectedNotification}
        uploadImage={uploadImage}
        handleImageUpload={handleImageUpload}
        selectedImage={selectedImage}
        setIsPopupButtonDisabled={setIsPopupButtonDisabled}
        isPopupButtonDisabled={isPopupButtonDisabled}
      />
      <ImagePopup
        link={selectedCard?.link}
        name={selectedCard?.name}
        isOpen={isImagePopupOpen}
        onClose={closeAllPopups}
        cards={cards}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        handleButtonClick={handleButtonClick}
        setImagePopupOpen={setImagePopupOpen}
      />

      <PopupWithForm
        title="Вы уверены, что хотите удалить карточку?"
        name="deleteForm"
        isOpen={isDeletePopupOpen}
        onClose={closeAllPopups}
        onSubmit={(e) => handleSubmit(e, selectedCard)}
        buttonText="Удалить"
      />

      {isDemoUserVisible && (
        <DemoUser
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          onCardClick={handleCardClick}
          onCardLike={handleLikeClick}
          onCardDelete={handleDeleteClick}
          setDemoUserVisible={setDemoUserVisible}
          user={demoUser}
          setUser={setDemoUser}
          cards={cards}
          setCards={setCards}
        />
      )}

    </section>
  );
}

export default App;
