import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import About from './pages/About';
import ShopHomepage from './pages/ShopHomepage';
import Catalog from './pages/ShopHomepage/catalog';
import ProductDetail from './pages/ShopHomepage/ProductDetail';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <div className="app d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<ShopHomepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Открытый маршрут */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>

      <Footer />

      {/* Toast уведомления */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <div id="successToast" className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">Успех!</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
          </div>
        </div>

        <div id="errorToast" className="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">Ошибка!</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

