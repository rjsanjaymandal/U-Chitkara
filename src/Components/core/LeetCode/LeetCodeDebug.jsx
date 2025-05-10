import React, { useState } from 'react';
import { Card, Input, Button, Typography, Divider, Alert, Spin, Space } from 'antd';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const LeetCodeDebug = () => {
  const [username, setUsername] = useState('leetcode');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);

  const fetchStats = async () => {
    if (!username) {
      setError('Please enter a LeetCode username');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setRawData(null);

    try {
      // Direct API call to bypass any authentication issues
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/leetcode/stats/${username}`);
      console.log('Raw API response:', response);
      
      // Store the raw response
      setRawData(response);
      
      // Process the data
      if (response.data && response.data.success && response.data.data) {
        setResult(response.data.data);
      } else {
        setError('API response was successful but data format is unexpected');
      }
    } catch (err) {
      console.error('Error fetching LeetCode stats:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch LeetCode stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-richblack-800 shadow-md">
      <Title level={4} style={{ color: '#F5F5F5' }}>LeetCode Debug Tool</Title>
      <Paragraph style={{ color: '#AFAFAF' }}>
        This component shows the raw API response for debugging purposes.
      </Paragraph>

      <Divider style={{ borderColor: '#2C333F' }} />

      <div className="mb-4">
        <Text style={{ color: '#F5F5F5', display: 'block', marginBottom: 8 }}>LeetCode Username:</Text>
        <Space>
          <Input 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter LeetCode username"
            style={{ width: 200 }}
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
        </Space>
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
            <Title level={5} style={{ color: '#F5F5F5' }}>Processed Data</Title>
            <pre style={{ color: '#AFAFAF', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        </div>
      )}

      {rawData && (
        <div className="mt-4">
          <Card className="bg-richblack-700">
            <Title level={5} style={{ color: '#F5F5F5' }}>Raw Response</Title>
            <Divider style={{ borderColor: '#2C333F' }} />
            
            <Text strong style={{ color: '#F5F5F5', display: 'block' }}>Status: {rawData.status}</Text>
            <Text style={{ color: '#AFAFAF', display: 'block', marginBottom: 8 }}>
              Status Text: {rawData.statusText}
            </Text>
            
            <Divider style={{ borderColor: '#2C333F' }} />
            
            <Text strong style={{ color: '#F5F5F5', display: 'block' }}>Headers:</Text>
            <pre style={{ color: '#AFAFAF', overflow: 'auto', maxHeight: '100px' }}>
              {JSON.stringify(rawData.headers, null, 2)}
            </pre>
            
            <Divider style={{ borderColor: '#2C333F' }} />
            
            <Text strong style={{ color: '#F5F5F5', display: 'block' }}>Data:</Text>
            <pre style={{ color: '#AFAFAF', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify(rawData.data, null, 2)}
            </pre>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default LeetCodeDebug;
