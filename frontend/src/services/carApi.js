import apiClient from './apiClient.js';

export const fetchCars = async (params = {}) => {
  const response = await apiClient.get('/cars', { params });
  return response.data;
};

export const fetchNewCars = async (params = {}) => {
  const response = await apiClient.get('/cars/new', { params });
  return response.data;
};

export const fetchUsedCars = async (params = {}) => {
  const response = await apiClient.get('/cars/used', { params });
  return response.data;
};

export const fetchCarById = async (id) => {
  const response = await apiClient.get(`/cars/${id}`);
  return response.data;
};
