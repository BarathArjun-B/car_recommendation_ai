import apiClient from './apiClient.js';
import dotenv from 'dotenv';

dotenv.config();

const testChatbot = async () => {
  try {
    const payload = {
      message: "I need an automatic SUV under 20 lakhs for a family of 5.",
      history: []
    };

    console.log('Sending message to AI Chatbot API:');
    console.log(`"${payload.message}"\n`);
    
    const response = await apiClient.post('/api/chat', payload);
    
    console.log('--- GEMINI EXTRACTED FILTERS ---');
    console.log(response.data.filters);
    
    console.log('\n--- RECOMMENDATION ENGINE COUNT ---');
    console.log(`Found ${response.data.recommendations.length} matching cars.`);

    if (response.data.recommendations.length > 0) {
      console.log('\n--- TOP MATCH ---');
      console.log(`${response.data.recommendations[0].car.brand} ${response.data.recommendations[0].car.model} (${response.data.recommendations[0].matchPercentage}%)`);
    }

    console.log('\n--- GEMINI AI EXPLANATION ---');
    console.log(response.data.aiExplanation);

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

testChatbot();
