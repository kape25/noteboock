import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

const Login = () => {
  const [form, setForm] = useState({ nickname: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/profile');
    } catch (err) {
      alert('Ошибка входа');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input name="nickname" placeholder="Nickname" onChange={handleChange} className="form-control mb-2" required />
        <input type="password" name="password" placeholder="Пароль" onChange={handleChange} className="form-control mb-2" required />
        <button className="btn btn-success">Войти</button>
      </form>
    </div>
  );
};

export default Login;
