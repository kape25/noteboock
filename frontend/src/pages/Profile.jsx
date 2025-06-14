import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { orderStatuses } from '../utils/translate';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    nickname: '',
    first_name: '',
    last_name: '',
    email: '',
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState('');
  const [ordersError, setOrdersError] = useState('');

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

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await axios.get('http://localhost:8000/api/orders/my/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (e) {
        setOrdersError('Не удалось загрузить список заказов');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchProfile();
    fetchOrders();
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

  if (!user) return <div className="text-center mt-5">Загрузка профиля...</div>;

  return (
    <Container className="mt-4">
      {/* Аватар + Информация */}
      <Row className="align-items-center mb-4">
        <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
          {user.avatar ? (
            <img
              src={`http://localhost:8000${user.avatar}`}
              alt="Аватар"
              className="rounded-circle img-fluid"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
              style={{ width: '150px', height: '150px', margin: '0 auto' }}
            >
              Нет аватара
            </div>
          )}
        </Col>

        <Col xs={12} md={9}>
          <Card className="shadow-sm p-3">
            <h4>Информация</h4>
            <hr />
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Row>
                <Col md={6}>
                  <div className="mb-3">
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
                  <div className="mb-3">
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
                </Col>
                <Col md={6}>
                  <div className="mb-3">
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
                  <div className="mb-3">
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
                </Col>
              </Row>

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

              <Button variant="success" type="submit" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </form>
          </Card>
        </Col>
      </Row>

      {/* История заказов */}
      <h4 className="mt-4 mb-3">Ваши заказы</h4>
      {ordersLoading ? (
        <p className="text-center">Загрузка заказов...</p>
      ) : ordersError ? (
        <div className="alert alert-danger">{ordersError}</div>
      ) : orders.length === 0 ? (
        <p className="text-center">У вас пока нет заказов.</p>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead className="table-dark">
            <tr>
              <th>Номер заказа</th>
              <th>Дата</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{parseFloat(order.total_price).toFixed(2)} ₽</td>
                <td>{orderStatuses[order.status] || order.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}