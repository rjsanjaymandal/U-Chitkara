import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getLeetCodeStats } from "../../../services/operations/leetCodeAPI";
import {
  Progress,
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Spin,
  Empty,
  Button,
} from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  CodeOutlined,
  TrophyOutlined,
  FireOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const LeetCodeStats = () => {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      // Get username from user object or localStorage
      const username =
        user?.leetCodeUsername || localStorage.getItem("leetCodeUsername");

      if (username) {
        // Store the username in localStorage for persistence
        if (!localStorage.getItem("leetCodeUsername")) {
          localStorage.setItem("leetCodeUsername", username);
        }

        setLoading(true);

        // First, check if we have cached data in localStorage
        const cachedData = localStorage.getItem(`leetcode_stats_${username}`);
        const cacheTimestamp = localStorage.getItem(
          `leetcode_stats_timestamp_${username}`
        );
        const currentTime = new Date().getTime();

        // Use cached data if it's less than 30 minutes old
        if (
          cachedData &&
          cacheTimestamp &&
          currentTime - parseInt(cacheTimestamp) < 1800000
        ) {
          try {
            const parsedData = JSON.parse(cachedData);
            console.log("Using cached LeetCode stats:", parsedData);
            setStats(parsedData);
            setLoading(false);

            // Refresh in background
            refreshStatsInBackground(username);
            return;
          } catch (cacheError) {
            console.error("Error parsing cached data:", cacheError);
            // Continue with API call if cache parsing fails
          }
        }

        try {
          console.log("Fetching LeetCode stats for:", username);

          // Try direct API call first
          try {
            console.log("Using direct API call to fetch stats");
            const response = await axios.get(
              `${process.env.REACT_APP_BASE_URL}/leetcode/stats/${username}`
            );

            if (response.data.success) {
              console.log("Direct API call successful:", response.data);
              const statsData = response.data.data;
              setStats(statsData);

              // Cache the data in localStorage
              localStorage.setItem(
                `leetcode_stats_${username}`,
                JSON.stringify(statsData)
              );
              localStorage.setItem(
                `leetcode_stats_timestamp_${username}`,
                currentTime.toString()
              );

              return;
            }
          } catch (directApiError) {
            console.error(
              "Direct API call failed, falling back to service:",
              directApiError
            );
          }

          // Fall back to the service function
          const result = await getLeetCodeStats(username, dispatch);
          console.log("LeetCode stats result from service:", result);
          setStats(result);

          // Cache the data in localStorage
          localStorage.setItem(
            `leetcode_stats_${username}`,
            JSON.stringify(result)
          );
          localStorage.setItem(
            `leetcode_stats_timestamp_${username}`,
            currentTime.toString()
          );
        } catch (error) {
          console.error("Error fetching LeetCode stats:", error);

          // Try to use cached data even if it's old
          if (cachedData) {
            try {
              const parsedData = JSON.parse(cachedData);
              console.log("Using old cached LeetCode stats:", parsedData);
              setStats(parsedData);
              toast.warning(
                "Using cached LeetCode stats. Couldn't fetch fresh data."
              );
              return;
            } catch (oldCacheError) {
              console.error("Error parsing old cached data:", oldCacheError);
            }
          }

          // Set default stats if there's an error and no cache
          const defaultStats = {
            username: username,
            solved: { easy: 0, medium: 0, hard: 0, total: 0 },
            submissions: { easy: 0, medium: 0, hard: 0, total: 0 },
            profile: {},
          };
          setStats(defaultStats);
          toast.error("Failed to fetch LeetCode stats. Using default data.");
        } finally {
          setLoading(false);
        }
      }
    };

    // Function to refresh stats in background without showing loading state
    const refreshStatsInBackground = async (username) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/leetcode/stats/${username}`
        );

        if (response.data.success) {
          const statsData = response.data.data;
          setStats(statsData);

          // Update cache
          localStorage.setItem(
            `leetcode_stats_${username}`,
            JSON.stringify(statsData)
          );
          localStorage.setItem(
            `leetcode_stats_timestamp_${username}`,
            new Date().getTime().toString()
          );

          console.log("Background refresh of LeetCode stats successful");
        }
      } catch (error) {
        console.error("Background refresh of LeetCode stats failed:", error);
      }
    };

    fetchStats();
  }, [user?.leetCodeUsername, dispatch]);

  // Check for username in user object or localStorage
  const username =
    user?.leetCodeUsername || localStorage.getItem("leetCodeUsername");

  if (!username) {
    return (
      <Card className="bg-richblack-800 shadow-md">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text style={{ color: "#AFAFAF" }}>
              Connect your LeetCode account to view your stats
            </Text>
          }
        />
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
              Loading LeetCode stats...
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-richblack-800 shadow-md">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text style={{ color: "#AFAFAF" }}>
              Could not fetch LeetCode stats. Please try again later.
            </Text>
          }
        />
        <div className="flex justify-center mt-4">
          <Button
            type="primary"
            onClick={() => getLeetCodeStats(user.leetCodeUsername, dispatch)}
            style={{
              backgroundColor: "#FFD60A",
              borderColor: "#FFD60A",
              color: "#000000",
            }}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  // Create a safe copy of the stats object to avoid modifying the original
  const safeStats = { ...stats };
  console.log("Original stats data:", stats);

  // Validate stats object structure and provide default values
  if (!safeStats.solved) {
    safeStats.solved = { easy: 0, medium: 0, hard: 0, total: 0 };
  } else {
    // Ensure all solved properties exist
    safeStats.solved = {
      easy: safeStats.solved.easy || 0,
      medium: safeStats.solved.medium || 0,
      hard: safeStats.solved.hard || 0,
      total: safeStats.solved.total || 0,
    };
  }

  console.log("Using solved data:", safeStats.solved);

  if (!safeStats.submissions) {
    safeStats.submissions = { easy: 0, medium: 0, hard: 0, total: 0 };
  } else {
    // Ensure all submissions properties exist
    safeStats.submissions = {
      easy: safeStats.submissions.easy || 0,
      medium: safeStats.submissions.medium || 0,
      hard: safeStats.submissions.hard || 0,
      total: safeStats.submissions.total || 0,
    };
  }

  console.log("Using submissions data:", safeStats.submissions);

  if (!safeStats.profile) {
    safeStats.profile = { ranking: 0, reputation: 0, starRating: 0 };
  } else {
    // Ensure all profile properties exist
    safeStats.profile = {
      ranking: safeStats.profile.ranking || 0,
      reputation: safeStats.profile.reputation || 0,
      starRating: safeStats.profile.starRating || 0,
    };
  }

  console.log("Using profile data:", safeStats.profile);

  // Prepare data for pie chart
  const pieData = [
    { name: "Easy", value: safeStats.solved.easy, color: "#00B8A3" },
    { name: "Medium", value: safeStats.solved.medium, color: "#FFC01E" },
    { name: "Hard", value: safeStats.solved.hard, color: "#FF375F" },
  ].filter((item) => item.value > 0); // Only include non-zero values

  // Calculate total problems
  const totalSolved = safeStats.solved.total;
  const totalProblems = 2500; // Approximate total LeetCode problems
  const solvedPercentage = Math.round((totalSolved / totalProblems) * 100);

  return (
    <Card className="bg-richblack-800 shadow-md">
      <Title level={4} style={{ color: "#F5F5F5", marginBottom: 24 }}>
        <CodeOutlined style={{ marginRight: 8, color: "#FFD60A" }} />
        LeetCode Progress
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card className="bg-richblack-700">
            <Statistic
              title={<span style={{ color: "#AFAFAF" }}>Problems Solved</span>}
              value={totalSolved}
              suffix={
                <span style={{ fontSize: 14, color: "#AFAFAF" }}>
                  {" "}
                  / {totalProblems}
                </span>
              }
              valueStyle={{ color: "#F5F5F5" }}
            />
            <Progress
              percent={solvedPercentage}
              status="active"
              strokeColor="#FFD60A"
              trailColor="#424854"
            />
            <div className="flex justify-between mt-4">
              <div>
                <Text style={{ color: "#00B8A3" }}>
                  Easy: {safeStats.solved.easy}
                </Text>
              </div>
              <div>
                <Text style={{ color: "#FFC01E" }}>
                  Medium: {safeStats.solved.medium}
                </Text>
              </div>
              <div>
                <Text style={{ color: "#FF375F" }}>
                  Hard: {safeStats.solved.hard}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="bg-richblack-700" style={{ height: "100%" }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} problems`, name]}
                  contentStyle={{
                    backgroundColor: "#2C333F",
                    borderColor: "#424854",
                  }}
                  itemStyle={{ color: "#F5F5F5" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mt-6">
        <Col xs={24} sm={8}>
          <Card className="bg-richblack-700 text-center">
            <Statistic
              title={<span style={{ color: "#AFAFAF" }}>Submission Rate</span>}
              value={
                safeStats.submissions.total > 0
                  ? Math.round(
                      (totalSolved / safeStats.submissions.total) * 100
                    )
                  : 0
              }
              suffix="%"
              valueStyle={{ color: "#F5F5F5" }}
              prefix={<TrophyOutlined style={{ color: "#FFD60A" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="bg-richblack-700 text-center">
            <Statistic
              title={<span style={{ color: "#AFAFAF" }}>Ranking</span>}
              value={safeStats.profile.ranking || "N/A"}
              valueStyle={{ color: "#F5F5F5" }}
              prefix={<FireOutlined style={{ color: "#FFD60A" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="bg-richblack-700 text-center">
            <Statistic
              title={<span style={{ color: "#AFAFAF" }}>Reputation</span>}
              value={safeStats.profile.reputation || 0}
              valueStyle={{ color: "#F5F5F5" }}
              prefix={<RocketOutlined style={{ color: "#FFD60A" }} />}
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-6 text-center">
        <Button
          type="link"
          href={`https://leetcode.com/${username}`}
          target="_blank"
          style={{ color: "#FFD60A" }}
        >
          View Full Profile on LeetCode
        </Button>
      </div>
    </Card>
  );
};

export default LeetCodeStats;
