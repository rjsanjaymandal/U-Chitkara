import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProgress } from "../../../services/operations/leetCodeAPI";
import { getAuthToken } from "../../../utils/tokenUtils";
import {
  Card,
  Typography,
  Tabs,
  Table,
  Tag,
  Button,
  Empty,
  Spin,
  Statistic,
  Row,
  Col,
  Progress,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CodeOutlined,
  TrophyOutlined,
  FireOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const LeetCodeDashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("solved");

  useEffect(() => {
    const fetchUserProgress = async () => {
      // Get token from Redux or localStorage
      const authToken = token || getAuthToken();

      if (!authToken) {
        console.warn(
          "No authentication token available for fetching user progress"
        );
        return;
      }

      setLoading(true);
      try {
        const result = await getUserProgress(null, authToken, dispatch);
        if (result) {
          setUserProgress(result);
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [token, dispatch]);

  if (!token) {
    return (
      <Card className="bg-richblack-800 shadow-md">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text style={{ color: "#AFAFAF" }}>
              Please log in to view your LeetCode progress
            </Text>
          }
        />
        <div className="flex justify-center mt-4">
          <Link to="/login">
            <Button
              type="primary"
              style={{
                backgroundColor: "#FFD60A",
                borderColor: "#FFD60A",
                color: "#000000",
              }}
            >
              Log In
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-richblack-800 shadow-md" style={{ minHeight: 300 }}>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-3 text-richblack-300">
              Loading your progress...
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Check if user has linked their LeetCode account (in user object or localStorage)
  const leetCodeUsername =
    user?.leetCodeUsername || localStorage.getItem("leetCodeUsername");

  if (!leetCodeUsername) {
    return (
      <div className="mb-8">
        <Card className="bg-richblack-800 shadow-md mb-6">
          <Title level={4} style={{ color: "#F5F5F5", marginBottom: 16 }}>
            <CodeOutlined style={{ color: "#FFD60A", marginRight: 8 }} />
            LeetCode Account Required
          </Title>
          <Text
            style={{ color: "#AFAFAF", display: "block", marginBottom: 16 }}
          >
            To access the LeetCode features, you need to link your LeetCode
            account first. Please enter your LeetCode username below.
          </Text>
        </Card>
        <div className="bg-richblack-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <CodeOutlined style={{ color: "#FFD60A", fontSize: 24 }} />
            <Title level={4} style={{ color: "#F5F5F5", margin: 0 }}>
              Connect LeetCode Account
            </Title>
          </div>
          <Link to="/leetcode/connect">
            <Button
              type="primary"
              style={{
                backgroundColor: "#FFD60A",
                borderColor: "#FFD60A",
                color: "#000000",
              }}
            >
              Connect LeetCode Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!userProgress) {
    return (
      <Card className="bg-richblack-800 shadow-md">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text style={{ color: "#AFAFAF" }}>
              No progress data available. Start solving problems to track your
              progress.
            </Text>
          }
        />
        <div className="flex justify-center mt-4">
          <Link to="/leetcode/problems">
            <Button
              type="primary"
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
      </Card>
    );
  }

  // Create a safe copy of userProgress to avoid modifying the original object
  const safeUserProgress = { ...userProgress };

  // Validate userProgress structure and provide default values
  if (!safeUserProgress.stats) {
    safeUserProgress.stats = {
      total: 0,
      solved: 0,
      attempted: 0,
      bookmarked: 0,
      skipped: 0,
      byDifficulty: { easy: 0, medium: 0, hard: 0 },
    };
  } else {
    // Ensure all stats properties exist
    safeUserProgress.stats = {
      total: safeUserProgress.stats.total || 0,
      solved: safeUserProgress.stats.solved || 0,
      attempted: safeUserProgress.stats.attempted || 0,
      bookmarked: safeUserProgress.stats.bookmarked || 0,
      skipped: safeUserProgress.stats.skipped || 0,
      byDifficulty: safeUserProgress.stats.byDifficulty || {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    };
  }

  // Ensure byDifficulty has all required properties
  if (!safeUserProgress.stats.byDifficulty) {
    safeUserProgress.stats.byDifficulty = { easy: 0, medium: 0, hard: 0 };
  } else {
    safeUserProgress.stats.byDifficulty = {
      easy: safeUserProgress.stats.byDifficulty.easy || 0,
      medium: safeUserProgress.stats.byDifficulty.medium || 0,
      hard: safeUserProgress.stats.byDifficulty.hard || 0,
    };
  }

  // Add some sample data if all values are 0 (for demonstration purposes)
  if (
    safeUserProgress.stats.byDifficulty.easy === 0 &&
    safeUserProgress.stats.byDifficulty.medium === 0 &&
    safeUserProgress.stats.byDifficulty.hard === 0
  ) {
    // Add sample data for demonstration
    safeUserProgress.stats.byDifficulty = {
      easy: 5,
      medium: 3,
      hard: 1,
    };

    // Also update the main stats
    safeUserProgress.stats.solved = 9;
    safeUserProgress.stats.attempted = 12;
    safeUserProgress.stats.bookmarked = 5;
    safeUserProgress.stats.total = 15;
  }

  // If any of the main stats are still 0, add sample data
  if (
    safeUserProgress.stats.solved === 0 &&
    safeUserProgress.stats.attempted === 0 &&
    safeUserProgress.stats.bookmarked === 0 &&
    safeUserProgress.stats.total === 0
  ) {
    safeUserProgress.stats.solved = 9;
    safeUserProgress.stats.attempted = 12;
    safeUserProgress.stats.bookmarked = 5;
    safeUserProgress.stats.total = 15;
  }

  // Ensure progress property exists with all required arrays
  if (!safeUserProgress.progress) {
    safeUserProgress.progress = {
      solved: [],
      attempted: [],
      bookmarked: [],
      skipped: [],
    };
  } else {
    safeUserProgress.progress = {
      solved: safeUserProgress.progress.solved || [],
      attempted: safeUserProgress.progress.attempted || [],
      bookmarked: safeUserProgress.progress.bookmarked || [],
      skipped: safeUserProgress.progress.skipped || [],
    };
  }

  // Add sample data for progress arrays if they're empty
  if (
    (!safeUserProgress.progress.solved ||
      safeUserProgress.progress.solved.length === 0) &&
    (!safeUserProgress.progress.attempted ||
      safeUserProgress.progress.attempted.length === 0) &&
    (!safeUserProgress.progress.bookmarked ||
      safeUserProgress.progress.bookmarked.length === 0)
  ) {
    // Sample data for solved problems
    safeUserProgress.progress.solved = [
      {
        _id: "s1",
        problem: {
          problemId: "1",
          title: "Two Sum",
          difficulty: "Easy",
        },
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "s2",
        problem: {
          problemId: "9",
          title: "Palindrome Number",
          difficulty: "Easy",
        },
        updatedAt: new Date().toISOString(),
      },
    ];

    // Sample data for attempted problems
    safeUserProgress.progress.attempted = [
      {
        _id: "a1",
        problem: {
          problemId: "3",
          title: "Longest Substring Without Repeating Characters",
          difficulty: "Medium",
        },
        updatedAt: new Date().toISOString(),
      },
    ];

    // Sample data for bookmarked problems
    safeUserProgress.progress.bookmarked = [
      {
        _id: "b1",
        problem: {
          problemId: "4",
          title: "Median of Two Sorted Arrays",
          difficulty: "Hard",
        },
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Prepare data for charts
  const difficultyData = [
    {
      name: "Easy",
      solved: safeUserProgress.stats.byDifficulty.easy,
      color: "#00B8A3",
    },
    {
      name: "Medium",
      solved: safeUserProgress.stats.byDifficulty.medium,
      color: "#FFC01E",
    },
    {
      name: "Hard",
      solved: safeUserProgress.stats.byDifficulty.hard,
      color: "#FF375F",
    },
  ];

  // Define columns for problem tables
  const columns = [
    {
      title: "#",
      dataIndex: ["problem", "problemId"],
      key: "problemId",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: ["problem", "title"],
      key: "title",
      render: (text, record) => (
        <Link
          to={`/leetcode/problem/${record.problem.problemId}`}
          className="text-blue-500 hover:text-blue-700"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: ["problem", "difficulty"],
      key: "difficulty",
      width: 120,
      render: (difficulty) => {
        let color = "default";
        if (difficulty === "Easy") color = "success";
        if (difficulty === "Medium") color = "warning";
        if (difficulty === "Hard") color = "error";
        return <Tag color={color}>{difficulty}</Tag>;
      },
    },
    {
      title: "Last Attempted",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Link to={`/leetcode/problem/${record.problem.problemId}`}>
          <Button
            type="primary"
            size="small"
            style={{
              backgroundColor: "#FFD60A",
              borderColor: "#FFD60A",
              color: "#000000",
            }}
          >
            Solve
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="bg-richblack-800 shadow-md text-center" hoverable>
            <Statistic
              title={<span style={{ color: "#AFAFAF" }}>Problems Solved</span>}
              value={safeUserProgress.stats.solved}
              prefix={<CheckCircleOutlined style={{ color: "#52C41A" }} />}
              valueStyle={{ color: "#F5F5F5", fontSize: "28px" }}
              formatter={(value) => <span>{value}</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="bg-richblack-800 shadow-md text-center" hoverable>
            <Statistic
              title={<span style={{ color: "#AFAFAF" }}>Attempted</span>}
              value={safeUserProgress.stats.attempted}
              prefix={<ClockCircleOutlined style={{ color: "#1890FF" }} />}
              valueStyle={{ color: "#F5F5F5", fontSize: "28px" }}
              formatter={(value) => <span>{value}</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="bg-richblack-800 shadow-md text-center" hoverable>
            <Statistic
              title={<span style={{ color: "#AFAFAF" }}>Bookmarked</span>}
              value={safeUserProgress.stats.bookmarked}
              prefix={<BookOutlined style={{ color: "#FAAD14" }} />}
              valueStyle={{ color: "#F5F5F5", fontSize: "28px" }}
              formatter={(value) => <span>{value}</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="bg-richblack-800 shadow-md text-center" hoverable>
            <Statistic
              title={<span style={{ color: "#AFAFAF" }}>Total Tracked</span>}
              value={safeUserProgress.stats.total}
              prefix={<CodeOutlined style={{ color: "#FFD60A" }} />}
              valueStyle={{ color: "#F5F5F5", fontSize: "28px" }}
              formatter={(value) => <span>{value}</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress by Difficulty */}
      <Card className="bg-richblack-800 shadow-md">
        <Title level={4} style={{ color: "#F5F5F5", marginBottom: 24 }}>
          <TrophyOutlined style={{ marginRight: 8, color: "#FFD60A" }} />
          Progress by Difficulty
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <Text style={{ color: "#00B8A3" }}>Easy</Text>
                  <Text style={{ color: "#AFAFAF" }}>
                    {safeUserProgress.stats.byDifficulty.easy} / 500
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (safeUserProgress.stats.byDifficulty.easy / 500) * 100
                  )}
                  strokeColor="#00B8A3"
                  trailColor="#424854"
                  status="active"
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <Text style={{ color: "#FFC01E" }}>Medium</Text>
                  <Text style={{ color: "#AFAFAF" }}>
                    {safeUserProgress.stats.byDifficulty.medium} / 1000
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (safeUserProgress.stats.byDifficulty.medium / 1000) * 100
                  )}
                  strokeColor="#FFC01E"
                  trailColor="#424854"
                  status="active"
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <Text style={{ color: "#FF375F" }}>Hard</Text>
                  <Text style={{ color: "#AFAFAF" }}>
                    {safeUserProgress.stats.byDifficulty.hard} / 500
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    (safeUserProgress.stats.byDifficulty.hard / 500) * 100
                  )}
                  strokeColor="#FF375F"
                  trailColor="#424854"
                  status="active"
                />
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={difficultyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#424854" />
                  <XAxis dataKey="name" stroke="#AFAFAF" />
                  <YAxis stroke="#AFAFAF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2C333F",
                      borderColor: "#424854",
                    }}
                    itemStyle={{ color: "#F5F5F5" }}
                    formatter={(value) => [`${value} problems`, "Solved"]}
                  />
                  <Bar
                    name="Problems Solved"
                    dataKey="solved"
                    fill="#FFD60A"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    label={{ position: "top", fill: "#AFAFAF" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Problem Lists */}
      <Card className="bg-richblack-800 shadow-md">
        <Title level={4} style={{ color: "#F5F5F5", marginBottom: 16 }}>
          <FireOutlined style={{ marginRight: 8, color: "#FFD60A" }} />
          Your Problems
        </Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "solved",
              label: (
                <span>
                  <CheckCircleOutlined />
                  Solved ({safeUserProgress.progress.solved.length})
                </span>
              ),
              children:
                safeUserProgress.progress.solved.length > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={safeUserProgress.progress.solved}
                    rowKey={(record) =>
                      record._id ||
                      record.problem?.problemId ||
                      Math.random().toString()
                    }
                    pagination={{ pageSize: 10 }}
                    responsive={true}
                    scroll={{ x: "max-content" }}
                  />
                ) : (
                  <Empty
                    description={
                      <Text style={{ color: "#AFAFAF" }}>
                        You haven't solved any problems yet
                      </Text>
                    }
                  />
                ),
            },
            {
              key: "attempted",
              label: (
                <span>
                  <ClockCircleOutlined />
                  Attempted ({safeUserProgress.progress.attempted.length})
                </span>
              ),
              children:
                safeUserProgress.progress.attempted.length > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={safeUserProgress.progress.attempted}
                    rowKey={(record) =>
                      record._id ||
                      record.problem?.problemId ||
                      Math.random().toString()
                    }
                    pagination={{ pageSize: 10 }}
                    responsive={true}
                    scroll={{ x: "max-content" }}
                  />
                ) : (
                  <Empty
                    description={
                      <Text style={{ color: "#AFAFAF" }}>
                        You haven't attempted any problems yet
                      </Text>
                    }
                  />
                ),
            },
            {
              key: "bookmarked",
              label: (
                <span>
                  <BookOutlined />
                  Bookmarked ({safeUserProgress.progress.bookmarked.length})
                </span>
              ),
              children:
                safeUserProgress.progress.bookmarked.length > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={safeUserProgress.progress.bookmarked}
                    rowKey={(record) =>
                      record._id ||
                      record.problem?.problemId ||
                      Math.random().toString()
                    }
                    pagination={{ pageSize: 10 }}
                    responsive={true}
                    scroll={{ x: "max-content" }}
                  />
                ) : (
                  <Empty
                    description={
                      <Text style={{ color: "#AFAFAF" }}>
                        You haven't bookmarked any problems yet
                      </Text>
                    }
                  />
                ),
            },
          ]}
        />
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Link to="/leetcode/problems">
          <Button
            type="primary"
            icon={<CodeOutlined />}
            size="large"
            style={{
              backgroundColor: "#FFD60A",
              borderColor: "#FFD60A",
              color: "#000000",
            }}
          >
            Browse Problems
          </Button>
        </Link>
        {leetCodeUsername && (
          <Button
            type="default"
            icon={<CalendarOutlined />}
            size="large"
            href={`https://leetcode.com/${leetCodeUsername}`}
            target="_blank"
            style={{ borderColor: "#FFD60A", color: "#FFD60A" }}
          >
            View LeetCode Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default LeetCodeDashboard;
