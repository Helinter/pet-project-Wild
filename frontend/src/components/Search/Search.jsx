import React, { useState, useEffect } from 'react';
import { api } from '../../utils/MainApi';
import Card from '../Card/Card';

function Search({
  isDemoUserVisible,
  setDemoUserVisible,
  setCards,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
  currentUser,
  demoUser,
  setDemoUser,
  showDropdown,
  setShowDropdown,
  handleButtonClick
}) {
  const [inputValue, setInputValue] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);
  const [subscriptionUsers, setSubscriptionUsers] = useState([]);

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

  }, [isDemoUserVisible]);

  useEffect(() => {
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    localStorage.setItem('isDemoUserVisible', JSON.stringify(isDemoUserVisible));
  }, [demoUser, isDemoUserVisible]);

  useEffect(() => {
    const fetchSubscriptionUsers = async () => {
      const usersData = await Promise.all(currentUser.subscriptions.map(async (userId) => {
        // Получаем данные пользователя по его id
        const userData = await api.getUserById(userId);
        return userData;
      }));
      setSubscriptionUsers(usersData);
    };

    fetchSubscriptionUsers();
  }, [currentUser.subscriptions]);


  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredUsers = allUsers.filter((user) => {
      return user.name.toLowerCase().includes(value.toLowerCase()) || user.username.toLowerCase().includes(value.toLowerCase());
    });

    setFoundUsers(filteredUsers);
    setShowDropdown(filteredUsers.length > 0);
  };

  const uniqueSubscriptionUsers = subscriptionUsers.filter((user, index, self) =>
    index === self.findIndex((u) => (
      u._id === user._id
    ))
  );

  return (
    <>
      {!isDemoUserVisible && (
        <section className="search">
          <div className="searchForm">
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
                <span className="span">{ }</span>
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
          </div>
          <section className="subs-photo">
          {uniqueSubscriptionUsers.map((user) => (
            <div key={user._id} className="subscription">
              <div className="subscription-userInfo">
                <img onClick={() => handleButtonClick(user)} src={user.avatar} alt="User Avatar" className="subscription-userAvatar" />
                <span className="subscription-userName">{user.name}</span>
                <span className="subscription-userUsername">{user.username}</span>
              </div>
              <div className="subscription-cards-container">
                {cards
                  .filter((c) => c.owner === user._id)
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
            </div>
          ))}
        </section>
        </section>
      )}
    
    </>
  );
}

export default Search;
