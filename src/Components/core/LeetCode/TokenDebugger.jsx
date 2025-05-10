import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { 
  Card, 
  Typography, 
  Button, 
  Alert, 
  Divider,
  Space,
  Spin,
  Input,
  Collapse
} from "antd";
import { BugOutlined, KeyOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const TokenDebugger = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [localToken, setLocalToken] = useState("");
  const [tokenSource, setTokenSource] = useState("redux");

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem("token");
    setLocalToken(storedToken || "");
  }, []);

  const validateToken = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // Use the token from the selected source
      const tokenToValidate = tokenSource === "redux" ? token : 
                             tokenSource === "localStorage" ? localStorage.getItem("token") : 
                             tokenSource === "custom" ? localToken : "";
      
      if (!tokenToValidate) {
        setError("No token available from the selected source");
        setLoading(false);
        return;
      }
      
      // Call the token validation endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leetcode/test/validate-token`,
        { token: tokenToValidate }
      );
      
      setResult(response.data);
    } catch (error) {
      console.error("Token validation error:", error);
      setError({
        message: error.response?.data?.message || "Token validation failed",
        details: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const parseJwt = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error parsing JWT:", e);
      return null;
    }
  };

  const getTokenInfo = (tokenStr) => {
    if (!tokenStr) return { valid: false, payload: null };
    
    try {
      const parts = tokenStr.split('.');
      if (parts.length !== 3) {
        return { valid: false, payload: null, error: "Invalid token format (should have 3 parts)" };
      }
      
      const payload = parseJwt(tokenStr);
      return { 
        valid: true, 
        payload,
        expiresAt: payload?.exp ? new Date(payload.exp * 1000).toLocaleString() : "Unknown",
        issuedAt: payload?.iat ? new Date(payload.iat * 1000).toLocaleString() : "Unknown",
        isExpired: payload?.exp ? (payload.exp * 1000 < Date.now()) : "Unknown"
      };
    } catch (e) {
      return { valid: false, payload: null, error: e.message };
    }
  };

  // Get token info for display
  const reduxTokenInfo = getTokenInfo(token);
  const localStorageTokenInfo = getTokenInfo(localStorage.getItem("token"));
  const customTokenInfo = getTokenInfo(localToken);

  return (
    <Card className="bg-richblack-800 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <BugOutlined style={{ color: "#FFD60A", fontSize: 24 }} />
        <Title level={4} style={{ color: "#F5F5F5", margin: 0 }}>
          Token Debugger
        </Title>
      </div>
      
      <Alert
        message="Development Tool"
        description="This tool helps diagnose authentication issues by validating your JWT token."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      
      <Collapse defaultActiveKey={['1']} className="mb-4">
        <Panel header="Token Information" key="1">
          <div className="space-y-4">
            <div>
              <Text strong style={{ color: "#FFD60A" }}>Redux Token:</Text>
              <div className="mt-1 p-2 bg-richblack-900 rounded overflow-auto max-h-20">
                <Text copyable style={{ color: "#AFAFAF", wordBreak: "break-all" }}>
                  {token || "No token in Redux store"}
                </Text>
              </div>
              {reduxTokenInfo.valid ? (
                <div className="mt-2">
                  <Text style={{ color: "#52C41A" }}>
                    <CheckCircleOutlined /> Valid JWT format
                  </Text>
                  <div className="mt-1">
                    <Text style={{ color: "#AFAFAF" }}>Expires: {reduxTokenInfo.expiresAt}</Text>
                    {reduxTokenInfo.isExpired === true && (
                      <Text style={{ color: "#FF4D4F", marginLeft: 8 }}>
                        <CloseCircleOutlined /> Expired
                      </Text>
                    )}
                  </div>
                </div>
              ) : (
                <Text style={{ color: "#FF4D4F", display: "block", marginTop: 2 }}>
                  <CloseCircleOutlined /> {reduxTokenInfo.error || "Invalid token format"}
                </Text>
              )}
            </div>
            
            <Divider style={{ borderColor: "#2C333F" }} />
            
            <div>
              <Text strong style={{ color: "#FFD60A" }}>LocalStorage Token:</Text>
              <div className="mt-1 p-2 bg-richblack-900 rounded overflow-auto max-h-20">
                <Text copyable style={{ color: "#AFAFAF", wordBreak: "break-all" }}>
                  {localStorage.getItem("token") || "No token in localStorage"}
                </Text>
              </div>
              {localStorageTokenInfo.valid ? (
                <div className="mt-2">
                  <Text style={{ color: "#52C41A" }}>
                    <CheckCircleOutlined /> Valid JWT format
                  </Text>
                  <div className="mt-1">
                    <Text style={{ color: "#AFAFAF" }}>Expires: {localStorageTokenInfo.expiresAt}</Text>
                    {localStorageTokenInfo.isExpired === true && (
                      <Text style={{ color: "#FF4D4F", marginLeft: 8 }}>
                        <CloseCircleOutlined /> Expired
                      </Text>
                    )}
                  </div>
                </div>
              ) : (
                <Text style={{ color: "#FF4D4F", display: "block", marginTop: 2 }}>
                  <CloseCircleOutlined /> {localStorageTokenInfo.error || "Invalid token format"}
                </Text>
              )}
            </div>
          </div>
        </Panel>
        
        <Panel header="Custom Token Validation" key="2">
          <div className="space-y-4">
            <div>
              <Text strong style={{ color: "#F5F5F5" }}>Token Source:</Text>
              <div className="mt-2">
                <Space>
                  <Button 
                    type={tokenSource === "redux" ? "primary" : "default"}
                    onClick={() => setTokenSource("redux")}
                    style={tokenSource === "redux" ? {
                      backgroundColor: "#FFD60A",
                      borderColor: "#FFD60A",
                      color: "#000000",
                    } : {}}
                  >
                    Redux Store
                  </Button>
                  <Button 
                    type={tokenSource === "localStorage" ? "primary" : "default"}
                    onClick={() => setTokenSource("localStorage")}
                    style={tokenSource === "localStorage" ? {
                      backgroundColor: "#FFD60A",
                      borderColor: "#FFD60A",
                      color: "#000000",
                    } : {}}
                  >
                    LocalStorage
                  </Button>
                  <Button 
                    type={tokenSource === "custom" ? "primary" : "default"}
                    onClick={() => setTokenSource("custom")}
                    style={tokenSource === "custom" ? {
                      backgroundColor: "#FFD60A",
                      borderColor: "#FFD60A",
                      color: "#000000",
                    } : {}}
                  >
                    Custom
                  </Button>
                </Space>
              </div>
            </div>
            
            {tokenSource === "custom" && (
              <div>
                <Text strong style={{ color: "#F5F5F5" }}>Custom Token:</Text>
                <Input.TextArea
                  value={localToken}
                  onChange={(e) => setLocalToken(e.target.value)}
                  placeholder="Paste your JWT token here"
                  rows={3}
                  style={{ marginTop: 8 }}
                />
                {customTokenInfo.valid ? (
                  <div className="mt-2">
                    <Text style={{ color: "#52C41A" }}>
                      <CheckCircleOutlined /> Valid JWT format
                    </Text>
                    <div className="mt-1">
                      <Text style={{ color: "#AFAFAF" }}>Expires: {customTokenInfo.expiresAt}</Text>
                      {customTokenInfo.isExpired === true && (
                        <Text style={{ color: "#FF4D4F", marginLeft: 8 }}>
                          <CloseCircleOutlined /> Expired
                        </Text>
                      )}
                    </div>
                  </div>
                ) : localToken ? (
                  <Text style={{ color: "#FF4D4F", display: "block", marginTop: 2 }}>
                    <CloseCircleOutlined /> {customTokenInfo.error || "Invalid token format"}
                  </Text>
                ) : null}
              </div>
            )}
            
            <div>
              <Button
                type="primary"
                icon={<KeyOutlined />}
                onClick={validateToken}
                loading={loading}
                style={{
                  backgroundColor: "#FFD60A",
                  borderColor: "#FFD60A",
                  color: "#000000",
                }}
              >
                Validate Token
              </Button>
            </div>
          </div>
        </Panel>
      </Collapse>
      
      {loading && (
        <div className="text-center py-4">
          <Spin />
          <Text style={{ color: "#AFAFAF", display: "block", marginTop: 8 }}>
            Validating token...
          </Text>
        </div>
      )}
      
      {result && (
        <Alert
          message="Token Validation Successful"
          description={
            <div>
              <Paragraph style={{ color: "#AFAFAF" }}>
                User ID: {result.user.id}
              </Paragraph>
              <Paragraph style={{ color: "#AFAFAF" }}>
                Email: {result.user.email}
              </Paragraph>
              <Paragraph style={{ color: "#AFAFAF" }}>
                Name: {result.user.firstName} {result.user.lastName}
              </Paragraph>
              <Paragraph style={{ color: "#AFAFAF" }}>
                LeetCode Username: {result.user.leetCodeUsername || "Not set"}
              </Paragraph>
            </div>
          }
          type="success"
          showIcon
        />
      )}
      
      {error && (
        <Alert
          message="Token Validation Failed"
          description={
            <div>
              <Paragraph style={{ color: "#AFAFAF" }}>
                {error.message || error}
              </Paragraph>
              {error.details && (
                <div className="mt-2 p-2 bg-richblack-900 rounded overflow-auto max-h-40">
                  <pre style={{ color: "#FF4D4F", margin: 0 }}>
                    {JSON.stringify(error.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          }
          type="error"
          showIcon
        />
      )}
    </Card>
  );
};

export default TokenDebugger;
