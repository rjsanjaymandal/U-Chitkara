import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllProblems,
  getUserProgress,
} from "../../../services/operations/leetCodeAPI";
import { getAuthToken } from "../../../utils/tokenUtils";
import {
  Table,
  Tag,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Card,
  Tooltip,
  Pagination,
  Spin,
  Empty,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CodeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const ProblemList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  // State variables
  const [problems, setProblems] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    difficulty: "",
    tags: [],
    search: "",
    status: "",
  });

  // Fetch problems and user progress
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch problems
        const result = await getAllProblems(
          {
            difficulty: filters.difficulty,
            tags: filters.tags,
            search: filters.search,
          },
          pagination.current,
          pagination.pageSize,
          dispatch
        );

        if (result) {
          setProblems(result.problems);
          setPagination({
            ...pagination,
            total: result.pagination.total,
          });
        }

        // Fetch user progress if logged in
        const authToken = token || getAuthToken();
        if (authToken) {
          const progressResult = await getUserProgress(
            null,
            authToken,
            dispatch
          );
          if (progressResult) {
            // Create a map of problem ID to progress status
            const progressMap = {};

            // Process solved problems
            progressResult.progress.solved.forEach((item) => {
              progressMap[item.problem.problemId] = {
                status: "solved",
                _id: item._id,
              };
            });

            // Process attempted problems
            progressResult.progress.attempted.forEach((item) => {
              progressMap[item.problem.problemId] = {
                status: "attempted",
                _id: item._id,
              };
            });

            // Process bookmarked problems
            progressResult.progress.bookmarked.forEach((item) => {
              progressMap[item.problem.problemId] = {
                status: "bookmarked",
                _id: item._id,
              };
            });

            setUserProgress(progressMap);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, token, pagination.current, pagination.pageSize, filters]);

  // Handle pagination change
  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize,
    });
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
    setPagination({
      ...pagination,
      current: 1, // Reset to first page when filters change
    });
  };

  // Handle search
  const handleSearch = (value) => {
    handleFilterChange("search", value);
  };

  // Get status tag for a problem
  const getStatusTag = (problemId) => {
    const progress = userProgress[problemId];
    if (!progress) return null;

    switch (progress.status) {
      case "solved":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Solved
          </Tag>
        );
      case "attempted":
        return (
          <Tag color="processing" icon={<ClockCircleOutlined />}>
            Attempted
          </Tag>
        );
      case "bookmarked":
        return (
          <Tag color="warning" icon={<BookOutlined />}>
            Bookmarked
          </Tag>
        );
      default:
        return null;
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Status",
      key: "status",
      width: 100,
      render: (_, record) => getStatusTag(record.problemId) || <span>-</span>,
      filters: [
        { text: "Solved", value: "solved" },
        { text: "Attempted", value: "attempted" },
        { text: "Bookmarked", value: "bookmarked" },
        { text: "Unsolved", value: "unsolved" },
      ],
      onFilter: (value, record) => {
        const progress = userProgress[record.problemId];
        if (value === "unsolved") {
          return !progress;
        }
        return progress && progress.status === value;
      },
    },
    {
      title: "#",
      dataIndex: "problemId",
      key: "problemId",
      width: 80,
      sorter: (a, b) => a.problemId - b.problemId,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link
          to={`/leetcode/problem/${record.problemId}`}
          className="text-blue-500 hover:text-blue-700"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 120,
      render: (difficulty) => {
        let color = "default";
        if (difficulty === "Easy") color = "success";
        if (difficulty === "Medium") color = "warning";
        if (difficulty === "Hard") color = "error";
        return <Tag color={color}>{difficulty}</Tag>;
      },
      filters: [
        { text: "Easy", value: "Easy" },
        { text: "Medium", value: "Medium" },
        { text: "Hard", value: "Hard" },
      ],
      onFilter: (value, record) => record.difficulty === value,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) =>
        tags && tags.length > 0 ? (
          <span>
            {tags.slice(0, 2).map((tag) => (
              <Tag key={tag} color="default" style={{ marginRight: 4 }}>
                {tag}
              </Tag>
            ))}
            {tags.length > 2 && (
              <Tooltip title={tags.slice(2).join(", ")}>
                <Tag color="default">+{tags.length - 2}</Tag>
              </Tooltip>
            )}
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<CodeOutlined />}
          size="small"
          onClick={() => navigate(`/leetcode/problem/${record.problemId}`)}
          style={{
            backgroundColor: "#FFD60A",
            borderColor: "#FFD60A",
            color: "#000000",
          }}
        >
          Solve
        </Button>
      ),
    },
  ];

  return (
    <Card className="bg-richblack-800 shadow-md">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Title level={4} style={{ color: "#F5F5F5", margin: 0 }}>
          <CodeOutlined style={{ marginRight: 8, color: "#FFD60A" }} />
          LeetCode Problems
        </Title>

        <Space wrap>
          <Input
            placeholder="Search problems"
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: 200,
              backgroundColor: "#2C333F",
              borderColor: "#424854",
              color: "#F5F5F5",
            }}
          />

          <Select
            placeholder="Difficulty"
            allowClear
            onChange={(value) => handleFilterChange("difficulty", value)}
            style={{
              width: 120,
              backgroundColor: "#2C333F",
              borderColor: "#424854",
              color: "#F5F5F5",
            }}
          >
            <Option value="Easy">Easy</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Hard">Hard</Option>
          </Select>

          <Select
            placeholder="Status"
            allowClear
            onChange={(value) => handleFilterChange("status", value)}
            style={{
              width: 120,
              backgroundColor: "#2C333F",
              borderColor: "#424854",
              color: "#F5F5F5",
            }}
          >
            <Option value="solved">Solved</Option>
            <Option value="attempted">Attempted</Option>
            <Option value="bookmarked">Bookmarked</Option>
            <Option value="unsolved">Unsolved</Option>
          </Select>
        </Space>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-3 text-richblack-300">Loading problems...</div>
          </div>
        </div>
      ) : problems.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={problems}
            rowKey="problemId"
            pagination={false}
            className="custom-table"
          />
          <div className="flex justify-end mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} problems`}
            />
          </div>
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text style={{ color: "#AFAFAF" }}>
              No problems found. Try adjusting your filters.
            </Text>
          }
        />
      )}
    </Card>
  );
};

export default ProblemList;
