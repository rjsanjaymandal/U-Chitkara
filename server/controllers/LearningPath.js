const LearningPath = require("../models/LearningPath");
const Course = require("../models/Course");
const User = require("../models/User");
const UserPreference = require("../models/UserPreference");
const { generateCourseRecommendations, generateLearningPathRecommendations, updateUserPreferences } = require("../utils/recommendationEngine");

// Create a new learning path (Admin only)
exports.createLearningPath = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      level,
      courses,
      tags,
      estimatedCompletionTime,
      status
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !level || !courses || !estimatedCompletionTime) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Validate courses format and existence
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Courses must be a non-empty array",
      });
    }

    // Format courses with order
    const formattedCourses = courses.map((courseId, index) => ({
      course: courseId,
      order: index + 1,
    }));

    // Create learning path
    const newLearningPath = await LearningPath.create({
      name,
      description,
      category,
      level,
      courses: formattedCourses,
      tags: tags || [],
      estimatedCompletionTime,
      status: status || "Draft",
    });

    return res.status(201).json({
      success: true,
      message: "Learning path created successfully",
      data: newLearningPath,
    });
  } catch (error) {
    console.error("Error creating learning path:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create learning path",
      error: error.message,
    });
  }
};

// Get all published learning paths
exports.getAllLearningPaths = async (req, res) => {
  try {
    const learningPaths = await LearningPath.find({ status: "Published" })
      .populate("category")
      .populate({
        path: "courses.course",
        select: "courseName thumbnail instructor",
        populate: {
          path: "instructor",
          select: "firstName lastName",
        },
      });

    return res.status(200).json({
      success: true,
      data: learningPaths,
    });
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch learning paths",
      error: error.message,
    });
  }
};

// Get learning path details by ID
exports.getLearningPathDetails = async (req, res) => {
  try {
    const { pathId } = req.params;

    const learningPath = await LearningPath.findById(pathId)
      .populate("category")
      .populate({
        path: "courses.course",
        populate: [
          {
            path: "instructor",
            select: "firstName lastName email image",
          },
          {
            path: "ratingAndReviews",
          },
          {
            path: "category",
          },
        ],
      });

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: "Learning path not found",
      });
    }

    // If user is authenticated, track this view for recommendation purposes
    if (req.user) {
      await updateUserPreferences(req.user.id, learningPath.courses[0].course._id, "view");
    }

    return res.status(200).json({
      success: true,
      data: learningPath,
    });
  } catch (error) {
    console.error("Error fetching learning path details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch learning path details",
      error: error.message,
    });
  }
};

// Get personalized learning path recommendations for a user
exports.getRecommendedLearningPaths = async (req, res) => {
  try {
    const userId = req.user.id;

    // Generate learning path recommendations
    const recommendedPaths = await generateLearningPathRecommendations(userId);

    return res.status(200).json({
      success: true,
      message: "Recommendations generated successfully",
      data: recommendedPaths,
    });
  } catch (error) {
    console.error("Error generating learning path recommendations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
      error: error.message,
    });
  }
};

// Get personalized course recommendations for a user
exports.getRecommendedCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Generate course recommendations
    const recommendedCourses = await generateCourseRecommendations(userId);

    return res.status(200).json({
      success: true,
      message: "Recommendations generated successfully",
      data: recommendedCourses,
    });
  } catch (error) {
    console.error("Error generating course recommendations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
      error: error.message,
    });
  }
};

// Enroll user in a learning path
exports.enrollInLearningPath = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pathId } = req.params;

    // Check if learning path exists
    const learningPath = await LearningPath.findById(pathId);
    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: "Learning path not found",
      });
    }

    // Get user preferences or create if not exists
    let userPreference = await UserPreference.findOne({ user: userId });
    if (!userPreference) {
      const user = await User.findById(userId);
      userPreference = await createDefaultPreferences(userId, user.courses);
    }

    // Check if user is already enrolled in this learning path
    const isAlreadyEnrolled = userPreference.learningPaths.some(
      path => path.path.toString() === pathId && path.isActive
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "User is already enrolled in this learning path",
      });
    }

    // Add learning path to user preferences
    userPreference.learningPaths.push({
      path: pathId,
      progress: 0,
      isActive: true,
      startedAt: new Date(),
      lastActivity: new Date(),
    });

    // Update user preferences
    await userPreference.save();

    // Update interest weights for the learning path's category
    await updateUserPreferences(userId, learningPath.courses[0].course, "enroll");

    return res.status(200).json({
      success: true,
      message: "Successfully enrolled in learning path",
    });
  } catch (error) {
    console.error("Error enrolling in learning path:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to enroll in learning path",
      error: error.message,
    });
  }
};

// Update learning path progress
exports.updateLearningPathProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pathId } = req.params;
    const { progress } = req.body;

    // Validate progress
    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: "Progress must be between 0 and 100",
      });
    }

    // Get user preferences
    const userPreference = await UserPreference.findOne({ user: userId });
    if (!userPreference) {
      return res.status(404).json({
        success: false,
        message: "User preferences not found",
      });
    }

    // Find the learning path in user preferences
    const pathIndex = userPreference.learningPaths.findIndex(
      path => path.path.toString() === pathId
    );

    if (pathIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Learning path not found in user's enrolled paths",
      });
    }

    // Update progress and last activity
    userPreference.learningPaths[pathIndex].progress = progress;
    userPreference.learningPaths[pathIndex].lastActivity = new Date();

    // If progress is 100%, mark as completed
    if (progress === 100) {
      // Keep it active so user can revisit, but we know it's completed
      // Could also add a 'completed' flag if needed
      
      // Update user preferences for completion
      const learningPath = await LearningPath.findById(pathId);
      if (learningPath && learningPath.courses.length > 0) {
        await updateUserPreferences(userId, learningPath.courses[0].course, "complete");
      }
    }

    // Save changes
    await userPreference.save();

    return res.status(200).json({
      success: true,
      message: "Learning path progress updated successfully",
    });
  } catch (error) {
    console.error("Error updating learning path progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update learning path progress",
      error: error.message,
    });
  }
};

// Get user's enrolled learning paths
exports.getUserLearningPaths = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user preferences
    const userPreference = await UserPreference.findOne({ user: userId });
    
    if (!userPreference || !userPreference.learningPaths.length) {
      return res.status(200).json({
        success: true,
        message: "User has no enrolled learning paths",
        data: [],
      });
    }

    // Get active learning path IDs
    const activeLearningPathIds = userPreference.learningPaths
      .filter(path => path.isActive)
      .map(path => path.path);

    // Get learning path details
    const learningPaths = await LearningPath.find({
      _id: { $in: activeLearningPathIds },
    })
      .populate("category")
      .populate({
        path: "courses.course",
        select: "courseName thumbnail instructor",
        populate: {
          path: "instructor",
          select: "firstName lastName",
        },
      });

    // Combine learning path details with user progress
    const learningPathsWithProgress = learningPaths.map(path => {
      const userPathData = userPreference.learningPaths.find(
        userPath => userPath.path.toString() === path._id.toString()
      );

      return {
        ...path.toObject(),
        userProgress: userPathData.progress,
        startedAt: userPathData.startedAt,
        lastActivity: userPathData.lastActivity,
      };
    });

    return res.status(200).json({
      success: true,
      data: learningPathsWithProgress,
    });
  } catch (error) {
    console.error("Error fetching user learning paths:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user learning paths",
      error: error.message,
    });
  }
};
