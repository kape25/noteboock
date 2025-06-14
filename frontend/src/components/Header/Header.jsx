import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css'; // Модульные стили

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const count = localStorage.getItem('cartCount');
    setCartCount(count ? parseInt(count, 10) : 0);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <nav className="navbar navbar-expand-lg container py-3">
        <div className="container-fluid">

          {/* Логотип */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/logo.png" alt="LaptopShop Logo" height="40" className="me-2" />
          </Link>

          {/* Мобильный меню-тогглер */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Навигация + правый блок */}
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${styles.navLink}`} to="/">Главная</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${styles.navLink}`} to="/catalog">Ассортимент</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${styles.navLink}`} to="/about">О нас</Link>
              </li>
            </ul>

            <div className="d-flex flex-wrap align-items-center gap-2 justify-content-end">

              {/* Корзина */}
              <Link
                to="/cart"
                className="btn btn-outline-light position-relative"
                style={{ fontSize: '1.16rem', padding: '0.5rem 0.75rem' }}
              >
                <i className="bi bi-cart-fill me-1"></i>
                {cartCount > 0 && (
                  <span className={`badge position-absolute top-0 start-100 translate-middle rounded-pill ${styles.cartBadge}`}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Авторизован? */}
              {isAuthenticated ? (
                <>
                  <div className={`me-3 d-none d-md-block ${styles.userGreeting}`}>
                    {user?.is_staff || user?.is_superuser ? (
                      <span>Администратор, {user.nickname}</span>
                    ) : (
                      <span>Привет, {user.nickname}</span>
                    )}
                  </div>

                  {user?.is_staff || user?.is_superuser ? (
                    <Link className="btn btn-primary me-2" to="/admin/dashboard">
                      Админ панель
                    </Link>
                  ) : (
                    <Link className="btn btn-secondary me-2" to="/profile">
                      Профиль
                    </Link>
                  )}

                  <button className="btn btn-danger" onClick={handleLogout}>
                    Выход
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn btn-outline-light me-2" to="/login">
                    Вход
                  </Link>
                  <Link className="btn btn-success" to="/register">
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}


