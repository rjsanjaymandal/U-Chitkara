const axios = require('axios');

// Simple test to check if we can access the LeetCode API
axios.get('https://leetcode.com/api/problems/all/')
  .then(response => {
    console.log('Successfully connected to LeetCode API');
    console.log('Number of problems:', response.data.num_total);
  })
  .catch(error => {
    console.error('Error connecting to LeetCode API:', error.message);
  });
