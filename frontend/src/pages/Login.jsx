import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post('http://localhost:8000/login/', {
        nickname,
        password
      });

      // Сохраняем токены
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      // Логиним пользователя с полученными данными
      login({
        nickname: data.user.nickname,
        email: data.user.email,
        isAdmin: data.user.is_staff || data.user.is_superuser,
        token: data.access
      });

      // Перенаправляем в зависимости от роли
      if (data.user.is_staff || data.user.is_superuser) {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      setError('Ошибка входа. Проверьте логин и пароль.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="mb-4 text-center">Вход</h4>
        {error && <div className="alert alert-danger">{error}</div>}
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




