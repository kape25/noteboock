import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверяем токен при загрузке
  useEffect(() => {
    const token = localStorage.getItem('access');
    const storedUser = localStorage.getItem('user'); // Получаем данные пользователя

    // Проверяем, что данные пользователя существуют
    if (token && storedUser) {
      try {
        // Попытка распарсить данные пользователя
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя:', error);
        // Очищаем localStorage, если данные повреждены
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData) => {
    // Сохраняем токены в localStorage
    localStorage.setItem('access', userData.access);
    localStorage.setItem('refresh', userData.refresh);
    localStorage.setItem('user', JSON.stringify(userData.user));

    setUser(userData.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);