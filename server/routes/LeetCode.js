const express = require("express");
const router = express.Router();

// Import controllers
const {
  updateLeetCodeUsername,
  getLeetCodeStats,
  getAllProblems,
  getProblemById,
  updateUserProblemProgress,
  getUserProblemProgress,
  importProblems,
  leetCodeLimiter,
} = require("../controllers/LeetCode");

// Import middlewares
const { auth, isAdmin } = require("../middlewares/auth");

// Import User model
const User = require("../models/User");

// ********************************************************************************************************
//                                      LeetCode routes
// ********************************************************************************************************

// Update LeetCode username
router.put("/username", auth, updateLeetCodeUsername);

// Get LeetCode stats (with rate limiting)
router.get("/stats/:username", leetCodeLimiter, getLeetCodeStats);

// Get all problems
router.get("/problems", getAllProblems);

// Get problem by ID
router.get("/problems/:id", getProblemById);

// Update user problem progress
router.post("/progress", auth, updateUserProblemProgress);

// Get user problem progress
router.get("/progress/:userId?", auth, getUserProblemProgress);

// Import problems (admin only)
router.post("/import-problems", auth, isAdmin, importProblems);

// Special test route for development - allows setting LeetCode username without authentication
// This should be disabled in production
router.post("/test/set-username", async (req, res) => {
  try {
    const { email, leetCodeUsername } = req.body;

    if (!email || !leetCodeUsername) {
      return res.status(400).json({
        success: false,
        message: "Email and LeetCode username are required",
      });
    }

    console.log(
      `TEST ROUTE: Setting LeetCode username for ${email} to ${leetCodeUsername}`
    );

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's LeetCode username
    user.leetCodeUsername = leetCodeUsername;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "LeetCode username updated successfully via test route",
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        leetCodeUsername: user.leetCodeUsername,
      },
    });
  } catch (error) {
    console.error("Error in test route:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update LeetCode username",
      error: error.message,
    });
  }
});

// Test route to validate token
router.post("/test/validate-token", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    console.log("Validating token:", token.substring(0, 15) + "...");

    // Clean the JWT_SECRET (remove any whitespace)
    const cleanJwtSecret = process.env.JWT_SECRET.trim();
    console.log("JWT_SECRET length:", cleanJwtSecret.length);

    try {
      // Verify the token
      const decoded = require("jsonwebtoken").verify(token, cleanJwtSecret);

      // Find the user
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          decoded: decoded,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Token is valid",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          leetCodeUsername: user.leetCodeUsername,
        },
      });
    } catch (error) {
      console.error("Token validation error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Token validation failed",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error in token validation route:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during token validation",
      error: error.message,
    });
  }
});

module.exports = router;
