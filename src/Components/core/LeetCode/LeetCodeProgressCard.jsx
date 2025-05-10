import React from "react";
import { Card, Row, Col, Statistic, Progress, Typography, Divider } from "antd";
import {
  TrophyOutlined,
  FireOutlined,
  RocketOutlined,
  CodeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const LeetCodeProgressCard = ({ stats, profile }) => {
  console.log("LeetCodeProgressCard received stats:", stats);
  console.log("LeetCodeProgressCard received profile:", profile);

  // Create safe copies with default values
  const safeStats = stats || {
    solved: 0,
    attempted: 0,
    byDifficulty: { easy: 0, medium: 0, hard: 0 },
  };

  const safeProfile = profile || {
    ranking: 0,
    reputation: 0,
  };

  // Calculate submission rate
  const submissionRate =
    safeStats.attempted > 0
      ? Math.round(
          (safeStats.solved / (safeStats.attempted + safeStats.solved)) * 100
        )
      : 0;

  // Calculate total problems by difficulty
  const totalByDifficulty =
    (safeStats.byDifficulty?.easy || 0) +
    (safeStats.byDifficulty?.medium || 0) +
    (safeStats.byDifficulty?.hard || 0);

  // Calculate percentages for the pie chart
  const easyPercentage =
    totalByDifficulty > 0
      ? Math.round(
          ((safeStats.byDifficulty?.easy || 0) / totalByDifficulty) * 100
        )
      : 0;

  const mediumPercentage =
    totalByDifficulty > 0
      ? Math.round(
          ((safeStats.byDifficulty?.medium || 0) / totalByDifficulty) * 100
        )
      : 0;

  const hardPercentage =
    totalByDifficulty > 0
      ? Math.round(
          ((safeStats.byDifficulty?.hard || 0) / totalByDifficulty) * 100
        )
      : 0;

  return (
    <Card className="bg-richblack-800 shadow-md" bordered={false}>
      <Title level={4} style={{ color: "#F5F5F5", marginBottom: 24 }}>
        <CodeOutlined style={{ marginRight: 8, color: "#FFD60A" }} />
        LeetCode Progress Overview
      </Title>

      <Row gutter={[24, 24]}>
        {/* Left column - Stats */}
        <Col xs={24} md={12}>
          <div className="space-y-6">
            {/* Main stats */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card className="bg-richblack-700 text-center" bordered={false}>
                  <Statistic
                    title={
                      <span style={{ color: "#AFAFAF" }}>Problems Solved</span>
                    }
                    value={safeStats.solved}
                    valueStyle={{ color: "#F5F5F5" }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card className="bg-richblack-700 text-center" bordered={false}>
                  <Statistic
                    title={
                      <span style={{ color: "#AFAFAF" }}>Submission Rate</span>
                    }
                    value={submissionRate}
                    suffix="%"
                    valueStyle={{ color: "#F5F5F5" }}
                  />
                </Card>
              </Col>
            </Row>

            {/* LeetCode profile stats */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card className="bg-richblack-700 text-center" bordered={false}>
                  <Statistic
                    title={<span style={{ color: "#AFAFAF" }}>Ranking</span>}
                    value={safeProfile.ranking || "N/A"}
                    valueStyle={{ color: "#F5F5F5" }}
                    prefix={<FireOutlined style={{ color: "#FFD60A" }} />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card className="bg-richblack-700 text-center" bordered={false}>
                  <Statistic
                    title={<span style={{ color: "#AFAFAF" }}>Reputation</span>}
                    value={safeProfile.reputation || 0}
                    valueStyle={{ color: "#F5F5F5" }}
                    prefix={<RocketOutlined style={{ color: "#FFD60A" }} />}
                  />
                </Card>
              </Col>
            </Row>

            {/* Difficulty distribution */}
            <div>
              <Text
                style={{ color: "#AFAFAF", display: "block", marginBottom: 8 }}
              >
                Difficulty Distribution
              </Text>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#00B8A3]"></div>
                <Text style={{ color: "#00B8A3" }}>
                  Easy: {safeStats.byDifficulty?.easy || 0}
                </Text>
                <Text style={{ color: "#AFAFAF" }}>({easyPercentage}%)</Text>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#FFC01E]"></div>
                <Text style={{ color: "#FFC01E" }}>
                  Medium: {safeStats.byDifficulty?.medium || 0}
                </Text>
                <Text style={{ color: "#AFAFAF" }}>({mediumPercentage}%)</Text>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#FF375F]"></div>
                <Text style={{ color: "#FF375F" }}>
                  Hard: {safeStats.byDifficulty?.hard || 0}
                </Text>
                <Text style={{ color: "#AFAFAF" }}>({hardPercentage}%)</Text>
              </div>
            </div>
          </div>
        </Col>

        {/* Right column - Progress bars */}
        <Col xs={24} md={12}>
          <div className="space-y-6">
            <Title level={5} style={{ color: "#F5F5F5", marginBottom: 16 }}>
              <TrophyOutlined style={{ marginRight: 8, color: "#FFD60A" }} />
              Progress by Difficulty
            </Title>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <Text style={{ color: "#00B8A3" }}>Easy</Text>
                  <Text style={{ color: "#AFAFAF" }}>
                    {safeStats.byDifficulty?.easy || 0} / 500
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    ((safeStats.byDifficulty?.easy || 0) / 500) * 100
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
                    {safeStats.byDifficulty?.medium || 0} / 1000
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    ((safeStats.byDifficulty?.medium || 0) / 1000) * 100
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
                    {safeStats.byDifficulty?.hard || 0} / 500
                  </Text>
                </div>
                <Progress
                  percent={Math.round(
                    ((safeStats.byDifficulty?.hard || 0) / 500) * 100
                  )}
                  strokeColor="#FF375F"
                  trailColor="#424854"
                  status="active"
                />
              </div>
            </div>

            <Divider style={{ borderColor: "#424854" }} />

            <div>
              <Title level={5} style={{ color: "#F5F5F5", marginBottom: 16 }}>
                Overall Progress
              </Title>
              <div className="flex justify-between mb-2">
                <Text style={{ color: "#AFAFAF" }}>Total Solved</Text>
                <Text style={{ color: "#AFAFAF" }}>
                  {safeStats.solved} / 2000
                </Text>
              </div>
              <Progress
                percent={Math.round((safeStats.solved / 2000) * 100)}
                strokeColor="#FFD60A"
                trailColor="#424854"
                status="active"
              />
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default LeetCodeProgressCard;
