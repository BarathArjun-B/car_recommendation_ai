import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
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
