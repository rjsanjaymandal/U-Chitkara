import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Editor from "@monaco-editor/react";
import { executeCode } from "../../../services/operations/codePlaygroundAPI";
import "./AntCodePlayground.css";

// Ant Design Components
import {
  Layout,
  Typography,
  Select,
  Button,
  Slider,
  Input,
  Divider,
  Row,
  Col,
  Card,
  Space,
  Tooltip,
  Collapse,
  Spin,
  Alert,
} from "antd";
import {
  PlayCircleOutlined,
  CodeOutlined,
  SettingOutlined,
  LoadingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  RightCircleOutlined,
  BulbOutlined,
  GithubOutlined,
  DownloadOutlined,
  CopyOutlined,
  SaveOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

// Default code templates for different languages
const DEFAULT_CODE = {
  javascript: `// JavaScript code example
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
`,
  python: `# Python code example
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
`,
  cpp: `// C++ code example
#include <iostream>
#include <string>

std::string greet(const std::string& name) {
    return "Hello, " + name + "!";
}

int main() {
    std::cout << greet("World") << std::endl;
    return 0;
}
`,
  java: `// Java code example
public class Main {
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }

    public static void main(String[] args) {
        System.out.println(greet("World"));
    }
}
`,
  c: `// C code example
#include <stdio.h>
#include <string.h>

void greet(char* name, char* result) {
    strcpy(result, "Hello, ");
    strcat(result, name);
    strcat(result, "!");
}

int main() {
    char result[100];
    greet("World", result);
    printf("%s\\n", result);
    return 0;
}
`,
  ruby: `# Ruby code example
def greet(name)
  "Hello, #{name}!"
end

puts greet("World")
`,
  go: `// Go code example
package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    fmt.Println(greet("World"))
}
`,
  rust: `// Rust code example
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("{}", greet("World"));
}
`,
};

// Language options
const LANGUAGE_OPTIONS = [
  {
    value: "javascript",
    label: "JavaScript",
    icon: <i className="devicon-javascript-plain colored" />,
  },
  {
    value: "python",
    label: "Python",
    icon: <i className="devicon-python-plain colored" />,
  },
  {
    value: "cpp",
    label: "C++",
    icon: <i className="devicon-cplusplus-plain colored" />,
  },
  {
    value: "java",
    label: "Java",
    icon: <i className="devicon-java-plain colored" />,
  },
  { value: "c", label: "C", icon: <i className="devicon-c-plain colored" /> },
  {
    value: "ruby",
    label: "Ruby",
    icon: <i className="devicon-ruby-plain colored" />,
  },
  {
    value: "go",
    label: "Go",
    icon: <i className="devicon-go-plain colored" />,
  },
  {
    value: "rust",
    label: "Rust",
    icon: <i className="devicon-rust-plain colored" />,
  },
];

// Theme options
const THEME_OPTIONS = [
  { value: "vs-dark", label: "Dark" },
  { value: "light", label: "Light" },
];

const AntCodePlayground = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // State variables
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [showStdin, setShowStdin] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Set default code when language changes
  useEffect(() => {
    setCode(DEFAULT_CODE[language] || "");
  }, [language]);

  // Handle code execution
  const handleExecuteCode = async () => {
    if (!code.trim()) {
      return;
    }

    // Check if user is logged in
    if (!token) {
      setOutput(
        "Error: You need to be logged in to execute code. Please log in and try again."
      );
      toast.error("Please log in to execute code");
      return;
    }

    setIsExecuting(true);
    setOutput("Executing code...");

    try {
      const result = await executeCode(code, language, stdin, token, dispatch);

      if (result && !result.success && result.message) {
        if (
          result.message.includes("API key") ||
          result.error === "configuration_error"
        ) {
          setOutput(
            "Error: The code execution service is not properly configured. Please contact the administrator.\n\n" +
              "Technical details: The server needs a valid Judge0 API key from RapidAPI to execute code."
          );
          setIsExecuting(false);
          return;
        } else if (result.message.includes("Too many")) {
          setOutput(
            "Error: Too many code execution requests. Please wait a moment and try again.\n\n" +
              "The code execution service has a limit of 5 requests per minute."
          );
          setIsExecuting(false);
          return;
        }
      }

      if (result && result.success) {
        // Format the output
        let formattedOutput = "";

        if (result.stdout) {
          formattedOutput += result.stdout;
        }

        if (result.stderr) {
          formattedOutput += "\n\nError:\n" + result.stderr;
        }

        if (result.compile_output) {
          formattedOutput += "\n\nCompiler Output:\n" + result.compile_output;
        }

        if (result.message) {
          formattedOutput += "\n\nMessage:\n" + result.message;
        }

        if (formattedOutput.trim() === "") {
          formattedOutput = "Program executed successfully with no output.";
        }

        setOutput(formattedOutput);
      } else {
        setOutput(
          "Error: Failed to execute code. Please try again later or contact support."
        );
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput(
        "Error: An unexpected error occurred while executing the code. Please try again later."
      );
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle code change
  const handleCodeChange = (value) => {
    setCode(value);
  };

  // Handle language change
  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  // Handle theme change
  const handleThemeChange = (value) => {
    setTheme(value);
  };

  // Handle font size change
  const handleFontSizeChange = (value) => {
    setFontSize(value);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  // Reset code to default
  const resetCode = () => {
    setCode(DEFAULT_CODE[language] || "");
    toast.success("Code reset to default");
  };

  return (
    <Layout
      className={`code-playground-container ${
        isFullscreen ? "fullscreen" : ""
      }`}
      style={{
        minHeight: isFullscreen ? "100vh" : "calc(100vh - 64px)",
        backgroundColor: theme === "vs-dark" ? "#161D29" : "#f5f5f5",
        marginTop: isFullscreen ? 0 : "16px",
      }}
    >
      <Sider
        width={280}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        theme={theme === "vs-dark" ? "dark" : "light"}
        style={{
          overflow: "auto",
          height: "100%",
          position: isFullscreen ? "fixed" : "relative",
          left: isFullscreen ? 0 : undefined,
          top: isFullscreen ? 0 : undefined,
          bottom: isFullscreen ? 0 : undefined,
          zIndex: isFullscreen ? 1001 : 10,
        }}
      >
        <div className="p-4">
          <div className="mb-6">
            <Title
              level={4}
              style={{ color: theme === "vs-dark" ? "#fff" : "#000" }}
            >
              Code Playground
            </Title>
            <Text type="secondary">Write, run, and test your code</Text>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div className="mb-4">
            <Text
              strong
              style={{ color: theme === "vs-dark" ? "#fff" : "#000" }}
            >
              Language
            </Text>
            <Select
              value={language}
              onChange={handleLanguageChange}
              style={{ width: "100%", marginTop: 8 }}
              options={LANGUAGE_OPTIONS}
              optionRender={(option) => (
                <Space>
                  {option.data.icon || <CodeOutlined />}
                  {option.data.label}
                </Space>
              )}
            />
          </div>

          <div className="mb-4">
            <Text
              strong
              style={{ color: theme === "vs-dark" ? "#fff" : "#000" }}
            >
              Theme
            </Text>
            <Select
              value={theme}
              onChange={handleThemeChange}
              style={{ width: "100%", marginTop: 8 }}
              options={THEME_OPTIONS}
            />
          </div>

          <div className="mb-4">
            <Text
              strong
              style={{ color: theme === "vs-dark" ? "#fff" : "#000" }}
            >
              Font Size: {fontSize}px
            </Text>
            <Slider
              min={12}
              max={24}
              value={fontSize}
              onChange={handleFontSizeChange}
              style={{ marginTop: 8 }}
            />
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div className="mb-4">
            <Collapse
              ghost
              expandIconPosition="end"
              style={{ backgroundColor: "transparent" }}
            >
              <Panel
                header={
                  <Text
                    strong
                    style={{ color: theme === "vs-dark" ? "#fff" : "#000" }}
                  >
                    Standard Input
                  </Text>
                }
                key="1"
              >
                <TextArea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Enter input for your program..."
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  style={{ marginTop: 8 }}
                />
              </Panel>
            </Collapse>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <Space direction="vertical" style={{ width: "100%" }}>
            {token ? (
              <Button
                type="primary"
                icon={
                  isExecuting ? <LoadingOutlined /> : <PlayCircleOutlined />
                }
                onClick={handleExecuteCode}
                disabled={isExecuting || !code.trim()}
                loading={isExecuting}
                block
                size="large"
              >
                {isExecuting ? "Executing..." : "Run Code"}
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  block
                  size="large"
                >
                  Login to Run Code
                </Button>
              </Link>
            )}

            <Space style={{ marginTop: 12 }}>
              <Tooltip title="Copy Code">
                <Button icon={<CopyOutlined />} onClick={copyCode} />
              </Tooltip>
              <Tooltip title="Reset Code">
                <Button icon={<ReloadOutlined />} onClick={resetCode} />
              </Tooltip>
              <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <Button
                  icon={
                    isFullscreen ? (
                      <FullscreenExitOutlined />
                    ) : (
                      <FullscreenOutlined />
                    )
                  }
                  onClick={toggleFullscreen}
                />
              </Tooltip>
            </Space>
          </Space>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 280,
          transition: "all 0.2s",
          backgroundColor: theme === "vs-dark" ? "#1e1e1e" : "#f5f5f5",
        }}
      >
        <Content style={{ margin: "16px", overflow: "initial" }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                bordered={false}
                className="editor-card"
                style={{
                  backgroundColor: theme === "vs-dark" ? "#2C333F" : "#ffffff",
                  height: isFullscreen ? "calc(70vh)" : "calc(60vh - 64px)",
                }}
                bodyStyle={{ padding: 0, height: "100%" }}
              >
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  theme={theme}
                  onChange={handleCodeChange}
                  options={{
                    fontSize: fontSize,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                    lineNumbers: "on",
                    folding: true,
                    renderLineHighlight: "all",
                  }}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title={
                  <Space>
                    <FileTextOutlined />
                    <span>Output</span>
                  </Space>
                }
                bordered={false}
                style={{
                  backgroundColor: theme === "vs-dark" ? "#2C333F" : "#ffffff",
                  height: isFullscreen
                    ? "calc(30vh - 32px)"
                    : "calc(40vh - 64px)",
                }}
                bodyStyle={{
                  padding: "12px",
                  height: "calc(100% - 57px)",
                  overflow: "auto",
                  backgroundColor: theme === "vs-dark" ? "#161D29" : "#f5f5f5",
                  borderRadius: "0 0 8px 8px",
                }}
              >
                {isExecuting ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                      }
                      tip="Executing code..."
                    />
                  </div>
                ) : (
                  <pre
                    style={{
                      fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                      fontSize: "14px",
                      margin: 0,
                      color: theme === "vs-dark" ? "#d4d4d4" : "#333",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {output || "Run your code to see the output here..."}
                  </pre>
                )}
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AntCodePlayground;
