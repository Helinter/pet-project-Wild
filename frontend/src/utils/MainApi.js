import { apiConfig } from './constants';
import { getToken, setToken, removeToken } from '../components/TokenHelper/TokenHelper';

export class Api {
  constructor(config) {
    this.url = config.url;
    this.headers = config.headers;
  }

  // Метод для проверки ответа от сервера
  _checkResponse(res) {
    if (res.status === 204) {
      // Если ответ сервера "No Content" (код 204), возвращаем пустой объект
      return {};
    } else if (res.ok) {
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
      this.logoutUser();
      return Promise.reject(error.message);
    }
  }

  // Метод для "логаута" пользователя
  logoutUser() {

    removeToken();
  }

  async getAllUsers() {
    try {
      const res = await fetch(`${this.url}/users`, {
        headers: this._updateHeaders(),
      });
  
      return this._checkResponse(res);
    } catch (error) {
      console.error('Error fetching all users:', error);
      return Promise.reject(`Error fetching all users: ${error.message}`);
    }
  }

  async getUserInfo() {
   
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

  async getCardsWithUsername() {
    try {
      const res = await fetch(`${this.url}/cards`, {
        headers: this._updateHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        // Загружаем имя пользователя для каждой карточки
        const cardsWithUsername = await Promise.all(data.map(async card => {
          const user = await this.getUserById(card.owner);
          return { ...card, ownerName: user.username };
        }));
        return cardsWithUsername;
      }

      return Promise.reject(`Ошибка: ${res.status}`);
    } catch (error) {
      console.error('Error fetching cards with username:', error);
      return Promise.reject(`Error fetching cards with username: ${error.message}`);
    }
  }

  // Метод для получения информации о пользователе по его ID
  async getUserById(userId) {
    try {
      const res = await fetch(`${this.url}/users/${userId}`, {
        headers: this._updateHeaders(),
      });

      return this._checkResponse(res);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return Promise.reject(`Error fetching user by ID: ${error.message}`);
    }
  }

  async getUserByUsername(username) {
    try {
      const res = await fetch(`${this.url}/users/getByUsername`, {
        method: 'POST',
        headers: this._updateHeaders(),
        body: JSON.stringify({ username }),
      });
  
      return this._checkResponse(res);
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return Promise.reject(`Error fetching user by username: ${error.message}`);
    }
  }
  

  // Метод для обновления информации о пользователе на сервере
  async updateUserInfo(name, email, bio, age, username) {

    const res = await fetch(`${this.url}/users/me`, {
      method: 'PATCH',
      headers: this._updateHeaders(),
      body: JSON.stringify({
        name: name,
        email: email,
        bio: bio,
        age: age,
        username: username,

      })
    });

    const data = await this._checkResponse(res);
    return data;
  }

  async updateAvatar(avatarLink) {
    const res = await fetch(`${this.url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._updateHeaders(),
      body: JSON.stringify({
        avatar: avatarLink
      })
    });
    return this._checkResponse(res);
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
      return data;
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // Метод для получения карточек с сервера
  async getCards() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return Promise.reject('Токен отсутствует');
    }
    const res = await fetch(`${this.url}/cards`, {
      headers: this._updateHeaders(),
    });
    return this._checkResponse(res);
  }

// Метод для добавления новой карточки на сервер
async addCard(name, link) {
  const res = await fetch(`${this.url}/cards`, {
    method: 'POST',
    headers: this._updateHeaders(),
    body: JSON.stringify({
      name: name,
      link: link
    })
  });
  return this._checkResponse(res);
}

// Метод для удаления карточки с сервера
async deleteCard(cardId) {
   
  const res = await fetch(`${this.url}/cards/${cardId}`, {
    method: 'DELETE',
    headers: this._updateHeaders(),
  });
  return this._checkResponse(res);
}

//метод для лайка или дизлайка
async changeLikeCardStatus(cardId, isLiked) {
  const method = isLiked ? 'PUT' : 'DELETE';
  const res = await fetch(`${this.url}/cards/${cardId}/likes`, {
    method,
    headers: this._updateHeaders(),
  });
  return this._checkResponse(res);
}

//метод для получания всех чатов пользователя
async getUserChats() {
  try {
    const res = await fetch(`${this.url}/chats`, {
      method: 'GET',
      headers: this._updateHeaders(),
    });

    return this._checkResponse(res);
  } catch (error) {
    console.error('Error fetching user chats:', error);
    return Promise.reject(`Error fetching user chats: ${error.message}`);
  }
}


//метод для создания чатов
async createChat(user1Id, user2Id) {
  try {
    const res = await fetch(`${this.url}/chats`, {
      method: 'POST',
      headers: this._updateHeaders(),
      body: JSON.stringify({ user1Id, user2Id }),
    });

    return this._checkResponse(res);
  } catch (error) {
    console.error('Error creating chat:', error);
    return Promise.reject(`Error creating chat: ${error.message}`);
  }
}

//метод для отправки сообщения
async sendMessage(senderId, chatId, content) {
  try {
    const res = await fetch(`${this.url}/chats/messages`, {
      method: 'POST',
      headers: this._updateHeaders(),
      body: JSON.stringify({ senderId, chatId, content }),
    });

    return this._checkResponse(res);
  } catch (error) {
    console.error('Error sending message:', error);
    return Promise.reject(`Error sending message: ${error.message}`);
  }
}

async uploadImage (formData) {
  try {
    const res = await fetch(`${this.url}/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error);
    }

    const data = await res.json();
    return data; // Предполагается, что сервер возвращает URL загруженного изображения
  } catch (error) {
    throw error; // Проброс ошибки
  }
};

async clearChat(chatId) {
  try {
    const res = await fetch(`${this.url}/chats/${chatId}/clear`, {
      method: 'DELETE',
      headers: this._updateHeaders(),
    });

    return this._checkResponse(res);
  } catch (error) {
    console.error('Error clearing chat:', error);
    return Promise.reject(`Error clearing chat: ${error.message}`);
  }
}

async deleteChat(chatId) {
  try {
    const res = await fetch(`${this.url}/chats/${chatId}`, {
      method: 'DELETE',
      headers: this._updateHeaders(),
    });

    return this._checkResponse(res);
  } catch (error) {
    console.error('Error deleting chat:', error);
    return Promise.reject(`Error deleting chat: ${error.message}`);
  }
}

async getCardComments(cardId) {
  try {
    const res = await fetch(`${this.url}/cards/${cardId}/comments`, {
      method: 'GET',
      headers: this._updateHeaders(),
    });

    return this._checkResponse(res);
  } catch (error) {
    console.error('Error fetching card comments:', error);
    return Promise.reject(`Error fetching card comments: ${error.message}`);
  }
}

async addCommentToCard(cardId, commentText) {
  try {
    const res = await fetch(`${this.url}/cards/${cardId}/comments`, {
      method: 'POST',
      headers: this._updateHeaders(),
      body: JSON.stringify( commentText ),
    });

    return this._checkResponse(res);
  } catch (error) {
    console.error('Error adding comment to card:', error);
    return Promise.reject(`Error adding comment to card: ${error.message}`);
  }
}

async subscribeToUser(userId, currentUserID) {
  try {
    const res = await fetch(`${this.url}/users/${userId}/subscribe`, {
      method: 'POST',
      headers: this._updateHeaders(),
      body: JSON.stringify({ currentUserID }), // Отправляем ID текущего пользователя в теле запроса
    });
    return this._checkResponse(res);
  } catch (error) {
    console.error('Error subscribing to user:', error);
    return Promise.reject(`Error subscribing to user: ${error.message}`);
  }
}

async unsubscribeFromUser(userId, currentUserID) {
  try {
    const res = await fetch(`${this.url}/users/${userId}/unsubscribe`, {
      method: 'POST',
      headers: this._updateHeaders(),
      body: JSON.stringify({ currentUserID }), // Отправляем ID текущего пользователя в теле запроса
    });
    return this._checkResponse(res);
  } catch (error) {
    console.error('Error unsubscribing from user:', error);
    return Promise.reject(`Error unsubscribing from user: ${error.message}`);
  }
}

async deleteMessage(chatId, messageId) {
  try {
    const res = await fetch(`${this.url}/chats/${chatId}/messages/${messageId}`, {
      method: 'DELETE',
      headers: this._updateHeaders(),
    });

    return this._checkResponse(res);
  } catch (error) {
    console.error('Error deleting message:', error);
    return Promise.reject(`Error deleting message: ${error.message}`);
  }
}


}

export const api = new Api(apiConfig);