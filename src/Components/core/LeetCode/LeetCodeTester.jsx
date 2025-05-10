import React, { useState } from 'react';
import { Card, Input, Button, Typography, Divider, Alert, Spin } from 'antd';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const LeetCodeTester = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    if (!username) {
      setError('Please enter a LeetCode username');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Direct API call to bypass any authentication issues
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/leetcode/stats/${username}`);
      console.log('LeetCode stats response:', response.data);
      setResult(response.data.data);
    } catch (err) {
      console.error('Error fetching LeetCode stats:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch LeetCode stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-richblack-800 shadow-md">
      <Title level={4} style={{ color: '#F5F5F5' }}>LeetCode API Tester</Title>
      <Paragraph style={{ color: '#AFAFAF' }}>
        This component directly tests the LeetCode API integration without authentication.
      </Paragraph>

      <Divider style={{ borderColor: '#2C333F' }} />

      <div className="mb-4">
        <Text style={{ color: '#F5F5F5', display: 'block', marginBottom: 8 }}>LeetCode Username:</Text>
        <Input 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter LeetCode username"
          style={{ marginBottom: 16 }}
        />
        <Button 
          type="primary"
          onClick={fetchStats}
          loading={loading}
          style={{
            backgroundColor: '#FFD60A',
            borderColor: '#FFD60A',
            color: '#000000',
          }}
        >
          Fetch Stats
        </Button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <Spin />
          <Text style={{ color: '#AFAFAF', display: 'block', marginTop: 8 }}>
            Fetching LeetCode stats...
          </Text>
        </div>
      )}

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {result && (
        <div>
          <Alert
            message="Success"
            description="LeetCode stats fetched successfully!"
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Card className="bg-richblack-700">
            <Title level={5} style={{ color: '#F5F5F5' }}>Stats for {result.username}</Title>
            
            <Divider style={{ borderColor: '#2C333F' }} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong style={{ color: '#F5F5F5', display: 'block' }}>Problems Solved:</Text>
                <ul className="list-disc pl-5 text-richblack-100">
                  <li>Easy: {result.solved.easy}</li>
                  <li>Medium: {result.solved.medium}</li>
                  <li>Hard: {result.solved.hard}</li>
                  <li>Total: {result.solved.total}</li>
                </ul>
              </div>
              
              <div>
                <Text strong style={{ color: '#F5F5F5', display: 'block' }}>Submissions:</Text>
                <ul className="list-disc pl-5 text-richblack-100">
                  <li>Easy: {result.submissions.easy}</li>
                  <li>Medium: {result.submissions.medium}</li>
                  <li>Hard: {result.submissions.hard}</li>
                  <li>Total: {result.submissions.total}</li>
                </ul>
              </div>
            </div>
            
            <Divider style={{ borderColor: '#2C333F' }} />
            
            <div>
              <Text strong style={{ color: '#F5F5F5', display: 'block' }}>Profile:</Text>
              <ul className="list-disc pl-5 text-richblack-100">
                <li>Ranking: {result.profile.ranking || 'N/A'}</li>
                <li>Reputation: {result.profile.reputation || 0}</li>
                <li>Star Rating: {result.profile.starRating || 0}</li>
              </ul>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default LeetCodeTester;
