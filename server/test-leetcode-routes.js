const axios = require('axios');

// Test the LeetCode stats endpoint
console.log('Testing LeetCode stats endpoint...');
axios.get('http://localhost:4001/api/v1/leetcode/stats/leetcode')
  .then(response => {
    console.log('Stats endpoint response:', JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('Stats endpoint error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  });
