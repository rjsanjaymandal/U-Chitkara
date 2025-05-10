import React from "react";
import { useSelector } from "react-redux";
import { Layout, Typography, Breadcrumb, Card } from "antd";
import { Link } from "react-router-dom";
import { CodeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import LeetCodeUsernameForm from "../Components/core/LeetCode/LeetCodeUsernameForm";
import LeetCodeTestSetup from "../Components/core/LeetCode/LeetCodeTestSetup";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const LeetCodeConnect = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  return (
    <Layout className="min-h-screen bg-richblack-900">
      <Content className="max-w-maxContent mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb
            className="mb-4"
            items={[
              {
                title: (
                  <Link to="/" className="text-richblack-300">
                    Home
                  </Link>
                ),
              },
              {
                title: (
                  <Link to="/leetcode" className="text-richblack-300">
                    LeetCode Practice
                  </Link>
                ),
              },
              {
                title: <span className="text-yellow-50">Connect Account</span>,
              },
            ]}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Title level={2} style={{ color: "#F5F5F5", margin: 0 }}>
                <CodeOutlined style={{ marginRight: 12, color: "#FFD60A" }} />
                Connect LeetCode Account
              </Title>
              <Text style={{ color: "#AFAFAF" }}>
                Link your LeetCode account to track your progress
              </Text>
            </div>

            <Link to="/leetcode">
              <button className="flex items-center gap-2 text-yellow-50 hover:text-yellow-25">
                <ArrowLeftOutlined />
                Back to LeetCode
              </button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card className="bg-richblack-800 shadow-md mb-6">
              <Title level={4} style={{ color: "#F5F5F5", marginBottom: 16 }}>
                <CodeOutlined style={{ color: "#FFD60A", marginRight: 8 }} />
                Why Connect Your LeetCode Account?
              </Title>
              <Paragraph style={{ color: "#AFAFAF" }}>
                Connecting your LeetCode account allows you to:
              </Paragraph>
              <ul className="list-disc pl-5 text-richblack-100 space-y-2 mb-4">
                <li>Track your progress across different problem difficulties</li>
                <li>See your solved problems history</li>
                <li>Get personalized problem recommendations</li>
                <li>Access your LeetCode submissions directly from our platform</li>
              </ul>
              <Paragraph style={{ color: "#AFAFAF" }}>
                Your LeetCode username is the name that appears in your LeetCode profile URL.
                For example, if your profile URL is <Text code>https://leetcode.com/username123</Text>, 
                then your username is <Text code>username123</Text>.
              </Paragraph>
            </Card>

            <LeetCodeUsernameForm />
          </div>

          <div>
            <Card className="bg-richblack-800 shadow-md mb-6">
              <Title level={4} style={{ color: "#F5F5F5", marginBottom: 16 }}>
                <CodeOutlined style={{ color: "#FFD60A", marginRight: 8 }} />
                Having Trouble?
              </Title>
              <Paragraph style={{ color: "#AFAFAF" }}>
                If you're experiencing issues connecting your LeetCode account, you can use our test setup below.
                This is a special development feature that allows you to bypass the normal authentication flow.
              </Paragraph>
              <Paragraph style={{ color: "#FF4D4F", fontWeight: "bold" }}>
                Note: This is for development and testing purposes only.
              </Paragraph>
            </Card>

            <LeetCodeTestSetup />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LeetCodeConnect;
