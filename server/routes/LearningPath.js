// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Controllers
const {
  createLearningPath,
  getAllLearningPaths,
  getLearningPathDetails,
  getRecommendedLearningPaths,
  getRecommendedCourses,
  enrollInLearningPath,
  updateLearningPathProgress,
  getUserLearningPaths,
} = require("../controllers/LearningPath");

// Import Middlewares
const { auth, isInstructor, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Learning Path routes
// ********************************************************************************************************

// Public routes
router.get("/getAllLearningPaths", getAllLearningPaths);
router.get("/getLearningPathDetails/:pathId", getLearningPathDetails);

// Protected routes (require authentication)
router.get("/getRecommendedLearningPaths", auth, getRecommendedLearningPaths);
router.get("/getRecommendedCourses", auth, getRecommendedCourses);
router.post("/enrollInLearningPath/:pathId", auth, enrollInLearningPath);
router.put("/updateLearningPathProgress/:pathId", auth, updateLearningPathProgress);
router.get("/getUserLearningPaths", auth, getUserLearningPaths);

// Admin routes
router.post("/createLearningPath", auth, isAdmin, createLearningPath);

module.exports = router;
