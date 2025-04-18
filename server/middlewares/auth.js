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
      console.log("Headers:", req.headers);
      console.log("Body:", req.body);
      // Special handling for code execution endpoint
      if (req.originalUrl.includes("/code/execute")) {
        return res.status(401).json({
          success: false,
          message: "Authentication required. Please log in to execute code.",
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
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decode= ", decode);
      req.user = decode;
    } catch (err) {
      //verification - issue
      return res.status(401).json({
        success: false,
        message: "token is invalid",
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
