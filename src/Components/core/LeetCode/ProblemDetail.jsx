import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProblemById,
  updateProblemProgress,
} from "../../../services/operations/leetCodeAPI";
import { executeCode } from "../../../services/operations/codePlaygroundAPI";
import { getAuthToken } from "../../../utils/tokenUtils";
import {
  Card,
  Typography,
  Divider,
  Tag,
  Button,
  Space,
  Select,
  Tabs,
  Tooltip,
  Spin,
  message,
  Modal,
  Input,
  Rate,
} from "antd";
import {
  CodeOutlined,
  PlayCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
// Import rehype plugins for better markdown rendering if needed
// import rehypeRaw from 'rehype-raw';
// import rehypeSanitize from 'rehype-sanitize';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Default code templates for different languages
const DEFAULT_CODE = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your solution here
};`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your solution here
        pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[]{0, 0};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
        return {0, 0};
    }
};`,
};

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  // State variables
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [notes, setNotes] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [fontSize, setFontSize] = useState(14);

  // Fetch problem details
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const result = await getProblemById(id, dispatch);
        if (result) {
          setProblem(result);

          // Set code snippet if available
          if (result.codeSnippets && result.codeSnippets.length > 0) {
            const snippet = result.codeSnippets.find(
              (s) => s.language.toLowerCase() === language
            );
            if (snippet) {
              setCode(snippet.code);
            } else {
              setCode(DEFAULT_CODE[language] || "");
            }
          } else {
            setCode(DEFAULT_CODE[language] || "");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, dispatch, language]);

  // Handle language change
  const handleLanguageChange = (value) => {
    setLanguage(value);

    // Update code snippet based on language
    if (problem && problem.codeSnippets && problem.codeSnippets.length > 0) {
      const snippet = problem.codeSnippets.find(
        (s) => s.language.toLowerCase() === value
      );
      if (snippet) {
        setCode(snippet.code);
      } else {
        setCode(DEFAULT_CODE[value] || "");
      }
    } else {
      setCode(DEFAULT_CODE[value] || "");
    }
  };

  // Handle code execution
  const handleExecuteCode = async () => {
    // Get token from Redux or localStorage
    const authToken = token || getAuthToken();

    if (!authToken) {
      message.warning("Please log in to execute code");
      return;
    }

    setIsExecuting(true);
    setOutput("");

    try {
      const result = await executeCode(code, language, "", authToken, dispatch);

      if (result && result.success) {
        let outputText = "";

        if (result.compile_output) {
          outputText += `Compilation Output:\n${result.compile_output}\n\n`;
        }

        if (result.stdout) {
          outputText += result.stdout;
        }

        if (result.stderr) {
          outputText += `Error:\n${result.stderr}`;
        }

        if (result.message) {
          outputText += `\n${result.message}`;
        }

        setOutput(outputText || "No output");
      } else {
        setOutput(result?.message || "Execution failed");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle problem status update
  const handleUpdateStatus = async (status) => {
    // Get token from Redux or localStorage
    const authToken = token || getAuthToken();

    if (!authToken) {
      message.warning("Please log in to track your progress");
      return;
    }

    try {
      await updateProblemProgress(
        {
          problemId: problem.problemId,
          status,
          code,
          language,
        },
        authToken,
        dispatch
      );
    } catch (error) {
      message.error("Failed to update problem status");
    }
  };

  // Handle notes submission
  const handleNotesSubmit = async () => {
    // Get token from Redux or localStorage
    const authToken = token || getAuthToken();

    if (!authToken) {
      message.warning("Please log in to save notes");
      return;
    }

    try {
      await updateProblemProgress(
        {
          problemId: problem.problemId,
          status: "attempted",
          notes,
          difficulty,
        },
        authToken,
        dispatch
      );
      setNotesModalVisible(false);
      message.success("Notes saved successfully");
    } catch (error) {
      message.error("Failed to save notes");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-3 text-richblack-300">Loading problem...</div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <Title level={4} style={{ color: "#F5F5F5" }}>
          Problem not found
        </Title>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/leetcode/problems")}
          style={{
            marginTop: 16,
            backgroundColor: "#FFD60A",
            borderColor: "#FFD60A",
            color: "#000000",
          }}
        >
          Back to Problems
        </Button>
      </div>
    );
  }

  // Determine difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Hard":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Problem Description */}
      <Card className="bg-richblack-800 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/leetcode/problems")}
            style={{
              backgroundColor: "transparent",
              borderColor: "#424854",
              color: "#F5F5F5",
            }}
          >
            Back
          </Button>

          {token && (
            <Space>
              <Tooltip title="Mark as Solved">
                <Button
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleUpdateStatus("solved")}
                  style={{
                    backgroundColor: "#52C41A",
                    borderColor: "#52C41A",
                    color: "#FFFFFF",
                  }}
                >
                  Solved
                </Button>
              </Tooltip>
              <Tooltip title="Bookmark Problem">
                <Button
                  icon={<BookOutlined />}
                  onClick={() => handleUpdateStatus("bookmarked")}
                  style={{
                    backgroundColor: "#FAAD14",
                    borderColor: "#FAAD14",
                    color: "#FFFFFF",
                  }}
                >
                  Bookmark
                </Button>
              </Tooltip>
              <Tooltip title="Add Notes">
                <Button
                  icon={<SaveOutlined />}
                  onClick={() => setNotesModalVisible(true)}
                  style={{
                    backgroundColor: "#1890FF",
                    borderColor: "#1890FF",
                    color: "#FFFFFF",
                  }}
                >
                  Notes
                </Button>
              </Tooltip>
            </Space>
          )}
        </div>

        <Title level={3} style={{ color: "#F5F5F5" }}>
          {problem.problemId}. {problem.title}
        </Title>

        <div className="flex flex-wrap gap-2 mb-4">
          <Tag color={getDifficultyColor(problem.difficulty)}>
            {problem.difficulty}
          </Tag>
          {problem.tags &&
            problem.tags.map((tag) => (
              <Tag key={tag} color="default">
                {tag}
              </Tag>
            ))}
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="custom-tabs"
          items={[
            {
              key: "description",
              label: "Description",
              children: (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                  // Add rehype plugins if needed
                  // rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  >
                    {problem.description}
                  </ReactMarkdown>
                </div>
              ),
            },
            {
              key: "hints",
              label: "Hints",
              children:
                problem.hints && problem.hints.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {problem.hints.map((hint, index) => (
                      <li key={index} className="mb-2 text-richblack-100">
                        {hint}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Text style={{ color: "#AFAFAF" }}>No hints available</Text>
                ),
            },
            {
              key: "solution",
              label: "Solution",
              children: problem.solution ? (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                  // Add rehype plugins if needed
                  // rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  >
                    {problem.solution}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-6">
                  <InfoCircleOutlined
                    style={{ fontSize: 24, color: "#AFAFAF" }}
                  />
                  <Paragraph style={{ color: "#AFAFAF", marginTop: 8 }}>
                    Solution is not available for this problem.
                  </Paragraph>
                  <Button
                    type="link"
                    href={problem.url}
                    target="_blank"
                    style={{ color: "#FFD60A" }}
                  >
                    View on LeetCode
                  </Button>
                </div>
              ),
            },
            {
              key: "companies",
              label: "Companies",
              children:
                problem.companies && problem.companies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map((company) => (
                      <Tag key={company} color="blue">
                        {company}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <Text style={{ color: "#AFAFAF" }}>
                    No company information available
                  </Text>
                ),
            },
          ]}
        />
      </Card>

      {/* Code Editor */}
      <div className="flex flex-col h-full">
        <Card className="bg-richblack-800 shadow-md mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <CodeOutlined style={{ color: "#FFD60A", marginRight: 8 }} />
              <Text strong style={{ color: "#F5F5F5" }}>
                Code Editor
              </Text>
            </div>
            <Space>
              <Select
                value={language}
                onChange={handleLanguageChange}
                style={{
                  width: 120,
                  backgroundColor: "#2C333F",
                  borderColor: "#424854",
                }}
              >
                <Option value="javascript">JavaScript</Option>
                <Option value="python">Python</Option>
                <Option value="java">Java</Option>
                <Option value="cpp">C++</Option>
              </Select>
              <Select
                value={theme}
                onChange={(value) => setTheme(value)}
                style={{
                  width: 100,
                  backgroundColor: "#2C333F",
                  borderColor: "#424854",
                }}
              >
                <Option value="vs-dark">Dark</Option>
                <Option value="light">Light</Option>
              </Select>
              <Select
                value={fontSize}
                onChange={(value) => setFontSize(value)}
                style={{
                  width: 80,
                  backgroundColor: "#2C333F",
                  borderColor: "#424854",
                }}
              >
                {[12, 14, 16, 18, 20].map((size) => (
                  <Option key={size} value={size}>
                    {size}px
                  </Option>
                ))}
              </Select>
            </Space>
          </div>

          <div className="h-[400px] border border-richblack-700 rounded-md overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme={theme}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>

          <div className="mt-4 flex justify-between">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleExecuteCode}
              loading={isExecuting}
              style={{
                backgroundColor: "#FFD60A",
                borderColor: "#FFD60A",
                color: "#000000",
              }}
            >
              {isExecuting ? "Executing..." : "Run Code"}
            </Button>
            <Button
              type="link"
              href={problem.url}
              target="_blank"
              style={{ color: "#FFD60A" }}
            >
              View on LeetCode
            </Button>
          </div>
        </Card>

        {/* Output Console */}
        <Card
          title={
            <div className="flex items-center">
              <CodeOutlined style={{ color: "#FFD60A", marginRight: 8 }} />
              <Text strong style={{ color: "#F5F5F5" }}>
                Output
              </Text>
            </div>
          }
          className="bg-richblack-800 shadow-md flex-grow"
          bodyStyle={{
            backgroundColor: "#161D29",
            padding: 16,
            height: "calc(100% - 57px)",
            overflow: "auto",
          }}
        >
          {isExecuting ? (
            <div className="flex justify-center items-center h-full flex-col">
              <Spin />
              <div className="mt-3 text-richblack-300">Executing code...</div>
            </div>
          ) : (
            <pre
              style={{
                fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                fontSize: "14px",
                margin: 0,
                color: "#d4d4d4",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {output || "Run your code to see the output here..."}
            </pre>
          )}
        </Card>
      </div>

      {/* Notes Modal */}
      <Modal
        title="Problem Notes"
        open={notesModalVisible}
        onCancel={() => setNotesModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setNotesModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleNotesSubmit}
            style={{
              backgroundColor: "#FFD60A",
              borderColor: "#FFD60A",
              color: "#000000",
            }}
          >
            Save Notes
          </Button>,
        ]}
      >
        <div className="mb-4">
          <Text style={{ display: "block", marginBottom: 8 }}>
            Rate difficulty (1-5):
          </Text>
          <Rate
            character={<StarOutlined />}
            value={difficulty}
            onChange={setDifficulty}
          />
        </div>
        <TextArea
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your notes, approach, or things to remember about this problem..."
        />
      </Modal>
    </div>
  );
};

export default ProblemDetail;
