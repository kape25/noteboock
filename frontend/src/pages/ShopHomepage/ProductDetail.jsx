import React, { useEffect, useState } from 'react';
import './FormOrders.css';
import { useParams, Link } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    deliveryMethod: 'courier',
    paymentMethod: 'card'
  });
  const [errors, setErrors] = useState({});

  const isProductLoaded = product && !loading && !error;

  // Загрузка товара
  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error('Товар не найден');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Функция добавления в корзину
    const addToCart = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          alert('Вы не авторизованы');
          return;
        }

        const response = await fetch('http://localhost:8000/api/cart/add/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });

        if (!response.ok) throw new Error('Ошибка добавления в корзину');

        alert('Товар добавлен в корзину');
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (err) {
        console.error(err);
        alert('Ошибка добавления в корзину');
      }
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
    if (!product?.id) {
      alert('Ошибка: товар не загружен');
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        alert('Вы не авторизованы');
        return;
      }

      const orderData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.deliveryMethod === 'courier' ? formData.address : '',
        delivery_method: formData.deliveryMethod,
        payment_method: formData.paymentMethod,
        items: [{ product_id: product.id, quantity: 1 }],
      };

      const response = await fetch('http://localhost:8000/api/orders/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Ошибка оформления заказа');

      alert('Заказ оформлен!');
      setShowCheckout(false);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error(err);
      alert('Ошибка оформления заказа');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-danger">Ошибка: {error}</div>;
  if (!product) return <div>Товар не найден</div>;

  return (
    <div className="container px-4 px-lg-5 my-5">
      {/* Хлебные крошки */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/catalog">Каталог</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {/* Основной контент */}
      <div className="row gx-4 gx-lg-5 align-items-center">
        <div className="col-md-6">
          <img
            className="card-img-top mb-5 mb-md-0"
            src={product.image}
            alt={product.name}
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>

        <div className="col-md-6">
          <h1 className="display-5 fw-bolder">{product.name}</h1>
          <div className="fs-5 mb-3">
            <span>${parseFloat(product.price).toFixed(2)}</span>
          </div>

          <p className="lead">{product.description}</p>

          {/* Характеристики */}
          <div className="d-flex flex-column gap-2 mt-4">
            <div className="d-flex align-items-center">
              <strong className="me-2">Марка:</strong> {product.brand || '—'}
            </div>
            <div className="d-flex align-items-center">
              <strong className="me-2">Модель:</strong> {product.model || '—'}
            </div>
            <div className="d-flex align-items-center">
              <strong className="me-2">Экран:</strong> {product.screen_size || '—'}
            </div>
            <div className="d-flex align-items-center">
              <strong className="me-2">Процессор:</strong> {product.processor || '—'}
            </div>
            <div className="d-flex align-items-center">
              <strong className="me-2">RAM:</strong> {product.ram ? `${product.ram} ГБ` : '—'}
            </div>
            <div className="d-flex align-items-center">
              <strong className="me-2">Накопитель:</strong> {product.storage ? `${product.storage} ГБ` : '—'}
            </div>
            <div className="d-flex align-items-center">
              <strong className="me-2">Ядер:</strong> {product.cores || '—'}
            </div>
            <div className="d-flex align-items-center">
              <strong className="me-2">В наличии:</strong>
              {product.in_stock ? (
                <span className="text-success">Да ({product.stock} шт.)</span>
              ) : (
                <span className="text-danger">Нет</span>
              )}
            </div>
          </div>

          {/* Кнопки */}
          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-outline-dark flex-grow-1"
              onClick={addToCart}
              disabled={!isProductLoaded || !product.in_stock}
            >
              {product?.in_stock ? 'Добавить в корзину' : 'Нет в наличии'}
            </button>
            <button
              className="btn btn-dark flex-grow-1"
              onClick={() => setShowCheckout(true)}
              disabled={!isProductLoaded || !product.in_stock}
            >
              Купить сейчас
            </button>
          </div>
        </div>
      </div>

      {/* Форма оформления заказа (модальное окно) */}
      {showCheckout && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Оформление заказа</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Имя и фамилия</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'is-invalid' : ''}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'is-invalid' : ''}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'is-invalid' : ''}
                  placeholder="+7 (999) 999-99-99"
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
              <div className="form-group">
                <label>Способ доставки</label>
                <select
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleChange}
                >
                  <option value="courier">Курьером</option>
                  <option value="pickup">Самовывоз</option>
                  <option value="post">Почта</option>
                </select>
              </div>
              {formData.deliveryMethod === 'courier' && (
                <div className="form-group">
                  <label>Адрес доставки</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'is-invalid' : ''}
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
              )}
              <div className="form-group">
                <label>Способ оплаты</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="card">Картой онлайн</option>
                  <option value="cash">Наличными</option>
                  <option value="bank">Банковский перевод</option>
                </select>
              </div>
              <div className="form-actions">
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
                  {isSubmitting ? 'Отправка...' : 'Оформить заказ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;