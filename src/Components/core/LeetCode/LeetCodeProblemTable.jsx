import React from "react";
import { Table, Tag, Button, Typography, Empty } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

const LeetCodeProblemTable = ({ problems, type }) => {
  // Check if problems is undefined or not an array
  if (!problems || !Array.isArray(problems)) {
    return (
      <Empty
        description={
          <Text style={{ color: "#AFAFAF" }}>No problems available</Text>
        }
      />
    );
  }
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

  const getEmptyText = () => {
    switch (type) {
      case "solved":
        return "You haven't solved any problems yet";
      case "attempted":
        return "You haven't attempted any problems yet";
      case "bookmarked":
        return "You haven't bookmarked any problems yet";
      default:
        return "No problems found";
    }
  };

  return problems.length > 0 ? (
    <Table
      columns={columns}
      dataSource={problems}
      rowKey={(record) =>
        record._id || record.problem?.problemId || Math.random().toString()
      }
      pagination={{ pageSize: 10 }}
      responsive={true}
      scroll={{ x: "max-content" }}
    />
  ) : (
    <Empty
      description={<Text style={{ color: "#AFAFAF" }}>{getEmptyText()}</Text>}
    />
  );
};

export default LeetCodeProblemTable;
