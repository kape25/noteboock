import { Link } from 'react-router-dom';

const LaptopCard = ({ laptop }) => (
  <div className="col-md-4 mb-4">
    <div className="card">
      <img src={laptop.image} className="card-img-top" alt={laptop.name} />
      <div className="card-body">
        <h5 className="card-title">{laptop.name}</h5>
        <p className="card-text">{laptop.brand}</p>
        <p className="card-text">{laptop.price} BYN</p>
        <Link to={`/laptops/${laptop.id}`} className="btn btn-primary">Подробнее</Link>
      </div>
    </div>
  </div>
);
export default LaptopCard;
