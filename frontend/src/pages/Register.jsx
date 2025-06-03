import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // импортируем хук

export default function Register() {
  const [form, setForm] = useState({
    nickname: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const navigate = useNavigate();
  const { login } = useAuth(); // получаем функцию login

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/register/', form);
      localStorage.setItem('access', 'temp_token'); // временный токен или можно получить из ответа
      login(); // <-- обновляем состояние
      navigate('/login');
    } catch (error) {
      alert('Ошибка регистрации. Проверьте данные.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '500px' }}>
        <h4 className="mb-4 text-center">Регистрация</h4>
        <form onSubmit={handleSubmit}>
          {/* Nickname */}
          <div className="mb-3">
            <label htmlFor="nickname" className="form-label">Никнейм</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              className="form-control"
              placeholder="Введите никнейм"
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
              placeholder="Введите email"
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
              placeholder="Введите имя"
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
              placeholder="Введите фамилию"
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
              placeholder="Введите пароль"
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
