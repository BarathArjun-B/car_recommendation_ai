import axios from 'axios';
import axiosRetry from 'axios-retry';
import eventLogger from '../utils/eventLogger.js';

const client = axios.create({
  timeout: 5000,
});

axiosRetry(client, { 
  retries: 3, 
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429
});

export const fetchCarSpecsFromApiNinjas = async (make, model) => {
  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) return null;

  try {
    const response = await client.get('https://api.api-ninjas.com/v1/cars', {
      headers: { 'X-Api-Key': apiKey },
      params: { make, model },
    });

    if (response.data && response.data.length > 0) {
      eventLogger.emit('apiNinjasFetched', { make, model });
      return response.data[0];
    }
    return null;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('[AUTH ERROR] Invalid API Ninjas Key.');
    } else {
      console.error(`[API ERROR] API Ninjas fetch failed for ${make} ${model}:`, error.message);
    }
    return null; // Gracefully degrade
  }
};
