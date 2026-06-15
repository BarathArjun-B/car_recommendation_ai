import apiClient from './apiClient';

export const getRecommendations = async (preferences) => {
  const response = await apiClient.post('/recommendations', preferences);
  return response.data;
};
