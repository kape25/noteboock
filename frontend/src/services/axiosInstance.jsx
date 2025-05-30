import axios from 'axios';

const baseURL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👉 Интерцептор для автоматического обновления токена
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh')
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${baseURL}/token/refresh/`, {
          refresh: localStorage.getItem('refresh'),
        });

        localStorage.setItem('access', res.data.access);

        axiosInstance.defaults.headers.Authorization = `Bearer ${res.data.access}`;
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// 👉 Добавление access токена в каждый запрос
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
