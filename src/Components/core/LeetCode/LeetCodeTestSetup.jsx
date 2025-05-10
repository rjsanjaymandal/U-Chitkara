import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Card,
  Typography,
  Input,
  Button,
  Form,
  Alert,
  Divider,
  Space,
  Tabs,
} from "antd";
import {
  CodeOutlined,
  InfoCircleOutlined,
  BugOutlined,
} from "@ant-design/icons";
import TokenDebugger from "./TokenDebugger";

const { Title, Text, Paragraph } = Typography;

const LeetCodeTestSetup = () => {
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    setSuccess(false);

    try {
      // Use the special test route to set the LeetCode username
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leetcode/test/set-username`,
        {
          email: user.email,
          leetCodeUsername: values.username,
        }
      );

      console.log("Test route response:", response.data);

      if (response.data.success) {
        setSuccess(true);
        toast.success("LeetCode username set successfully!");

        // Force reload after 2 seconds to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to set LeetCode username");
      }
    } catch (error) {
      console.error("Error in test setup:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <Card className="bg-richblack-800 shadow-md mb-6">
        <Title level={4} style={{ color: "#F5F5F5", marginBottom: 16 }}>
          <InfoCircleOutlined style={{ color: "#FFD60A", marginRight: 8 }} />
          LeetCode Test Setup
        </Title>
        <Alert
          message="Development Mode Only"
          description="This is a special test setup for development purposes. It allows you to set your LeetCode username without authentication and debug token issues."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Paragraph style={{ color: "#AFAFAF" }}>
          This component bypasses the normal authentication flow to help with
          testing. Use the tabs below to set your LeetCode username or debug
          authentication issues.
        </Paragraph>
      </Card>

      <Tabs defaultActiveKey="1" className="custom-tabs">
        <Tabs.TabPane
          tab={
            <span>
              <CodeOutlined /> Set Username
            </span>
          }
          key="1"
        >
          <Card className="bg-richblack-800 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <CodeOutlined style={{ color: "#FFD60A", fontSize: 24 }} />
              <Title level={4} style={{ color: "#F5F5F5", margin: 0 }}>
                Set LeetCode Username
              </Title>
            </div>

            <Paragraph style={{ color: "#AFAFAF", marginBottom: 16 }}>
              Current user:{" "}
              <Text strong style={{ color: "#FFD60A" }}>
                {user?.email}
              </Text>
            </Paragraph>

            {user?.leetCodeUsername && (
              <Paragraph style={{ color: "#AFAFAF", marginBottom: 16 }}>
                Current LeetCode username:{" "}
                <Text strong style={{ color: "#FFD60A" }}>
                  {user.leetCodeUsername}
                </Text>
              </Paragraph>
            )}

            <Divider style={{ borderColor: "#2C333F" }} />

            <Form
              name="leetcode-test-setup"
              onFinish={handleSubmit}
              layout="vertical"
              initialValues={{ username: user?.leetCodeUsername || "" }}
            >
              <Form.Item
                name="username"
                label={
                  <span style={{ color: "#F5F5F5" }}>LeetCode Username</span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter a LeetCode username",
                  },
                  {
                    pattern: /^[a-zA-Z0-9_-]+$/,
                    message:
                      "Username can only contain letters, numbers, underscores, and hyphens",
                  },
                ]}
                help="Enter any valid username format (e.g., 'user123')"
              >
                <Input
                  prefix={<CodeOutlined style={{ color: "#AFAFAF" }} />}
                  placeholder="Enter LeetCode username"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      backgroundColor: "#FFD60A",
                      borderColor: "#FFD60A",
                      color: "#000000",
                    }}
                  >
                    Set Username
                  </Button>

                  {success && (
                    <Text style={{ color: "#52C41A" }}>
                      Username set successfully! Reloading...
                    </Text>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <span>
              <BugOutlined /> Debug Authentication
            </span>
          }
          key="2"
        >
          <TokenDebugger />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default LeetCodeTestSetup;
