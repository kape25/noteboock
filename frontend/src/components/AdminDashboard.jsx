import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card, Form, Button } from 'react-bootstrap';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalCost: 0,
    totalOrders: 0,
  });

  const [pagination, setPagination] = useState({
    userPage: 1,
    orderPage: 1,
    userCount: 0,
    orderCount: 0,
    userPages: 1,
    orderPages: 1,
  });

  const [filters, setFilters] = useState({
    period: 'all',
    searchUser: '',
    searchOrder: '',
  });

  const deliveryMethods = {
    courier: 'Курьером',
    pickup: 'Самовывоз',
    post: 'Почта',
  };

  const paymentMethods = {
    card: 'Картой',
    cash: 'Наличными',
    bank: 'Банковский перевод',
  };

  const orderStatuses = {
    pending: 'В ожидании',
    confirmed: 'Оплачен',
    shipped: 'Отправлен',
    cancelled: 'Отменён',
  };

  const token = localStorage.getItem('access'); // Получаем токен

  // Загрузка данных
  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        period: filters.period,
        search_user: filters.searchUser,
        search_order: filters.searchOrder,
        user_page: pagination.userPage,
        order_page: pagination.orderPage,
      });

      const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/?${params}`);
      const data = response.data;

      setUsers(data.users || []);
      setOrders(data.orders || []);

      setPagination({
        ...pagination,
        userCount: data.user_pagination.count,
        orderCount: data.order_pagination.count,
        userPages: data.user_pagination.num_pages,
        orderPages: data.order_pagination.num_pages,
      });

      setStats({
        totalCost: data.total_cost || 0,
        totalOrders: data.total_orders || 0,
      });
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  // Обработчики поиска
  const handleSearchUser = (e) => {
    setFilters({ ...filters, searchUser: e.target.value });
    setPagination({ ...pagination, userPage: 1 });
  };

  const handleSearchOrder = (e) => {
    setFilters({ ...filters, searchOrder: e.target.value });
    setPagination({ ...pagination, orderPage: 1 });
  };

  // Пагинация пользователей
  const goToNextUserPage = () => {
    if (pagination.userPage < pagination.userPages) {
      setPagination({ ...pagination, userPage: pagination.userPage + 1 });
    }
  };

  const goToPrevUserPage = () => {
    if (pagination.userPage > 1) {
      setPagination({ ...pagination, userPage: pagination.userPage - 1 });
    }
  };

  // Пагинация заказов
  const goToNextOrderPage = () => {
    if (pagination.orderPage < pagination.orderPages) {
      setPagination({ ...pagination, orderPage: pagination.orderPage + 1 });
    }
  };

  const goToPrevOrderPage = () => {
    if (pagination.orderPage > 1) {
      setPagination({ ...pagination, orderPage: pagination.orderPage - 1 });
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      alert('Не удалось удалить пользователя');
    }
  };

  // Изменение статуса заказа
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/orders/${orderId}/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
      alert('Не удалось обновить статус');
    }
  };

  // Удаление заказа
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Ошибка при удалении заказа:', error);
      alert('Не удалось удалить заказ');
    }
  };

  // Автообновление данных
  useEffect(() => {
    fetchData();
  }, [filters, pagination.userPage, pagination.orderPage]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📊 Админ панель</h2>

      {/* Фильтр по времени */}
      <Form.Group className="mb-3 d-flex align-items-center">
        <Form.Label className="me-2 mb-0">Период:</Form.Label>
        <Form.Select value={filters.period} onChange={(e) => setFilters({ ...filters, period: e.target.value })} style={{ width: 'auto' }}>
          <option value="all">Все время</option>
          <option value="day">Сегодня</option>
          <option value="week">Эта неделя</option>
          <option value="month">Этот месяц</option>
        </Form.Select>
      </Form.Group>

      {/* Поиск */}
      <div className="row mb-3">
        <div className="col-md-6">
          <Form.Control
            type="text"
            placeholder="Поиск по пользователям (никнейм или email)"
            value={filters.searchUser}
            onChange={handleSearchUser}
          />
        </div>
        <div className="col-md-6">
          <Form.Control
            type="text"
            placeholder="Поиск по заказам (ID или имя)"
            value={filters.searchOrder}
            onChange={handleSearchOrder}
          />
        </div>
      </div>

      {/* Статистика */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <Card bg="info" text="white">
            <Card.Body>
              <Card.Title>Пользователи</Card.Title>
              <Card.Text className="display-5">{users.length}</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card bg="success" text="white">
            <Card.Body>
              <Card.Title>Заказы</Card.Title>
              <Card.Text className="display-5">{stats.totalOrders}</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card bg="warning" text="dark">
            <Card.Body>
              <Card.Title>Общая сумма</Card.Title>
              <Card.Text className="display-5">{stats.totalCost.toFixed(2)} ₽</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Таблицы */}
      <div className="row">
        {/* Пользователи */}
        <div className="col-md-6">
          <h5>👤 Пользователи</h5>
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Никнейм</th>
                <th>Email</th>
                <th>Имя</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nickname}</td>
                  <td>{user.email}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Пагинация пользователей */}
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={goToPrevUserPage} disabled={pagination.userPage === 1}>
              Назад
            </Button>
            <span>Страница {pagination.userPage} из {pagination.userPages}</span>
            <Button variant="secondary" onClick={goToNextUserPage} disabled={pagination.userPage >= pagination.userPages}>
              Вперёд
            </Button>
          </div>
        </div>

        {/* Заказы */}
        <div className="col-md-6">
          <h5>🛍️ Заказы</h5>
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Клиент</th>
                <th>Цена</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.full_name}</td>
                  <td>{parseFloat(order.total_price).toFixed(2)} ₽</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <Form.Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ width: '150px' }}
                    >
                      {Object.entries(orderStatuses).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Пагинация заказов */}
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={goToPrevOrderPage} disabled={pagination.orderPage === 1}>
              Назад
            </Button>
            <span>Страница {pagination.orderPage} из {pagination.orderPages}</span>
            <Button variant="secondary" onClick={goToNextOrderPage} disabled={pagination.orderPage >= pagination.orderPages}>
              Вперёд
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;