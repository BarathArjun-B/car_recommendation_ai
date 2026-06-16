import apiClient from './apiClient.js';

const testEndpoints = async () => {
  console.log(`Starting API Tests...`);
  const results = { passed: 0, failed: 0, errors: [] };

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      results.passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      results.failed++;
      results.errors.push(message);
    }
  };

  try {
    // 1. GET /api/cars (Pagination & Basic Load)
    let res = await apiClient.get('/api/cars');
    assert(res.status === 200, 'GET /api/cars returned 200 OK');
    assert(res.data.success === true, 'Response payload success flag is true');
    assert(Array.isArray(res.data.cars), 'Returned a cars array');
    assert(res.data.cars.length > 0, 'Cars array is not empty (DB populated)');
    
    const sampleCar = res.data.cars[0];
    const sampleId = sampleCar._id;

    // 2. GET /api/cars/:id (Single Car Details)
    res = await apiClient.get(`/api/cars/${sampleId}`);
    assert(res.status === 200, `GET /api/cars/${sampleId} returned 200 OK`);
    assert(res.data.car._id === sampleId, 'Returned correct car ID');

    // 3. Filtering by brand
    res = await apiClient.get(`/api/cars?brand=Tata`);
    assert(res.status === 200, 'GET /api/cars?brand=Tata returned 200 OK');
    if (res.data.cars.length > 0) {
      assert(res.data.cars.every(c => c.brand.toLowerCase() === 'tata'), 'All returned cars match brand filter');
    }

    // 4. Image URL verification
    assert(sampleCar.image_url && sampleCar.image_url.startsWith('http'), 'Car has a valid image URL');

  } catch (error) {
    console.error(`💥 [ERROR] Test suite crashed: ${error.message}`);
    if (error.response) console.error(error.response.data);
    results.failed++;
  }

  console.log('\n--- API TEST SUMMARY ---');
  console.log(`Passed: ${results.passed} | Failed: ${results.failed}`);
  if (results.errors.length > 0) console.log(`Errors:\n- ${results.errors.join('\n- ')}`);
  console.log('------------------------');
  process.exit(results.failed > 0 ? 1 : 0);
};

testEndpoints();
