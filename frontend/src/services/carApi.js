import apiClient from './apiClient.js';
import { API_ENDPOINTS } from '../config/endpoints.js';

export const fetchCars = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.cars, { params });
  return response.data;
};

export const fetchNewCars = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.newCars, { params });
  return response.data;
};

export const fetchUsedCars = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.usedCars, { params });
  return response.data;
};

export const fetchCarById = async (id) => {
  const response = await apiClient.get(`${API_ENDPOINTS.cars}/${id}`);
  return response.data;
};
