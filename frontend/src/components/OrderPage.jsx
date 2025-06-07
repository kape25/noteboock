import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get('http://localhost:8000/api/cart/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCartItems(res.data))
    .catch(() => alert('Ошибка загрузки корзины'));
  }, [token]);

  const handleOrder = () => {
    axios.post('http://localhost:8000/api/orders/', {
      payment_method: 'cash',
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('Заказ успешно оформлен!');
      navigate('/profile');
    })
    .catch(() => alert('Ошибка при оформлении заказа'));
  };

  return (
    <div className="container py-5">
      <h2>Оформление заказа</h2>
      <ul className="list-group">
        {cartItems.map(item => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            {item.product.name} x {item.quantity}
            <span>{item.product.price * item.quantity} BYN</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-end">
        <button className="btn btn-success" onClick={handleOrder}>Подтвердить заказ (наличные)</button>
      </div>
    </div>
  );
};