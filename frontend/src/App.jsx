import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { logout, isAuthenticated } from './services/auth';
import Laptops from "./pages/Laptop";
import LaptopList from "./components/LaptopList";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">LaptopShop</Link>
      <div className="navbar-nav">
        {!isAuthenticated() ? (
          <>
            <Link className="nav-link" to="/login">Вход</Link>
            <Link className="nav-link" to="/register">Регистрация</Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/profile">Профиль</Link>
            <button className="btn btn-link nav-link" onClick={handleLogout}>Выйти</button>
          </>
        )}
      </div>
    </nav>
  );
};

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<LaptopList />} />
        <Route path="/" element={<Laptops />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  </Router>
);

export default App;
