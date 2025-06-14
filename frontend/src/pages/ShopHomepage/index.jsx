import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import { useNotification } from '../../context/NotificationContext';
import Hero from '../../components/Hero/Hero'; // ✅ импорт Hero

// Стили слайдера
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ShopHomepage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccessToast, showErrorToast } = useNotification();

  useEffect(() => {
    fetch('http://localhost:8000/api/products/')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(() => setError('Ошибка загрузки товаров'))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        showErrorToast('Вы не авторизованы');
        return;
      }

      const response = await fetch('http://localhost:8000/api/cart/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) throw new Error('Ошибка добавления в корзину');

      showSuccessToast('Товар успешно добавлен в корзину!');
    } catch (err) {
      showErrorToast(err.message || 'Ошибка добавления в корзину');
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const featuredProducts = products.slice(0, 6);

  return (
    <div>
      {/* ✅ Hero секция */}
      <Hero />

      {/* Слайдер товаров */}
      <section className="py-5 bg-light">
        <div className="container px-4 px-lg-5">
          <h2 className="text-center mb-4">Популярные товары</h2>
          <Slider {...sliderSettings}>
            {featuredProducts.map(product => (
              <div key={product.id} className="px-2">
                <ProductCard
                  title={product.name}
                  price={`BYN ${product.price}`}
                  image={product.image}
                  inStock={product.in_stock}
                  stock={product.stock}
                  productId={product.id}
                  addToCart={addToCart}
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ title, price, image, inStock, stock, productId, addToCart }) => (
  <div className="card h-100 shadow-sm">
    {!inStock && (
      <div className="badge bg-danger text-white position-absolute" style={{ top: "0.5rem", right: "0.5rem" }}>
        Нет в наличии
      </div>
    )}
    <img className="card-img-top" src={image} alt={title} />
    <div className="card-body p-4">
      <div className="text-center">
        <h5 className="fw-bolder">{title}</h5>
        <div>{price}</div>
        <small>В наличии: {stock}</small>
      </div>
    </div>
    <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
      <div className="text-center">
        <button
          className="btn btn-outline-dark mt-auto"
          onClick={() => addToCart(productId)}
          disabled={!inStock}
        >
          {inStock ? 'Добавить в корзину' : 'Нет в наличии'}
        </button>
      </div>
    </div>
  </div>
);

export default ShopHomepage;
