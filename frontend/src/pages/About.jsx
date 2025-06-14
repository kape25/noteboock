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
          <h1 className="display-4">О нас</h1>
          <p className="lead">Добро пожаловать </p>
        </Col>
      </Row>

      {/* Основная информация */}
      <Row className="mb-5">
        <Col md={8} className="mx-auto">
          <Card className="shadow-sm p-4">
            <h3>Информаия магазина</h3>
            <p>
              Торговый портал LaptopShop — первая площадка белорусской интернет-торговли. Наш маркетплейс помогает миллионам покупателям выбирать товары в интернет-магазинах Беларуси с апреля 2000 года.

Shop.by — белорусский проект: его делают белорусские специалисты для белорусских покупателей и белорусских интернет-магазинов.

Торговый портал Shop.by это:

предложения из 1 000 интернет-магазинов Минска и регионов Беларуси;
поиск по более чем 3 000 000 товаров;
каталог товаров с описаниями и изображениями более 500 000 моделей и более 1 400 типов товаров;
десятки тысяч белорусских покупателей ежедневно;
годовая аудитория более 7 000 000 белорусских пользователей;
возможность оформить предзаказ на понравившийся товар прямо на Shop.by.
Shop.by работает на развитие интернет-торговли Беларуси:

мы видим интернет-магазин самой перспективной формой торговли и приводим покупателей на сайты интернет-магазинов;
мы работаем только с легальными интернет-магазинами — с теми, кто не скрывает своего имени и не собирается обманывать покупателя;
мы сделали старт в интернет-торговле доступным самому молодому бизнесу;
мы помогаем интернет-торговле работать по всей Беларуси.
            </p>
            <h3>Контакты</h3>
            <ul>
              <li>Email: <a href="and.pasha25@gmail.com">Gmail.com</a></li>
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
            <h3>Свяжитесь с нами</h3>
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