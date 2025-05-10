import React from "react";
import { Card, Typography, Timeline, Tag, Button } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const LeetCodeRecentActivity = ({ progress }) => {
  // Combine all activities and sort by date (most recent first)
  const allActivities = [
    ...progress.solved.map(item => ({ ...item, type: 'solved' })),
    ...progress.attempted.map(item => ({ ...item, type: 'attempted' })),
    ...progress.bookmarked.map(item => ({ ...item, type: 'bookmarked' }))
  ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  const getIcon = (type) => {
    switch (type) {
      case 'solved':
        return <CheckCircleOutlined style={{ color: "#52C41A" }} />;
      case 'attempted':
        return <ClockCircleOutlined style={{ color: "#1890FF" }} />;
      case 'bookmarked':
        return <BookOutlined style={{ color: "#FAAD14" }} />;
      default:
        return <CodeOutlined style={{ color: "#FFD60A" }} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'solved':
        return "success";
      case 'attempted':
        return "processing";
      case 'bookmarked':
        return "warning";
      default:
        return "default";
    }
  };

  const getAction = (type) => {
    switch (type) {
      case 'solved':
        return "Solved";
      case 'attempted':
        return "Attempted";
      case 'bookmarked':
        return "Bookmarked";
      default:
        return "Interacted with";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return "#00B8A3";
      case 'Medium':
        return "#FFC01E";
      case 'Hard':
        return "#FF375F";
      default:
        return "#AFAFAF";
    }
  };

  return (
    <Card 
      className="bg-richblack-800 shadow-md" 
      bordered={false}
    >
      <Title level={4} style={{ color: "#F5F5F5", marginBottom: 24 }}>
        <ClockCircleOutlined style={{ marginRight: 8, color: "#FFD60A" }} />
        Recent Activity
      </Title>
      
      {allActivities.length > 0 ? (
        <Timeline
          items={allActivities.map((activity, index) => ({
            dot: getIcon(activity.type),
            color: getColor(activity.type),
            children: (
              <div key={index} className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Tag color={getColor(activity.type)}>{getAction(activity.type)}</Tag>
                  <Link to={`/leetcode/problem/${activity.problem.problemId}`}>
                    <Text strong style={{ color: "#F5F5F5" }}>
                      {activity.problem.title}
                    </Text>
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Tag color={getDifficultyColor(activity.problem.difficulty)} style={{ borderColor: 'transparent' }}>
                    {activity.problem.difficulty}
                  </Tag>
                  <Text style={{ color: "#AFAFAF", fontSize: "0.85rem" }}>
                    {new Date(activity.updatedAt).toLocaleDateString()} at {new Date(activity.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </div>
              </div>
            )
          }))}
        />
      ) : (
        <div className="text-center py-8">
          <Text style={{ color: "#AFAFAF", display: "block", marginBottom: 16 }}>
            No recent activity found. Start solving problems to track your progress.
          </Text>
          <Link to="/leetcode/problems">
            <Button
              type="primary"
              icon={<CodeOutlined />}
              style={{
                backgroundColor: "#FFD60A",
                borderColor: "#FFD60A",
                color: "#000000",
              }}
            >
              Browse Problems
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default LeetCodeRecentActivity;
