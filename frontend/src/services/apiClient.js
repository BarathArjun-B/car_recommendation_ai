import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://car-recommendation-ai.onrender.com' : 'http://localhost:5001'),
  timeout: 12000,
});

apiClient.interceptors.request.use((config) => {
  const currentUser = localStorage.getItem('bavh_user');
  const token = currentUser ? JSON.parse(currentUser)?.token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
