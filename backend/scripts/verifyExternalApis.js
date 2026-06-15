import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const verifyApis = async () => {
  console.log('--- EXTERNAL API DIAGNOSTICS START ---\n');
  let failures = 0;

  // 1. API Ninjas Test
  console.log('Testing API Ninjas...');
  const apiNinjasKey = process.env.API_NINJAS_KEY;
  if (!apiNinjasKey || apiNinjasKey.includes('your_')) {
    console.error('❌ [FAIL] API Ninjas Key is missing or invalid.');
    failures++;
  } else {
    try {
      const start = Date.now();
      const res = await axios.get('https://api.api-ninjas.com/v1/cars', {
        headers: { 'X-Api-Key': apiNinjasKey },
        params: { make: 'Toyota', model: 'Camry' },
        timeout: 5000
      });
      console.log(`✅ [PASS] API Ninjas authenticated successfully in ${Date.now() - start}ms.`);
      if (res.data && res.data.length > 0) {
        console.log(`   └─ Data payload is valid. Example response: ${res.data[0].make} ${res.data[0].model}`);
      } else {
        console.error('❌ [FAIL] API Ninjas returned an empty array for Toyota Camry.');
        failures++;
      }
    } catch (error) {
      console.error(`❌ [FAIL] API Ninjas request failed: ${error.message}`);
      if (error.response) console.error(`   └─ Status: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      failures++;
    }
  }

  // 2. Unsplash Test
  console.log('\nTesting Unsplash...');
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey || unsplashKey.includes('your_')) {
    console.error('❌ [FAIL] Unsplash Key is missing or invalid.');
    failures++;
  } else {
    try {
      const start = Date.now();
      const res = await axios.get('https://api.unsplash.com/search/photos', {
        headers: { Authorization: `Client-ID ${unsplashKey}` },
        params: { query: 'car', per_page: 1 },
        timeout: 5000
      });
      console.log(`✅ [PASS] Unsplash authenticated successfully in ${Date.now() - start}ms.`);
      if (res.data && res.data.results && res.data.results.length > 0) {
        console.log(`   └─ Image payload valid. URL: ${res.data.results[0].urls.regular.substring(0,40)}...`);
      } else {
        console.error('❌ [FAIL] Unsplash returned zero images for "car".');
        failures++;
      }
    } catch (error) {
      console.error(`❌ [FAIL] Unsplash request failed: ${error.message}`);
      if (error.response) console.error(`   └─ Status: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      failures++;
    }
  }

  console.log(`\n--- EXTERNAL API DIAGNOSTICS END ---`);
  console.log(`Failures Detected: ${failures}`);
  process.exit(failures > 0 ? 1 : 0);
};

verifyApis();
