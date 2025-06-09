import React, { useEffect, useState } from 'react';
import './ShopHomepage/FormOrders.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Форма оформления заказа
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    deliveryMethod: 'courier',
    paymentMethod: 'card'
  });

  const [errors, setErrors] = useState({});

  // Загрузка корзины
  const fetchCart = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/cart/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Ошибка загрузки корзины');

      const data = await response.json();
      const items = data.items || data;
      setCartItems(items);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
      setApiError('Не удалось загрузить корзину. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Удаление товара
  const handleRemove = async (id) => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Вы не авторизованы');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/cart/remove/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cart_item_id: id }),
      });

      if (!response.ok) throw new Error('Ошибка удаления товара');

      setCartItems(prev => prev.filter(item => item.id !== id));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Ошибка удаления товара:', err);
      setApiError('Не удалось удалить товар. Пожалуйста, попробуйте снова.');
    }
  };

  // Общая стоимость
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Валидация формы
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Введите имя';
    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    if (!formData.phone) newErrors.phone = 'Введите телефон';
    if (formData.deliveryMethod === 'courier' && !formData.address) {
      newErrors.address = 'Введите адрес доставки';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Отправка формы
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  const token = localStorage.getItem('access');
  if (!token) {
    alert('Вы не авторизованы');
    navigate('/login');
    return;
  }
  setIsSubmitting(true);
  setApiError(null);

  try {
    const orderData = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.deliveryMethod === 'courier' ? formData.address : '',
      delivery_method: formData.deliveryMethod,
      payment_method: formData.paymentMethod,
      items: cartItems.map(item => ({
        product_id: item.product, // Используем item.product как product_id
        quantity: item.quantity
      }))
    };

    console.log('Отправляемые данные:', orderData);

    const response = await fetch('http://localhost:8000/api/orders/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка ${response.status}`);
    }

    const result = await response.json();
    setOrderData(result);
    setShowCheckout(false);
    setCartItems([]);
    alert('Заказ успешно оформлен!');
  } catch (err) {
    console.error('Ошибка оформления заказа:', err);
    setApiError(err.message || 'Не удалось оформить заказ. Пожалуйста, проверьте данные и попробуйте снова.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="container px-4 px-lg-5 my-5">
      {/* Хлебные крошки */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/catalog">Каталог</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Корзина</li>
        </ol>
      </nav>

      {/* Сообщение об ошибке */}
      {apiError && (
        <div className="alert alert-danger alert-dismissible fade show">
          {apiError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setApiError(null)}
          />
        </div>
      )}

      {/* Корзина */}
      {!showCheckout ? (
        <>
          <h2 className="mb-4">Ваша корзина</h2>
          {cartItems.map(item => (
            <div key={item.id} className="card mb-3 shadow-sm">
              <div className="row g-0 align-items-center">
                <div className="col-md-2 p-3">
                  <img
                    src={item.image || '/default-image.jpg'}
                    alt={item.name}
                    className="img-fluid rounded"
                    style={{ maxHeight: '120px', objectFit: 'contain' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/default-image.jpg'; }}
                  />
                </div>
                <div className="col-md-7">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">Цена: <strong>{item.price} $</strong></p>
                    <p className="card-text">Количество: <strong>{item.quantity || 1}</strong></p>
                    <p className="card-text">Сумма: <strong>{(item.price * (item.quantity || 1)).toFixed(2)} $</strong></p>
                  </div>
                </div>
                <div className="col-md-3 d-flex align-items-center justify-content-center">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleRemove(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded">
            <h5 className="mb-0">Итого: <strong>{getTotalPrice()} $</strong></h5>
            <button
              className="btn btn-success btn-lg"
              onClick={() => setShowCheckout(true)}
              disabled={cartItems.length === 0}
            >
              Оформить заказ
            </button>
          </div>
        </>
      ) : (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Оформление заказа</h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCheckout(false)}
                disabled={isSubmitting}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Имя и фамилия</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="+7 (999) 999-99-99"
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Способ доставки</label>
                  <select
                    name="deliveryMethod"
                    value={formData.deliveryMethod}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="courier">Курьером</option>
                    <option value="pickup">Самовывоз</option>
                    <option value="post">Почта</option>
                  </select>
                </div>

                {formData.deliveryMethod === 'courier' && (
                  <div className="mb-3">
                    <label className="form-label">Адрес доставки</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      rows="3"
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                )}

                <div className="mb-4">
                  <label className="form-label">Способ оплаты</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="card">Картой онлайн</option>
                    <option value="cash">Наличными</option>
                    <option value="bank">Банковский перевод</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCheckout(false)}
                    disabled={isSubmitting}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Оформление...
                      </>
                    ) : 'Оформить заказ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

