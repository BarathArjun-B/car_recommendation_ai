import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/endpoints.js';

export const sendChatMessage = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.chat, payload);
  return response.data;
};
