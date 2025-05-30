import { useEffect, useState } from 'react';
import { getProfile } from '../services/auth';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch(() => alert('Ошибка загрузки профиля'));
  }, []);

  if (!user) return <div className="container mt-5">Загрузка...</div>;

  return (
    <div className="container mt-5">
      <h2>Профиль</h2>
      {user.avatar && (
        <img
          src={`http://localhost:8000${user.avatar}`}
          alt="Avatar"
          width={100}
          height={100}
          className="mb-3"
        />
      )}
      <p><strong>Nickname:</strong> {user.nickname}</p>
      <p><strong>Имя:</strong> {user.first_name}</p>
      <p><strong>Фамилия:</strong> {user.last_name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Profile;
