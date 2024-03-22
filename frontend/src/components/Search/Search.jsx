import React, { useState, useEffect } from 'react';
import { api } from '../../utils/MainApi';
import DemoUser from '../DemoUser/DemoUser';
import Card from '../Card/Card';

function Search({
  isDemoUserVisible,
  setDemoUserVisible,
  selectedChatId,
  setSelectedChatId,
  setCards,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
  currentUser,
}) {

  const [inputValue, setInputValue] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [demoUser, setDemoUser] = useState([]);

  useEffect(() => {
    api.getCards()
      .then((cardsData) => {
        setCards(cardsData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке карточек:', error);
      });

    api.getAllUsers()
      .then((usersData) => {
        setAllUsers(usersData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке пользователей:', error);
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
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    localStorage.setItem('isDemoUserVisible', JSON.stringify(isDemoUserVisible));
  }, [demoUser, isDemoUserVisible]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredUsers = allUsers.filter((user) => {
      return user.name.toLowerCase().includes(value.toLowerCase()) || user.username.toLowerCase().includes(value.toLowerCase());
    });

    setFoundUsers(filteredUsers);
    setShowDropdown(filteredUsers.length > 0);
  };

  const handleButtonClick = (user) => {
    setDemoUserVisible(true);
    setDemoUser(user);
    setShowDropdown(false);
  };

  // Функция для фильтрации карточек по подпискам текущего пользователя
  const filteredCards = cards.filter((card) => currentUser.subscriptions.includes(card.owner));

  return (
    <>
      {!isDemoUserVisible && (
        <div className="search">
          <section className="searchForm">
            <form>
              <div className="searchForm__input__container">
                <input
                  className="searchForm__input"
                  maxLength="30"
                  type="text"
                  name="searchForm"
                  placeholder="username или Имя"
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <span className="span">{}</span>
              </div>
            </form>
            {showDropdown && inputValue !== '' && (
              <ul className="dropdownMenu__list">
                {foundUsers.map((user) => (
                  <li key={user._id} className="dropdownMenu__item">
                    <img src={user.avatar} alt="User Avatar" className="userAvatar" />
                    <div className="userInfo">
                      <span className="userName">{user.name}</span>
                      <span className="userUsername">{user.username}</span>
                    </div>
                    <button className='dropdownMenu__list-button' onClick={() => handleButtonClick(user)}></button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
      {isDemoUserVisible && (
        <DemoUser
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          onCardDelete={onCardDelete}
          onCardLike={onCardLike}
          onCardClick={onCardClick}
          setDemoUserVisible={setDemoUserVisible}
          user={demoUser}
          setUser={setDemoUser}
          cards={cards}
          setCards={setCards}
        />
      )}

{!isDemoUserVisible && (
      <section className="subs-photo">
        {filteredCards.map((card) => (
          <div key={card._id} className="subscription">
            <img src={card.owner.avatar} alt="User Avatar" className="subscription-userAvatar" />
            <div className="subscription-userInfo">
              <span className="subscription-userName">{card.owner.name}</span>
              <span className="subscription-userUsername">{card.owner.username}</span>
            </div>
            
            {cards
              .filter((c) => c.owner === card.owner._id)
              .map((c) => (
                <Card
                  key={c._id}
                  card={c}
                  handleClick={onCardClick}
                  handleLikeClick={onCardLike}
                  handleDeleteClick={onCardDelete}
                />
              ))}
          </div>
        ))}
      </section>
)}
    </>
  );
}

export default Search;
