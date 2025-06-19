// src/pages/About.jsx
// src/pages/AboutUs.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './AboutUs.css';

const AboutUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://127.0.0.1:8000/contact/', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setError('');
    } catch (err) {
      setError('Ошибка отправки сообщения. Попробуйте позже.');
    }
  };

  return (
    <Container className="about-us-page py-5">
      <Row className="mb-4 text-center">
        <Col>
          <p className="lead">Добро пожаловать </p>
        </Col>
      </Row>

      {/* Основная информация */}
      <Row className="mb-5">
        <Col md={8} className="mx-auto">
          <Card className="shadow-sm p-4">
            <h3>О магазине</h3>

<p>
  Торговый портал <strong>LaptopShop</strong> — первая площадка белорусской интернет-торговли. Наш маркетплейс помогает миллионам покупателей выбирать товары в интернет-магазинах Беларуси с апреля 2000 года.
</p>

<p>
  LaptopShop — белорусский проект: его делают белорусские специалисты для белорусских покупателей и интернет-магазинов.
</p>

<h5>Основные преимущества LaptopShop:</h5>
<ul>
  <li><strong>Предложения из 1 000 интернет-магазинов</strong> Минска и регионов Беларуси;</li>
  <li><strong>Поиск по более чем 3 000 000 товаров;</strong></li>
  <li><strong>Каталог с описаниями и изображениями</strong> более 500 000 моделей и свыше 1 400 типов товаров;</li>
  <li><strong>Десятки тысяч покупателей ежедневно;</strong></li>
  <li><strong>Годовая аудитория</strong> превышает 7 000 000 пользователей;</li>
  <li><strong>Возможность оформить предзаказ</strong> на понравившийся товар прямо на LaptopShop.</li>
</ul>

<h5>Направления развития:</h5>
<ul>
  <li>Мы видим будущее торговли в интернете и активно продвигаем развитие онлайн-продаж;</li>
  <li>Сотрудничаем только с <strong>официальными и легальными интернет-магазинами;</strong></li>
  <li>Делаем старт в интернет-торговле доступным даже для самых молодых бизнесов;</li>
  <li>Поддерживаем развитие интернет-торговли по всей территории Беларуси.</li>
</ul>
            <h3>Контакты</h3>
            <ul>
              <li>Telegram: <a href="https://t.me/kaper_pl"  target="_blank" rel="noopener noreferrer">@kaper_pl</a></li>
              <li>Instagram: <a href="https://www.instagram.com/kaper.pl/"  target="_blank" rel="noopener noreferrer">@kaper.pl</a></li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Форма обратной связи */}
      <Row className="mb-5">
        <Col md={6} className="mx-auto">
          <Card className="shadow-sm p-4">
            <h3>Свяжитесь с нами по почте</h3>
            {success && <Alert variant="success">Сообщение отправлено!</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Имя</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Сообщение</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Отправить
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;