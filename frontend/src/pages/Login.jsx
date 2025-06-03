// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // импортируем хук

export default function Login() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // получаем функцию login из контекста

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:8000/login/', {
        nickname,
        password
      });
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      login(); // <-- обновляем состояние авторизации
      navigate('/profile');
    } catch (error) {
      alert('Ошибка входа. Проверьте логин и пароль.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="mb-4 text-center">Вход</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nickname" className="form-label">Логин</label>
            <input
              type="text"
              id="nickname"
              className="form-control"
              placeholder="Введите логин"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}




