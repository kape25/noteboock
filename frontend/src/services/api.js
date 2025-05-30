import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchLaptops = () => axios.get(`${API_URL}/laptops/`);
export const fetchOrders = () => axios.get(`${API_URL}/orders/`);
