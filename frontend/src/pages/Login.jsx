import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
            // Получаем токены
            const response = await axios.post('http://localhost:8000/login/', {
                nickname,
                password,
            });

            // Сохраняем токены
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);

            // Получаем данные пользователя
            const userResponse = await axios.get('http://localhost:8000/profile/me/', {
                headers: {
                    Authorization: `Bearer ${response.data.access}`,
                },
            });

            // Логиним пользователя
            login({
                access: response.data.access,
                refresh: response.data.refresh,
                user: userResponse.data,
            });

            // Перенаправляем в зависимости от роли
            if (userResponse.data.is_staff || userResponse.data.is_superuser) {
                navigate('/admin/dashboard');
            } else {
                navigate('/profile');
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            setError('Ошибка входа. Проверьте логин и пароль.');
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




