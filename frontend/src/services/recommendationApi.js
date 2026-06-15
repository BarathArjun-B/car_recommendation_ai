import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/endpoints.js';

export const getRecommendations = async (preferences) => {
  const response = await apiClient.post(API_ENDPOINTS.recommendations, preferences);
  return response.data;
};
