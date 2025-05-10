const axios = require('axios');

console.log('Testing LeetCode API connection...');

const query = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

axios.post('https://leetcode.com/graphql', 
  {
    query: query,
    variables: { username: 'leetcode' }
  }, 
  {
    headers: { 
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  }
)
.then(res => {
  console.log('LeetCode API response:', JSON.stringify(res.data, null, 2));
})
.catch(err => {
  console.error('LeetCode API error:', err.message);
  if (err.response) {
    console.error('Error response:', err.response.data);
  }
});
