// Функция для сохранения токена в sessionStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Функция для получения токена из sessionStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Функция для удаления токена из sessionStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};
