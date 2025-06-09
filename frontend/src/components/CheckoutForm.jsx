import React, { useState } from 'react';
import './CheckoutForm.css';

const CheckoutForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    deliveryMethod: initialData.deliveryMethod || 'courier',
    paymentMethod: initialData.paymentMethod || 'card',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Введите имя';
    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    if (!formData.phone) newErrors.phone = 'Введите телефон';
    if (!formData.address && formData.deliveryMethod === 'courier') {
      newErrors.address = 'Введите адрес доставки';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
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
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="btn btn-primary">
          Оформить заказ
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;