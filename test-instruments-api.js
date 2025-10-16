// Test script to check instruments API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:4000'; // algo-backend-new runs on port 4000

async function testInstrumentsAPI() {
  console.log('Testing Instruments API endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  try {
    // Test 2: Popular instruments
    console.log('\n2. Testing popular instruments...');
    const popularResponse = await axios.get(`${BASE_URL}/api/instruments/popular`);
    console.log('✅ Popular instruments:', popularResponse.data);
  } catch (error) {
    console.log('❌ Popular instruments failed:', error.response?.data || error.message);
  }

  try {
    // Test 3: Instruments by category
    console.log('\n3. Testing instruments by category (options)...');
    const categoryResponse = await axios.get(`${BASE_URL}/api/instruments/category/options?page=1&limit=10`);
    console.log('✅ Category instruments:', categoryResponse.data);
  } catch (error) {
    console.log('❌ Category instruments failed:', error.response?.data || error.message);
  }

  try {
    // Test 4: Search instruments
    console.log('\n4. Testing search instruments...');
    const searchResponse = await axios.get(`${BASE_URL}/api/instruments/search?query=NIFTY&category=options&page=1&limit=10`);
    console.log('✅ Search instruments:', searchResponse.data);
  } catch (error) {
    console.log('❌ Search instruments failed:', error.response?.data || error.message);
  }

  try {
    // Test 5: Instrument stats
    console.log('\n5. Testing instrument stats...');
    const statsResponse = await axios.get(`${BASE_URL}/api/instruments/stats`);
    console.log('✅ Instrument stats:', statsResponse.data);
  } catch (error) {
    console.log('❌ Instrument stats failed:', error.response?.data || error.message);
  }
}

testInstrumentsAPI();
