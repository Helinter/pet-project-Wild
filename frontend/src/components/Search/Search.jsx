import React, {  useState, useEffect } from 'react';
import { api } from '../../utils/MainApi';
import DemoUser from '../DemoUser/DemoUser';

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
}) {

  const [inputValue, setInputValue] = useState(''); 
  const [allUsers, setAllUsers] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [demoUser, setDemoUser] = useState([]);

  useEffect(() => {
    // При монтировании компонента загружаем всех пользователей
    api.getAllUsers()
      .then((usersData) => {
        setAllUsers(usersData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке пользователей:', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
  
    // Фильтруем список пользователей по введенному значению
    const filteredUsers = allUsers.filter((user) => {
      // Фильтруем по имени или юзернейму, в зависимости от вашей логики
      return user.name.toLowerCase().includes(value.toLowerCase()) || user.username.toLowerCase().includes(value.toLowerCase());
    });
  
    // Устанавливаем отфильтрованных пользователей в состояние
    setFoundUsers(filteredUsers);
    // Показываем выпадающее меню, если найдены пользователи
    setShowDropdown(filteredUsers.length > 0);
  };

  const handleButtonClick = (user) => {
    setDemoUserVisible(true);
    setDemoUser(user);
    setShowDropdown(false)
  };
  
  return (
    <>
   { !isDemoUserVisible && <div className="search">
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
      {showDropdown && inputValue!=='' && (
          <ul className="dropdownMenu__list">
            {foundUsers.map((user) => (
              <li key={user._id} className="dropdownMenu__item">
                <img src={user.avatar} alt="User Avatar" className="userAvatar" />
                <div className="userInfo">
                  <span className="userName">{user.name}</span>
                  <span className="userUsername">{user.username}</span>
                </div>
                <button className='dropdownMenu__list-button'  onClick={() => handleButtonClick(user)}></button>
              </li>
            ))}
          </ul>
      )}
    </section>
    </div>}
    {isDemoUserVisible && <DemoUser selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} onCardDelete={onCardDelete} onCardLike={onCardLike} onCardClick={onCardClick} setDemoUserVisible={setDemoUserVisible} user={demoUser} cards={cards} setCards={setCards}/>}
    </>
  );
}

export default Search;
