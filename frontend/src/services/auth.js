import axios from 'axios';
import axiosInstance from "./axiosInstance";

const API_URL = 'http://localhost:8000/api/';

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}register/`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export { register };

export const login = async (data) => {
  const res = await axiosInstance.post('/token/', data);
  localStorage.setItem('access', res.data.access);
  localStorage.setItem('refresh', res.data.refresh);
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

export const getProfile = async () => {
  const res = await axiosInstance.get('/profile/');
  return res.data;
};

export const isAuthenticated = () => !!localStorage.getItem('access');



