// Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nickname: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input name="nickname" placeholder="Nickname" onChange={handleChange} className="form-control mb-2" required />
        <input name="email" placeholder="Email" onChange={handleChange} className="form-control mb-2" required />
        <input name="first_name" placeholder="Имя" onChange={handleChange} className="form-control mb-2" />
        <input name="last_name" placeholder="Фамилия" onChange={handleChange} className="form-control mb-2" />
        <input type="password" name="password" placeholder="Пароль" onChange={handleChange} className="form-control mb-2" required />
        <button className="btn btn-primary" type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default Register;
