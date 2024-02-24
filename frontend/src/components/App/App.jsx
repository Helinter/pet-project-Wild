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

function App() {
  const navigate = useNavigate();
  const [isLogedin, setIsLogedin] = useState(() => {
    const storedIsLogedin = localStorage.getItem('isLogedin');
    return storedIsLogedin ? JSON.parse(storedIsLogedin) : false;
  });
  const { updateCurrentUser } = useCurrentUser();

  useEffect(() => {
    api.checkToken()
      .then(userData => {
        updateCurrentUser(userData);
        setIsLogedin(true);
      })
      .catch(error => {
        console.error('Ошибка проверки токена:', error);
        handleLogout();
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLogedin(false);
    navigate('/');
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
          <Route path="/profile" element={<Profile handleLogout={handleLogout} />} />
        </Route>
      </Routes>
      </section>
  );
}

export default App;
