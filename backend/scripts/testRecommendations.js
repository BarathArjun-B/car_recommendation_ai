import apiClient from './apiClient.js';
import dotenv from 'dotenv';

dotenv.config();

const testRecommendations = async () => {
  try {
    const preferences = {
      budget: 12,
      familySize: 4,
      usage: 'City',
      fuelType: 'Petrol',
      condition: 'used',
      transmission: 'Automatic'
    };

    console.log('Testing Recommendation API with preferences:', preferences);
    
    const response = await apiClient.post('/api/recommendations', preferences);
    
    console.log(`\nSuccessfully received ${response.data.count} recommendations!`);
    console.log('--- TOP MATCH ---');
    console.log(JSON.stringify(response.data.data[0], null, 2));

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

testRecommendations();
