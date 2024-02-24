import { apiConfig } from './constants';
import { getToken, setToken, removeToken } from '../components/TokenHelper/TokenHelper';

export class Api {
  constructor(config) {
    this.url = config.url;
    this.headers = config.headers;
  }

  // Метод для проверки ответа от сервера
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // Метод для обновления заголовков с токеном
  _updateHeaders() {
    return {
      ...this.headers,
      'Authorization': `Bearer ${getToken()}`,
    };
  }

  // Метод для проверки валидности токена
  async checkToken() {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Токен отсутствует');
      }

      const res = await fetch(`${this.url}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return this._checkResponse(res);
    } catch (error) {
      // При ошибке или невалидном токене вызывайте "логаут"
      this.logoutUser();
      return Promise.reject(error.message);
    }
  }

  // Метод для "логаута" пользователя
  logoutUser() {

    removeToken();
  }

  async getUserInfo() {
    const token = localStorage.getItem('token');

    if (!token) {
      return Promise.reject('Токен отсутствует');
    }

    const res = await fetch(`${this.url}/users/me`, {
      headers: this._updateHeaders(),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }

    console.error(`Ошибка: ${res.status}`);
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // Метод для обновления информации о пользователе на сервере
  async updateUserInfo(name, email) {

    const res = await fetch(`${this.url}/users/me`, {
      method: 'PATCH',
      headers: this._updateHeaders(),
      body: JSON.stringify({
        name: name,
        email: email,
      })
    });

    const data = await this._checkResponse(res);
    return data;
  }

  // Метод для регистрации пользователя
  async createUser(name, email, password) {
    const res = await fetch(`${this.url}/signup`, {
      method: 'POST',
      headers: this._updateHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return this._checkResponse(res);
  }

  // Метод для авторизации пользователя
  async login(email, password) {
    const res = await fetch(`${this.url}/signin`, {
      method: 'POST',
      headers: this._updateHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
      return data; // Возвращаем токен из успешного ответа сервера
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

export const api = new Api(apiConfig);
