import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nickname: '',
    first_name: '',
    last_name: '',
    email: '',
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загружаем профиль при монтировании
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await axios.get('http://localhost:8000/profile/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = res.data;
        setUser(userData);
        setFormData({
          nickname: userData.nickname || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          avatar: null,
        });
      } catch (e) {
        alert('Ошибка загрузки профиля');
      }
    };
    fetchProfile();
  }, []);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' && files.length > 0) {
      setFormData((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('access');

    const data = new FormData();
    data.append('nickname', formData.nickname);
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('email', formData.email);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    try {
      const res = await axios.put('http://localhost:8000/profile/update/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(res.data); // Обновляем данные пользователя
      alert('Данные успешно обновлены!');
    } catch (err) {
      setError('Не удалось сохранить изменения. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-5">Загрузка...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Профиль</h2>

      {/* Аватар */}
      <div className="text-center mb-4">
        {user.avatar ? (
          <img
            src={`http://localhost:8000${user.avatar}`}
            alt="Аватар"
            className="rounded-circle"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        ) : (
          <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px' }}>
            <span className="text-white">Нет аватара</span>
          </div>
        )}
      </div>

      {/* Форма редактирования */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="nickname" className="form-label">Никнейм</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              className="form-control"
              value={formData.nickname}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="first_name" className="form-label">Имя</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-control"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="last_name" className="form-label">Фамилия</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-control"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="avatar" className="form-label">Аватар</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            className="form-control"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
}