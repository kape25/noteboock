import { useEffect, useState } from 'react';
import { fetchLaptops } from '../services/api';
import LaptopCard from '../components/LaptopCard';

const Laptops = () => {
  const [laptops, setLaptops] = useState([]);

  useEffect(() => {
    getLaptops().then(setLaptops);
  }, []);

  return (
    <div className="container">
      <h2 className="mt-4">Каталог ноутбуков</h2>
      <div className="row">
        {laptops.map(laptop => (
          <LaptopCard key={laptop.id} laptop={laptop} />
        ))}
      </div>
    </div>
  );
};

export default Laptops;
