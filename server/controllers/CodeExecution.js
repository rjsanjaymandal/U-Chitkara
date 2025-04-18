const axios = require("axios");
const rateLimit = require("express-rate-limit");

// Language IDs for Judge0 API
const LANGUAGE_IDS = {
  javascript: 63, // JavaScript (Node.js 12.14.0)
  python: 71, // Python (3.8.1)
  cpp: 54, // C++ (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
  c: 50, // C (GCC 9.2.0)
  ruby: 72, // Ruby (2.7.0)
  go: 60, // Go (1.13.5)
  rust: 73, // Rust (1.40.0)
};

// Create rate limiter middleware
exports.codeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: {
    success: false,
    message: "Too many code execution requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Execute code using Judge0 API
exports.executeCode = async (req, res) => {
  try {
    // Log environment variables for debugging (don't log the full API key in production)
    console.log(
      "JUDGE0_API_KEY configured:",
      process.env.JUDGE0_API_KEY ? "Yes" : "No"
    );
    console.log(
      "JUDGE0_API_KEY is default placeholder:",
      process.env.JUDGE0_API_KEY === "your_judge0_api_key_from_rapidapi"
    );

    // Check if Judge0 API key is configured
    if (
      !process.env.JUDGE0_API_KEY ||
      process.env.JUDGE0_API_KEY === "your_judge0_api_key_from_rapidapi"
    ) {
      console.log("Judge0 API key is not properly configured");
      return res.status(500).json({
        success: false,
        message:
          "Server configuration error: Judge0 API key is not configured. Please contact the administrator.",
      });
    }

    const { code, language } = req.body;

    // Validate request
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    if (!language || !LANGUAGE_IDS[language.toLowerCase()]) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unsupported language",
      });
    }

    // Get language ID
    const languageId = LANGUAGE_IDS[language.toLowerCase()];

    // Prepare request for Judge0 API
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "false", fields: "*" },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      data: {
        language_id: languageId,
        source_code: code,
        stdin: req.body.stdin || "",
      },
    };

    // Log the request details (without the full API key)
    console.log("Submitting code to Judge0 API:");
    console.log("Language ID:", languageId);
    console.log("Code length:", code.length, "characters");
    console.log("Stdin provided:", req.body.stdin ? "Yes" : "No");

    // Declare token variable outside the try block so it's accessible in the outer scope
    let token;

    try {
      // Submit code to Judge0 API
      const response = await axios.request(options);
      console.log("Judge0 API submission response:", response.data);
      token = response.data.token;

      if (!token) {
        console.log("No token received from Judge0 API");
        return res.status(500).json({
          success: false,
          message: "Failed to submit code for execution",
        });
      }
      console.log("Received token from Judge0 API:", token);
    } catch (apiError) {
      console.error("Error submitting code to Judge0 API:", apiError.message);
      if (apiError.response) {
        console.error("Judge0 API response status:", apiError.response.status);
        console.error("Judge0 API response data:", apiError.response.data);
      }
      throw apiError; // Re-throw to be caught by the outer catch block
    }

    // Poll for results
    let result;
    let attempts = 0;
    const maxAttempts = 10; // Maximum number of polling attempts

    console.log(`Starting to poll for results with token: ${token}`);

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Polling attempt ${attempts}/${maxAttempts}`);

      // Wait for 1 second between polling attempts
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get submission status
      const statusOptions = {
        method: "GET",
        url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        params: { base64_encoded: "false", fields: "*" },
        headers: {
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      };

      try {
        console.log(`Requesting status for token: ${token}`);
        const statusResponse = await axios.request(statusOptions);
        const status = statusResponse.data;
        console.log(
          `Status response:`,
          status.status ? status.status : "No status field"
        );

        // Check if execution is complete
        if (status.status && status.status.id >= 3) {
          // 3 = Finished
          console.log(
            `Execution complete with status: ${status.status.description}`
          );
          result = status;
          break;
        } else {
          console.log(
            `Execution still in progress, status: ${
              status.status ? status.status.description : "Unknown"
            }`
          );
        }
      } catch (pollError) {
        console.error(
          `Error polling for results (attempt ${attempts}):`,
          pollError.message
        );
        if (pollError.response) {
          console.error("Poll response status:", pollError.response.status);
          console.error("Poll response data:", pollError.response.data);
        }
        // Continue polling despite errors
      }
    }

    if (!result) {
      return res.status(408).json({
        success: false,
        message: "Code execution timed out",
      });
    }

    // Format the response
    const executionResult = {
      success: true,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compile_output: result.compile_output || "",
      message: result.message || "",
      time: result.time,
      memory: result.memory,
      status: {
        id: result.status.id,
        description: result.status.description,
      },
    };

    // Return the execution result
    return res.status(200).json(executionResult);
  } catch (error) {
    console.error("Error executing code:", error);

    // Check if the error is related to the Judge0 API key
    if (error.message && error.message.includes("API key")) {
      return res.status(500).json({
        success: false,
        message:
          "Server configuration error: Judge0 API key is missing or invalid. Please contact the administrator.",
      });
    }

    // Check for network errors
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return res.status(500).json({
        success: false,
        message:
          "Could not connect to the code execution service. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to execute code",
      error: error.message,
    });
  }
};
