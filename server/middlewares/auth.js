const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
  try {
    //extract token
    let token;

    // Check cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log("Token found in cookies:", token);
    }
    // Check body
    else if (req.body && req.body.token) {
      token = req.body.token;
      console.log("Token found in body:", token);
    }
    // Check Authorisation header (British spelling)
    else if (req.headers && req.headers.authorisation) {
      token = req.headers.authorisation.replace("Bearer ", "");
      console.log("Token found in Authorisation header:", token);
    }
    // Check Authorization header (American spelling)
    else if (req.headers && req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
      console.log("Token found in Authorization header:", token);
    }
    // Check custom header
    else if (req.header("Authorisation")) {
      token = req.header("Authorisation").replace("Bearer ", "");
      console.log("Token found in Authorisation header function:", token);
    } else if (req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
      console.log("Token found in Authorization header function:", token);
    }

    //if token missing, then return response
    if (!token) {
      console.log("No token found in request");
      console.log("Headers:", JSON.stringify(req.headers));
      console.log("Body:", req.body);
      console.log("URL:", req.originalUrl);

      // Special handling for different endpoints
      if (req.originalUrl.includes("/code/execute")) {
        return res.status(401).json({
          success: false,
          message: "Authentication required. Please log in to execute code.",
        });
      } else if (req.originalUrl.includes("/leetcode")) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required. Please log in to access LeetCode features.",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Token is missing",
        });
      }
    }

    //verify the token
    try {
      console.log(
        "Attempting to verify token:",
        token.substring(0, 15) + "..."
      );
      console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

      // Check if token is in the correct format
      if (token.split(".").length !== 3) {
        console.error(
          "Token is not in valid JWT format (should have 3 parts separated by dots)"
        );
        return res.status(401).json({
          success: false,
          message: "Token format is invalid",
        });
      }

      // Clean the JWT_SECRET (remove any whitespace)
      const cleanJwtSecret = process.env.JWT_SECRET.trim();
      console.log("JWT_SECRET length:", cleanJwtSecret.length);

      const decode = jwt.verify(token, cleanJwtSecret);
      console.log("Token verified successfully. User ID:", decode.id);
      req.user = decode;
    } catch (err) {
      //verification - issue
      console.error("Token verification failed:", err.message);
      return res.status(401).json({
        success: false,
        message: "Token is invalid: " + err.message,
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

//isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Instructor only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};
