import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Editor from "@monaco-editor/react";
import { executeCode } from "../../../services/operations/codePlaygroundAPI";
import {
  FaPlay,
  FaSpinner,
  FaCode,
  FaTerminal,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

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
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

// Theme options
const THEME_OPTIONS = [
  { value: "vs-dark", label: "Dark" },
  { value: "light", label: "Light" },
];

const CodePlayground = () => {
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

      // Check for server configuration error
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

      if (result) {
        // Format the output
        let formattedOutput = "";

        if (result.stdout) {
          formattedOutput += result.stdout;
        }

        if (result.stderr) {
          formattedOutput += `\nError: ${result.stderr}`;
        }

        if (result.compile_output) {
          formattedOutput += `\nCompilation: ${result.compile_output}`;
        }

        if (result.message) {
          formattedOutput += `\nMessage: ${result.message}`;
        }

        if (result.status && result.status.description !== "Accepted") {
          formattedOutput += `\nStatus: ${result.status.description}`;
        }

        if (formattedOutput.trim() === "") {
          formattedOutput = "No output";
        }

        setOutput(formattedOutput);
      } else {
        setOutput(
          "Failed to execute code. Please try again.\n\n" +
            "Possible reasons:\n" +
            "1. The server might be experiencing issues\n" +
            "2. The Judge0 API service might be down\n" +
            "3. The server's API key might be invalid or expired\n\n" +
            "Please try again later or contact the administrator."
        );
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput(
        `Error: ${error.message || "Failed to execute code"}\n\n` +
          "If this error persists, please try the following:\n" +
          "1. Check your internet connection\n" +
          "2. Try a different browser\n" +
          "3. Try a simpler code example\n" +
          "4. Contact the administrator"
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
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Handle theme change
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  // Handle font size change
  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value));
  };

  return (
    <div className="w-11/12 max-w-maxContent mx-auto py-8">
      <h1 className="text-3xl font-bold text-richblack-5 mb-6">
        Code Playground
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Language selector */}
        <div className="relative">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="appearance-none bg-richblack-700 text-richblack-5 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-yellow-50"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-400" />
        </div>

        {/* Theme selector */}
        <div className="relative">
          <select
            value={theme}
            onChange={handleThemeChange}
            className="appearance-none bg-richblack-700 text-richblack-5 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-yellow-50"
          >
            {THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-400" />
        </div>

        {/* Font size selector */}
        <div className="relative">
          <select
            value={fontSize}
            onChange={handleFontSizeChange}
            className="appearance-none bg-richblack-700 text-richblack-5 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-yellow-50"
          >
            {[12, 14, 16, 18, 20, 22, 24].map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-400" />
        </div>

        {/* Execute button */}
        {token ? (
          <button
            onClick={handleExecuteCode}
            disabled={isExecuting || !code.trim()}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
              isExecuting || !code.trim()
                ? "bg-richblack-700 text-richblack-300 cursor-not-allowed"
                : "bg-yellow-50 text-richblack-900 hover:bg-yellow-25"
            }`}
          >
            {isExecuting ? (
              <>
                <FaSpinner className="animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <FaPlay />
                Run Code
              </>
            )}
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-md font-medium bg-yellow-50 text-richblack-900 hover:bg-yellow-25"
          >
            <FaPlay />
            Login to Run Code
          </Link>
        )}

        {/* Toggle stdin */}
        <button
          onClick={() => setShowStdin(!showStdin)}
          className="flex items-center gap-2 px-4 py-2 bg-richblack-700 text-richblack-5 rounded-md hover:bg-richblack-600"
        >
          <FaTerminal />
          {showStdin ? "Hide Input" : "Show Input"}
          {showStdin ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code editor */}
        <div className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700">
          <div className="bg-richblack-900 px-4 py-2 flex items-center gap-2">
            <FaCode className="text-yellow-50" />
            <span className="text-richblack-5 font-medium">Code Editor</span>
          </div>
          <Editor
            height="60vh"
            language={language}
            value={code}
            theme={theme}
            onChange={handleCodeChange}
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

        {/* Output and stdin */}
        <div className="flex flex-col gap-4">
          {/* Stdin (conditionally rendered) */}
          {showStdin && (
            <div className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700">
              <div className="bg-richblack-900 px-4 py-2 flex items-center gap-2">
                <FaTerminal className="text-yellow-50" />
                <span className="text-richblack-5 font-medium">
                  Standard Input
                </span>
              </div>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter input for your program..."
                className="w-full h-32 p-4 bg-richblack-800 text-richblack-5 focus:outline-none resize-none"
              />
            </div>
          )}

          {/* Output console */}
          <div className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700 flex-grow">
            <div className="bg-richblack-900 px-4 py-2 flex items-center gap-2">
              <FaTerminal className="text-yellow-50" />
              <span className="text-richblack-5 font-medium">Output</span>
            </div>
            <pre className="p-4 text-richblack-5 font-mono text-sm whitespace-pre-wrap h-[calc(60vh-40px)] overflow-auto">
              {output || "Run your code to see the output here..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
