const axios = require('axios');

// Test the LeetCode stats endpoint and log the full response structure
console.log('Testing LeetCode stats endpoint and logging full response...');

axios.get('http://localhost:4001/api/v1/leetcode/stats/leetcode')
  .then(response => {
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Full response data:', JSON.stringify(response.data, null, 2));
    
    // Check if the data structure matches what the frontend expects
    const data = response.data.data;
    if (data) {
      console.log('\nVerifying data structure:');
      console.log('- username:', typeof data.username, data.username);
      
      console.log('\n- solved:');
      if (data.solved) {
        console.log('  - easy:', typeof data.solved.easy, data.solved.easy);
        console.log('  - medium:', typeof data.solved.medium, data.solved.medium);
        console.log('  - hard:', typeof data.solved.hard, data.solved.hard);
        console.log('  - total:', typeof data.solved.total, data.solved.total);
      } else {
        console.log('  MISSING solved object');
      }
      
      console.log('\n- submissions:');
      if (data.submissions) {
        console.log('  - easy:', typeof data.submissions.easy, data.submissions.easy);
        console.log('  - medium:', typeof data.submissions.medium, data.submissions.medium);
        console.log('  - hard:', typeof data.submissions.hard, data.submissions.hard);
        console.log('  - total:', typeof data.submissions.total, data.submissions.total);
      } else {
        console.log('  MISSING submissions object');
      }
      
      console.log('\n- profile:');
      if (data.profile) {
        console.log('  - ranking:', typeof data.profile.ranking, data.profile.ranking);
        console.log('  - reputation:', typeof data.profile.reputation, data.profile.reputation);
        console.log('  - starRating:', typeof data.profile.starRating, data.profile.starRating);
      } else {
        console.log('  MISSING profile object');
      }
    } else {
      console.log('MISSING data object in response');
    }
  })
  .catch(error => {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  });
