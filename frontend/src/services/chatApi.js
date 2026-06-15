import apiClient from './apiClient';

export const sendChatMessage = async (payload) => {
  const response = await apiClient.post('/chat', payload);
  return response.data;
};
