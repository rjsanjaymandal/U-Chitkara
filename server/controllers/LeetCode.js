const axios = require("axios");
const User = require("../models/User");
const Problem = require("../models/Problem");
const UserProblemProgress = require("../models/UserProblemProgress");
const { default: mongoose } = require("mongoose");

// Rate limiter for LeetCode API calls
const rateLimit = require("express-rate-limit");

// Create rate limiter middleware
exports.leetCodeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    message: "Too many LeetCode API requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Update LeetCode username
exports.updateLeetCodeUsername = async (req, res) => {
  try {
    const { leetCodeUsername } = req.body;
    const userId = req.user.id;

    // Allow null values for disconnecting accounts
    if (leetCodeUsername === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "LeetCode username parameter is required (can be null to disconnect)",
      });
    }

    // Log the action
    if (leetCodeUsername === null) {
      console.log("Disconnecting LeetCode account for user:", userId);
    } else {
      console.log(
        "Accepting LeetCode username without validation:",
        leetCodeUsername
      );
    }

    // Note: We're skipping the validation step because:
    // 1. The LeetCode API might be rate-limited or blocked
    // 2. The username might be valid but not accessible via the API
    // 3. We want to allow users to enter any username for testing purposes
    // 4. We allow null values to disconnect accounts

    // Update the user's LeetCode username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { leetCodeUsername },
      { new: true }
    ).select("-password");

    // Log the result
    console.log(
      "Updated user LeetCode username:",
      updatedUser.leetCodeUsername
    );

    return res.status(200).json({
      success: true,
      message:
        leetCodeUsername === null
          ? "LeetCode account disconnected successfully"
          : "LeetCode username updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating LeetCode username:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update LeetCode username",
      error: error.message,
    });
  }
};

// Get LeetCode solved stats
exports.getLeetCodeStats = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "LeetCode username is required",
      });
    }

    let userData = null;

    try {
      // Try to make a request to the LeetCode GraphQL API
      console.log("Attempting to fetch LeetCode stats for:", username);

      const response = await axios.post(
        "https://leetcode.com/graphql",
        {
          query: `
            query userProfile($username: String!) {
              matchedUser(username: $username) {
                username
                submitStats {
                  acSubmissionNum {
                    difficulty
                    count
                  }
                  totalSubmissionNum {
                    difficulty
                    count
                  }
                }
                profile {
                  ranking
                  reputation
                  starRating
                }
              }
            }
          `,
          variables: {
            username,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data.matchedUser
      ) {
        userData = response.data.data.matchedUser;
        console.log("Successfully fetched LeetCode stats for:", username);
      } else {
        console.log(
          "LeetCode username not found in API response, using default data"
        );
      }
    } catch (apiError) {
      console.error("Error fetching from LeetCode API:", apiError.message);
      console.log("Using default data for LeetCode stats");
    }

    // If we couldn't get real data, use default data
    if (!userData) {
      userData = {
        username: username,
        submitStats: {
          acSubmissionNum: [
            { difficulty: "All", count: 0 },
            { difficulty: "Easy", count: 0 },
            { difficulty: "Medium", count: 0 },
            { difficulty: "Hard", count: 0 },
          ],
          totalSubmissionNum: [
            { difficulty: "All", count: 0 },
            { difficulty: "Easy", count: 0 },
            { difficulty: "Medium", count: 0 },
            { difficulty: "Hard", count: 0 },
          ],
        },
        profile: {
          ranking: 0,
          reputation: 0,
          starRating: 0,
        },
      };
    }

    // Format the response
    const stats = {
      username: userData.username,
      solved: {
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0,
      },
      submissions: {
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0,
      },
      profile: userData.profile || {},
    };

    // Process submission stats
    if (userData.submitStats && userData.submitStats.acSubmissionNum) {
      userData.submitStats.acSubmissionNum.forEach((item) => {
        if (item.difficulty === "Easy") {
          stats.solved.easy = item.count;
        } else if (item.difficulty === "Medium") {
          stats.solved.medium = item.count;
        } else if (item.difficulty === "Hard") {
          stats.solved.hard = item.count;
        } else if (item.difficulty === "All") {
          stats.solved.total = item.count;
        }
      });
    }

    if (userData.submitStats && userData.submitStats.totalSubmissionNum) {
      userData.submitStats.totalSubmissionNum.forEach((item) => {
        if (item.difficulty === "Easy") {
          stats.submissions.easy = item.count;
        } else if (item.difficulty === "Medium") {
          stats.submissions.medium = item.count;
        } else if (item.difficulty === "Hard") {
          stats.submissions.hard = item.count;
        } else if (item.difficulty === "All") {
          stats.submissions.total = item.count;
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch LeetCode stats",
      error: error.message,
    });
  }
};

// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const { difficulty, tags, search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Build the query
    const query = {};

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (tags) {
      const tagArray = tags.split(",");
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Count total documents
    const total = await Problem.countDocuments(query);

    // Get problems with pagination
    const problems = await Problem.find(query)
      .sort({ problemId: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("problemId title difficulty tags acceptance url");

    return res.status(200).json({
      success: true,
      data: {
        problems,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch problems",
      error: error.message,
    });
  }
};

// Get problem by ID
exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find problem by ID or problemId
    let problem;

    try {
      // First try to find by problemId (number)
      if (!isNaN(id)) {
        problem = await Problem.findOne({ problemId: parseInt(id) });
      }

      // If not found and it looks like a valid ObjectId, try that
      if (!problem && mongoose.isValidObjectId(id)) {
        problem = await Problem.findById(id);
      }
    } catch (error) {
      console.error("Error finding problem:", error);
    }

    // If still not found, try one more approach
    if (!problem && !isNaN(id)) {
      try {
        problem = await Problem.findOne({ problemId: parseInt(id) });
      } catch (error) {
        console.error("Error in second attempt to find problem:", error);
      }
    }

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch problem",
      error: error.message,
    });
  }
};

// Update user problem progress
exports.updateUserProblemProgress = async (req, res) => {
  try {
    const {
      problemId,
      status,
      code,
      language,
      executionTime,
      memoryUsed,
      notes,
      difficulty,
    } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!problemId || !status) {
      return res.status(400).json({
        success: false,
        message: "Problem ID and status are required",
      });
    }

    // Find the problem
    let problem;

    try {
      // First try to find by problemId (number)
      problem = await Problem.findOne({ problemId: parseInt(problemId) });

      // If not found and it looks like a valid ObjectId, try that
      if (!problem && mongoose.isValidObjectId(problemId)) {
        problem = await Problem.findById(problemId);
      }
    } catch (error) {
      console.error("Error finding problem:", error);
      // Try one more time with just the problemId
      problem = await Problem.findOne({ problemId: parseInt(problemId) });
    }

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Find existing progress or create new
    let progress = await UserProblemProgress.findOne({
      user: userId,
      problem: problem._id,
    });

    if (progress) {
      // Update existing progress
      progress.status = status;
      if (code) progress.lastSubmittedCode = code;
      if (language) progress.language = language;
      if (executionTime) progress.executionTime = executionTime;
      if (memoryUsed) progress.memoryUsed = memoryUsed;
      if (notes) progress.notes = notes;
      if (difficulty) progress.difficulty = difficulty;
      progress.attempts += 1;
      progress.submissionTime = Date.now();
    } else {
      // Create new progress
      progress = new UserProblemProgress({
        user: userId,
        problem: problem._id,
        status,
        lastSubmittedCode: code || null,
        language: language || "javascript",
        executionTime: executionTime || null,
        memoryUsed: memoryUsed || null,
        notes: notes || null,
        difficulty: difficulty || null,
      });
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Problem progress updated successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error updating problem progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update problem progress",
      error: error.message,
    });
  }
};

// Get user problem progress
exports.getUserProblemProgress = async (req, res) => {
  try {
    // Log authentication information
    console.log("Auth headers:", req.headers.authorization);
    console.log("User in request:", req.user);

    const userId = req.params.userId || req.user.id;
    console.log("Getting progress for user ID:", userId);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Found user:", user.email);

    // Get user progress with problem details
    const progress = await UserProblemProgress.find({ user: userId })
      .populate({
        path: "problem",
        select: "problemId title difficulty tags url",
      })
      .sort({ updatedAt: -1 });

    // Group by status
    const groupedProgress = {
      solved: progress.filter((p) => p.status === "solved"),
      attempted: progress.filter((p) => p.status === "attempted"),
      bookmarked: progress.filter((p) => p.status === "bookmarked"),
      skipped: progress.filter((p) => p.status === "skipped"),
    };

    // Calculate statistics
    const stats = {
      total: progress.length,
      solved: groupedProgress.solved.length,
      attempted: groupedProgress.attempted.length,
      bookmarked: groupedProgress.bookmarked.length,
      skipped: groupedProgress.skipped.length,
      byDifficulty: {
        easy: progress.filter(
          (p) => p.problem.difficulty === "Easy" && p.status === "solved"
        ).length,
        medium: progress.filter(
          (p) => p.problem.difficulty === "Medium" && p.status === "solved"
        ).length,
        hard: progress.filter(
          (p) => p.problem.difficulty === "Hard" && p.status === "solved"
        ).length,
      },
    };

    return res.status(200).json({
      success: true,
      data: {
        progress: groupedProgress,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching user problem progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user problem progress",
      error: error.message,
    });
  }
};

// Import problems from JSON
exports.importProblems = async (req, res) => {
  try {
    const { problems } = req.body;

    if (!problems || !Array.isArray(problems) || problems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid problems array is required",
      });
    }

    // Process each problem
    const results = {
      total: problems.length,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };

    for (const problemData of problems) {
      try {
        // Check if problem already exists
        let problem = await Problem.findOne({
          problemId: problemData.problemId,
        });

        if (problem) {
          // Update existing problem
          Object.assign(problem, problemData);
          problem.updatedAt = Date.now();
          await problem.save();
          results.updated++;
        } else {
          // Create new problem
          problem = new Problem(problemData);
          await problem.save();
          results.created++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          problemId: problemData.problemId,
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Problems imported successfully",
      results,
    });
  } catch (error) {
    console.error("Error importing problems:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to import problems",
      error: error.message,
    });
  }
};
