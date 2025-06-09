import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    logout();
    navigate('/login');
  };


  return (
    <header className="bg-white shadow-sm">
      <nav className="navbar navbar-expand-lg container">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/logo.png" alt="Logo" width="120" height="40" className="me-2" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/catalog">Ассортимент</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">О нас</Link>
              </li>
            </ul>

            <div className="d-flex gap-2">
              <form className="d-flex align-items-center ms-auto">
                <Link
                  to="/cart"
                  className="btn btn-outline-dark position-relative d-flex align-items-right"
                  style={{ fontSize: '1.16rem', padding: '0.25rem 0.5rem' }}
                >
                  <i className="bi-cart-fill me-1"></i>

                  <span className="badge bg-dark text-white ms-1 rounded-pill"></span>
                </Link>
              </form>
              {isAuthenticated ? (
                <>
                  <Link className="btn btn-outline-secondary me-2" to="/profile">Профиль</Link>
                  <button className="btn btn-danger" onClick={handleLogout}>Выход</button>
                </>
              ) : (
                <>
                  <Link className="btn btn-primary me-2" to="/login">Вход</Link>
                  <Link className="btn btn-success" to="/register">Регистрация</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}


// // Header.jsx
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Путь зависит от структуры
//
// export default function Header() {
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
//
//   const handleLogout = () => {
//     localStorage.removeItem('access');
//     localStorage.removeItem('refresh');
//     logout(); // обновляем состояние
//     navigate('/login');
//   };
//
//   return (
//     <header className="bg-white shadow-md">
//       <nav className="container mx-auto px-4 py-3 flex items-center justify-between navbar navbar-expand-lg">
//         {/* Логотип */}
//         <div className="navbar-brand">
//           <Link to="/">
//             <img src="/logo.png" alt="LaptopShop Logo" className="h-8 w-auto" />
//           </Link>
//         </div>
//
//         {/* Центральное меню */}
//         <div className="collapse navbar-collapse justify-content-center">
//           <ul className="navbar-nav">
//             <li className="nav-item">
//               <Link to="/catalog" className="nav-link">Ассортимент</Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/about" className="nav-link">О нас</Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/cart" className="nav-link">Корзина</Link>
//             </li>
//           </ul>
//         </div>
//
//         {/* Кнопки профиля/выхода или входа */}
//         <div className="d-flex gap-2">
//           {isAuthenticated ? (
//             <>
//               <Link to="/profile" className="btn btn-outline-secondary">Профиль</Link>
//               <button onClick={handleLogout} className="btn btn-danger">Выход</button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="btn btn-primary">Вход</Link>
//               <Link to="/register" className="btn btn-secondary">Регистрация</Link>
//             </>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// }

