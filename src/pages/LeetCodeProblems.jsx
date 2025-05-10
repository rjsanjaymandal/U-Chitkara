import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Layout, Typography } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import ProblemList from "../Components/core/LeetCode/ProblemList";

const { Content } = Layout;
const { Title, Text } = Typography;

const LeetCodeProblems = () => {
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
                title: <span className="text-yellow-50">Problems</span>,
              },
            ]}
          />

          <Title level={3} style={{ color: "#F5F5F5", margin: 0 }}>
            <CodeOutlined style={{ marginRight: 12, color: "#FFD60A" }} />
            LeetCode Problems
          </Title>
          <Text style={{ color: "#AFAFAF" }}>
            Browse and solve coding problems
          </Text>
        </div>

        {/* Problem List */}
        <ProblemList />
      </Content>
    </Layout>
  );
};

export default LeetCodeProblems;
