// Simple test to verify broker data structure
const testBrokers = [
  {
    id: 'angel',
    name: 'Angel One',
    description: 'Angel One SmartAPI for trading',
    logo: '/images/brokers/angel-one.png',
    features: ['Equity', 'F&O', 'Currency', 'Commodity'],
    isAvailable: true,
    authUrl: '/api/brokers/angel/connect'
  },
  {
    id: 'dhan',
    name: 'Dhan',
    description: 'Dhan API for trading',
    logo: '/images/brokers/dhan.png',
    features: ['Equity', 'F&O', 'Currency'],
    isAvailable: true,
    authUrl: '/api/brokers/dhan/connect'
  }
];

console.log('Test brokers data:');
console.log(JSON.stringify(testBrokers, null, 2));

console.log('\nBroker count:', testBrokers.length);
console.log('Angel One features:', testBrokers[0].features);
console.log('Dhan features:', testBrokers[1].features);
