import React, { useEffect, useState } from 'react';
import './styles.css';
import { Link } from "react-router-dom";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Фильтры
  const [searchTerm, setSearchTerm] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedRAM, setSelectedRAM] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch('http://localhost:8000/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => setError('Ошибка загрузки товаров'))
      .finally(() => setLoading(false));
  }, []);

  // Получаем уникальные значения для фильтров
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const rams = [...new Set(products.map(p => p.ram).filter(Boolean))];
  const storages = [...new Set(products.map(p => p.storage).filter(Boolean))];

  // Фильтрация
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.processor?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
    const matchesRAM = selectedRAM ? product.ram == selectedRAM : true;
    const matchesStorage = selectedStorage ? product.storage == selectedStorage : true;
    const matchesStock = inStockOnly ? product.in_stock : true;

    return matchesSearch && matchesBrand && matchesRAM && matchesStorage && matchesStock;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="text-center">Загрузка...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container px-4 px-lg-5 mt-5">
      <div className="row">
        {/* Левая панель фильтров */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm p-4">
            <h5>Фильтры</h5>

            {/* Поиск */}
            <div className="mb-3">
              <label htmlFor="search" className="form-label">Поиск по товару</label>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Название, марка, модель..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Только в наличии */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="inStockOnly"
                checked={inStockOnly}
                onChange={() => setInStockOnly(!inStockOnly)}
              />
              <label className="form-check-label" htmlFor="inStockOnly">
                Только в наличии
              </label>
            </div>

            {/* Марка */}
            <div className="mb-3">
              <label htmlFor="brandFilter" className="form-label">Марка</label>
              <select
                id="brandFilter"
                className="form-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">Все</option>
                {brands.map((brand, i) => (
                  <option key={i} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* RAM */}
            <div className="mb-3">
              <label htmlFor="ramFilter" className="form-label">Память (ГБ)</label>
              <select
                id="ramFilter"
                className="form-select"
                value={selectedRAM}
                onChange={(e) => setSelectedRAM(e.target.value)}
              >
                <option value="">Все</option>
                {rams.sort().map((ram, i) => (
                  <option key={i} value={ram}>{ram} ГБ</option>
                ))}
              </select>
            </div>

            {/* Storage */}
            <div className="mb-3">
              <label htmlFor="storageFilter" className="form-label">Накопитель (ГБ)</label>
              <select
                id="storageFilter"
                className="form-select"
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
              >
                <option value="">Все</option>
                {storages.sort().map((storage, i) => (
                  <option key={i} value={storage}>{storage} ГБ</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Правый блок с товарами */}
        <div className="col-md-9">
          <h2 className="mb-4">Каталог товаров</h2>

          {/* Результаты */}
          <div className="row gx-4 gx-lg-5 row-cols-1 row-cols-md-3 row-cols-xl-3 justify-content-center">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="text-center text-muted">Товаров не найдено</div>
            )}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const addToCart = async (productId) => {
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
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) throw new Error('Ошибка добавления в корзину');

      alert('Товар добавлен в корзину');
    } catch (err) {
      console.error(err);
      alert('Ошибка добавления в корзину');
    }
  };

  return (
    <div className="col mb-4">
      <div className="card h-100 shadow-sm">
        {!product.in_stock && (
          <div className="badge bg-danger text-white position-absolute" style={{ top: "0.5rem", right: "0.5rem" }}>
            Нет в наличии
          </div>
        )}
        <img
          className="card-img-top"
          src={product.image}
          alt={product.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="fw-bolder">{product.name}</h5>
          <p className="text-muted">${parseFloat(product.price).toFixed(2)}</p>

          {/* Характеристики */}
          {product.brand && <small><strong>Марка:</strong> {product.brand}</small>}
          {product.model && <small><strong>Модель:</strong> {product.model}</small>}
          {product.screen_size && <small><strong>Экран:</strong> {product.screen_size}"</small>}
          {product.processor && <small><strong>Процессор:</strong> {product.processor}</small>}
          {product.cores && <small><strong>Ядер:</strong> {product.cores}</small>}
          {product.ram && <small><strong>RAM:</strong> {product.ram} ГБ</small>}
          {product.storage && <small><strong>Накопитель:</strong> {product.storage} ГБ</small>}
        </div>

        {/* Кнопки */}
        <div className="card-footer text-center">
          <div className="d-grid gap-2">
            <Link
              to={`/product/${product.id}`}
              className="btn btn-outline-dark"
            >
              Посмотреть карточку товара
            </Link>

            <button
              className="btn btn-outline-dark"
              onClick={() => addToCart(product.id)}
              disabled={!product.in_stock}
            >
              {product.in_stock ? 'Добавить в корзину' : 'Нет в наличии'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
