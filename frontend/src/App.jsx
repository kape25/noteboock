import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import About from './pages/About';
import ShopHomepage from './pages/ShopHomepage';
import Catalog from './pages/ShopHomepage/catalog'
import ProductDetail from "./pages/ShopHomepage/ProductDetail";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/" element={<ShopHomepage />} /> {/* Новый маршрут */}
      </Routes>
    </>
  );
}

export default App;
