import React, { useEffect, useState } from 'react';
import { fetchLaptops } from '../services/api';

const LaptopList = () => {
  const [laptops, setLaptops] = useState([]);

  useEffect(() => {
    fetchLaptops().then(response => setLaptops(response.data));
  }, []);

  return (
    <div>
      <h2>Ноутбуки</h2>
      <ul>
        {laptops.map(laptop => (
          <li key={laptop.id}>{laptop.name} - {laptop.price} BYN</li>
        ))}
      </ul>
    </div>
  );
};

export default LaptopList;
