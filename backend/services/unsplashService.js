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

export const fetchCarImageFromUnsplash = async (brand, model) => {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!apiKey) return null;

  try {
    const query = `${brand} ${model} car`;
    const response = await client.get('https://api.unsplash.com/search/photos', {
      headers: { Authorization: `Client-ID ${apiKey}` },
      params: { query, per_page: 1, orientation: 'landscape' },
    });

    if (response.data && response.data.results && response.data.results.length > 0) {
      const photo = response.data.results[0];
      eventLogger.emit('unsplashFetched', { brand, model, photoId: photo.id });
      return {
        url: photo.urls.regular,
        id: photo.id,
      };
    }
    return null;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('[AUTH ERROR] Invalid Unsplash Key.');
    } else {
      console.error(`[API ERROR] Unsplash fetch failed for ${brand} ${model}:`, error.message);
    }
    return null;
  }
};
