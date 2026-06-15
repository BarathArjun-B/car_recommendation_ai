import axios from 'axios';

const testChat = async () => {
  try {
    const payload = {
      message: "I need a petrol SUV under 15 lakhs"
    };

    console.log('Testing POST /api/chat with payload:', payload);
    const response = await axios.post('http://localhost:5001/api/chat', payload);
    
    console.log('\n✅ Response received successfully!');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

testChat();
