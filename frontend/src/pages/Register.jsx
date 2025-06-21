import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Предположим, что login есть в AuthContext

export default function Register() {
  const [form, setForm] = useState({
    nickname: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // получаем функцию login из контекста

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Регистрация на бэкенде
      const response = await axios.post('http://localhost:8000/register/', form);

      if (response.status === 201 || response.status === 200) {
        alert('Регистрация успешна!');

        // Если бэкенд возвращает токены — автоматически логиним пользователя
        if (response.data.access && response.data.refresh && response.data.user) {
          login({
            access: response.data.access,
            refresh: response.data.refresh,
            user: response.data.user,
          });
        }

        navigate('/login'); // перенаправляем на профиль
      }
    } catch (err) {
      console.error('Ошибка регистрации:', err);

      // Более точная обработка ошибок
      let errMsg = 'Ошибка регистрации. Проверьте данные.';

      if (err.response?.data?.detail) {
        errMsg = err.response.data.detail;
      } else if (err.response?.data?.email?.[0]) {
        errMsg = err.response.data.email[0];
      } else if (err.response?.data?.password?.[0]) {
        errMsg = err.response.data.password[0];
      } else if (err.response?.data?.nickname?.[0]) {
        errMsg = err.response.data.nickname[0];
      } else if (err.response?.data?.first_name?.[0]) {
        errMsg = err.response.data.first_name[0];
      } else if (err.response?.data?.last_name?.[0]) {
        errMsg = err.response.data.last_name[0];
      }

      setError(errMsg);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '500px' }}>
        <h4 className="mb-4 text-center">Регистрация</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Nickname */}
          <div className="mb-3">
            <label htmlFor="nickname" className="form-label">Никнейм</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              className="form-control"
              value={form.nickname}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* First Name */}
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">Имя</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-control"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">Фамилия</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-control"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-success w-100 mt-3">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}
