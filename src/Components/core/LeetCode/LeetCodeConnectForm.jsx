import React, { useState } from "react";
import { Card, Typography, Form, Input, Button, Alert, Spin } from "antd";
import { CodeOutlined, LinkOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../slices/profileSlice";
import axios from "axios";
import { toast } from "react-hot-toast";

const { Title, Text, Paragraph } = Typography;

const LeetCodeConnectForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/leetcode/username`,
        { leetCodeUsername: values.username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Store username in localStorage for persistence
        localStorage.setItem("leetCodeUsername", values.username);
        
        // Update Redux store
        dispatch(setUser(response.data.user));
        
        toast.success("LeetCode account connected successfully!");
        
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess(values.username);
        }
      } else {
        setError(response.data.message || "Failed to connect LeetCode account");
      }
    } catch (error) {
      console.error("Error connecting LeetCode account:", error);
      setError(
        error.response?.data?.message ||
        "An error occurred while connecting your LeetCode account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      className="bg-richblack-800 shadow-md" 
      bordered={false}
    >
      <div className="flex items-center gap-3 mb-4">
        <CodeOutlined style={{ color: "#FFD60A", fontSize: 24 }} />
        <Title level={4} style={{ color: "#F5F5F5", margin: 0 }}>
          Connect LeetCode Account
        </Title>
      </div>
      
      <Paragraph style={{ color: "#AFAFAF", marginBottom: 24 }}>
        Connect your LeetCode account to track your progress, view statistics, and access personalized problem recommendations.
      </Paragraph>
      
      {error && (
        <Alert
          message="Connection Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          label={<span style={{ color: "#F5F5F5" }}>LeetCode Username</span>}
          rules={[
            {
              required: true,
              message: "Please enter your LeetCode username",
            },
            {
              pattern: /^[a-zA-Z0-9_-]+$/,
              message: "Username can only contain letters, numbers, underscores and hyphens",
            },
          ]}
        >
          <Input
            prefix={<LinkOutlined style={{ color: "#AFAFAF" }} />}
            placeholder="Enter your LeetCode username"
            size="large"
          />
        </Form.Item>
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<LinkOutlined />}
            size="large"
            loading={loading}
            style={{
              backgroundColor: "#FFD60A",
              borderColor: "#FFD60A",
              color: "#000000",
              width: "100%",
            }}
          >
            {loading ? "Connecting..." : "Connect Account"}
          </Button>
        </Form.Item>
      </Form>
      
      <div className="mt-4">
        <Text style={{ color: "#AFAFAF", fontSize: "0.9rem" }}>
          Don't have a LeetCode account?{" "}
          <a
            href="https://leetcode.com/accounts/signup/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#FFD60A" }}
          >
            Sign up here
          </a>
        </Text>
      </div>
    </Card>
  );
};

export default LeetCodeConnectForm;
