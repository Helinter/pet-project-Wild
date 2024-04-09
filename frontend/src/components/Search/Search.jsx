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
  const [subscriptionUsers, setSubscriptionUsers] = useState([]);


  useEffect(() => {
    if (!isDemoUserVisible) {
      // Загрузить данные о карточках и подписках заново
      api.getCards()
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch((error) => {
          console.error('Ошибка при загрузке карточек:', error);
        });
  
      const fetchSubscriptionUsers = async () => {
        const usersData = [];
        for (const card of cards) {
          const userData = await api.getUserById(card.owner);
          usersData.push(userData);
        }
        setSubscriptionUsers(usersData);
      };
  
      fetchSubscriptionUsers();
    }
  }, [isDemoUserVisible]);
  

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

  useEffect(() => {
    const fetchSubscriptionUsers = async () => {
      const usersData = [];
      for (const card of cards) {
        const userData = await api.getUserById(card.owner);
        // Проверяем, содержится ли id пользователя в подписках текущего пользователя
        if (currentUser.subscriptions.includes(userData._id)) {
          usersData.push(userData);
        }
      }
      setSubscriptionUsers(usersData);
    };
  
    fetchSubscriptionUsers();
  }, [cards, currentUser]);

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

  const uniqueSubscriptionUsers = subscriptionUsers.filter((user, index, self) =>
  index === self.findIndex((u) => (
    u._id === user._id
  ))
);

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
      )}
    </>
  );
}

export default Search;
