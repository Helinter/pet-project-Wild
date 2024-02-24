import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { api } from '../../utils/MainApi';
import { useFormWithValidation } from '../FormValidator/FormValidator';
import Union from '../../images/Union.svg';
import Unioner from '../../images/Unioner.svg';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../TokenHelper/TokenHelper';
import { useCurrentUser } from '../../context/CurrentUserContext';

function Register({ setIsRegistered, setImageSrc, setError, setIsLogedin }) {
  const {
    values,
    handleChange,
    validateEmail,
    validateName,
    validatePassword,
    errors,
  } = useFormWithValidation();
  const [hasErrors, setHasErrors] = useState(true); // Инициализируем как true
  const { updateCurrentUser } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Проверка наличия ошибок в значениях
    setHasErrors(
      !!validateName(values.name) ||
      !!validateEmail(values.email) ||
      !!validatePassword(values.password)
    );
  }, [values, validateName, validateEmail, validatePassword]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!hasErrors) {
      try {
        const response = await api.createUser(
          values.name,
          values.email,
          values.password
        );
        console.log('Успешная регистрация:', response);
        setIsRegistered(true);
        setImageSrc(Union);
        const res = await api.login(values.email, values.password);
        if (res.token) {
          setToken(res.token);
          setIsLogedin(true);
          const storedCurrentUser = localStorage.getItem('currentUser');
          const userData = await api.getUserInfo();
          if (userData) {
            updateCurrentUser(userData);

            if (!storedCurrentUser) {
              localStorage.setItem(
                'currentUser',
                JSON.stringify(userData)
              );
            }
          }
          navigate('/movies');
        }
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        setError(
          error.message || 'Что-то пошло не так! Попробуйте ещё раз.'
        );
        setImageSrc(Unioner);
      }
    }
  };

  return (
    <>
      <Header />
      <section className="register">
        <h1 className="register__title">Добро пожаловать!</h1>
        <form onSubmit={handleRegister} noValidate>
          <div className="register__input-container">
            <input
              id="registerName"
              className={`signup__input ${errors.name && 'signup__input_error'}`}
              maxLength="30"
              type="text"
              name="name"
              required
              onChange={handleChange}
              value={values.name || ''}
            />
            {values.name && (
              <span className="signup__error-message">{validateName(values.name)}</span>
            )}
            <label className="register__input-label" htmlFor="registerName">
              Имя
            </label>
          </div>

          <div className="register__input-container">
            <input
              id="registerEmail"
              className={`signup__input ${errors.email && 'signup__input_error'}`}
              maxLength="30"
              type="text"
              name="email"
              required
              onChange={handleChange}
              value={values.email || ''}
            />
            {values.email && (
              <span className="signup__error-message">{validateEmail(values.email)}</span>
            )}
            <label className="register__input-label" htmlFor="registerEmail">
              E-mail
            </label>
          </div>

          <div className="register__input-container">
            <input
              id="registerPassword"
              className={`signup__input ${errors.password && 'signup__input_error'}`}
              maxLength="30"
              type="password"
              name="password"
              required
              onChange={handleChange}
              value={values.password || ''}
            />
            {values.password && (
              <span className="signup__error-message">{validatePassword(values.password)}</span>
            )}
            <label className="register__input-label" htmlFor="registerPassword">
              Пароль
            </label>
          </div>

          <button
            type="submit"
            className={`signup__button ${hasErrors && 'signup__button_disabled'}`}
            id="SignInSubmit"
            disabled={hasErrors}
          >
            Зарегистрироваться
          </button>
        </form>

        <p className="signup__link-q">
          Уже зарегистрированы?
          <Link className="signup__link" to="/signin">
            Войти
          </Link>
        </p>
      </section>
    </>
  );
}

export default Register;
