const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");
const LearningPath = require("../models/LearningPath");
const UserPreference = require("../models/UserPreference");

/**
 * Generate course recommendations based on user preferences and history
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - Array of recommended courses
 */
exports.generateCourseRecommendations = async (userId) => {
  try {
    // Get user details with courses and preferences
    const user = await User.findById(userId).populate("courses");
    
    // Get user preferences or create default if not exists
    let userPreference = await UserPreference.findOne({ user: userId });
    
    if (!userPreference) {
      // Create default preferences based on user's enrolled courses
      userPreference = await createDefaultPreferences(userId, user.courses);
    }
    
    // Get completed course IDs
    const completedCourseIds = user.courses.map(course => course.toString());
    
    // Get user's interest categories
    const interestCategoryIds = userPreference.interests.map(interest => interest.category.toString());
    
    // Find courses that match user's interests and level, excluding already completed courses
    const recommendedCourses = await Course.find({
      _id: { $nin: completedCourseIds },
      category: { $in: interestCategoryIds },
      status: "Published",
    })
    .populate("instructor")
    .populate("category")
    .limit(10);
    
    // Sort courses by relevance score
    const scoredCourses = recommendedCourses.map(course => {
      // Find the matching interest and get its weight
      const matchingInterest = userPreference.interests.find(
        interest => interest.category.toString() === course.category._id.toString()
      );
      
      const interestWeight = matchingInterest ? matchingInterest.weight : 0;
      
      // Calculate a relevance score based on various factors
      const relevanceScore = calculateRelevanceScore(course, userPreference, interestWeight);
      
      return {
        course,
        relevanceScore
      };
    });
    
    // Sort by relevance score (descending)
    scoredCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Return just the course objects
    return scoredCourses.map(item => item.course);
    
  } catch (error) {
    console.error("Error generating course recommendations:", error);
    throw error;
  }
};

/**
 * Generate learning path recommendations based on user preferences and history
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - Array of recommended learning paths
 */
exports.generateLearningPathRecommendations = async (userId) => {
  try {
    // Get user details
    const user = await User.findById(userId);
    
    // Get user preferences
    let userPreference = await UserPreference.findOne({ user: userId });
    
    if (!userPreference) {
      // Create default preferences
      userPreference = await createDefaultPreferences(userId, user.courses);
    }
    
    // Get user's active learning paths
    const activeLearningPathIds = userPreference.learningPaths
      .filter(path => path.isActive)
      .map(path => path.path.toString());
    
    // Get user's interest categories
    const interestCategoryIds = userPreference.interests.map(interest => interest.category.toString());
    
    // Find learning paths that match user's interests and level, excluding already active paths
    const recommendedPaths = await LearningPath.find({
      _id: { $nin: activeLearningPathIds },
      category: { $in: interestCategoryIds },
      level: userPreference.preferredLevel,
      status: "Published",
    })
    .populate({
      path: "courses.course",
      populate: {
        path: "instructor",
      },
    })
    .populate("category")
    .limit(5);
    
    // Sort paths by relevance score
    const scoredPaths = recommendedPaths.map(path => {
      // Find the matching interest and get its weight
      const matchingInterest = userPreference.interests.find(
        interest => interest.category.toString() === path.category._id.toString()
      );
      
      const interestWeight = matchingInterest ? matchingInterest.weight : 0;
      
      // Calculate a relevance score
      const relevanceScore = calculatePathRelevanceScore(path, userPreference, interestWeight);
      
      return {
        path,
        relevanceScore
      };
    });
    
    // Sort by relevance score (descending)
    scoredPaths.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Return just the path objects
    return scoredPaths.map(item => item.path);
    
  } catch (error) {
    console.error("Error generating learning path recommendations:", error);
    throw error;
  }
};

/**
 * Create default user preferences based on enrolled courses
 * @param {string} userId - The ID of the user
 * @param {Array} enrolledCourses - Array of course IDs the user is enrolled in
 * @returns {Promise<Object>} - The created user preference object
 */
async function createDefaultPreferences(userId, enrolledCourses) {
  try {
    // If user has enrolled courses, use their categories as interests
    let interests = [];
    
    if (enrolledCourses && enrolledCourses.length > 0) {
      // Get the courses with their categories
      const courses = await Course.find({
        _id: { $in: enrolledCourses }
      }).populate("category");
      
      // Count occurrences of each category
      const categoryCounts = {};
      courses.forEach(course => {
        const categoryId = course.category._id.toString();
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
      });
      
      // Convert to interests array with weights based on frequency
      interests = Object.entries(categoryCounts).map(([categoryId, count]) => ({
        category: categoryId,
        weight: count / courses.length // Normalize weight between 0 and 1
      }));
    } else {
      // If no enrolled courses, add a default category (Web Development)
      const defaultCategory = await Category.findOne({ name: "Web Development" });
      if (defaultCategory) {
        interests.push({
          category: defaultCategory._id,
          weight: 1
        });
      }
    }
    
    // Create and save user preferences
    const userPreference = new UserPreference({
      user: userId,
      interests: interests,
      preferredLevel: "Beginner", // Default to beginner
      careerGoals: ["Web Developer"], // Default career goal
      learningPaths: [],
      learningStyle: "Mixed",
      availableTimePerWeek: 10 // Default 10 hours per week
    });
    
    await userPreference.save();
    return userPreference;
    
  } catch (error) {
    console.error("Error creating default preferences:", error);
    throw error;
  }
}

/**
 * Calculate relevance score for a course based on user preferences
 * @param {Object} course - The course object
 * @param {Object} userPreference - The user preference object
 * @param {number} interestWeight - The weight of the user's interest in the course category
 * @returns {number} - The calculated relevance score
 */
function calculateRelevanceScore(course, userPreference, interestWeight) {
  // Base score from interest weight (0-1)
  let score = interestWeight;
  
  // Adjust score based on course popularity (assuming course has a rating or enrollment count)
  const popularityFactor = course.studentsEnrolled ? course.studentsEnrolled.length / 100 : 0;
  score += popularityFactor * 0.3; // 30% weight to popularity
  
  // Adjust score based on instructor rating if available
  const instructorFactor = course.instructor && course.instructor.rating ? course.instructor.rating / 5 : 0.5;
  score += instructorFactor * 0.2; // 20% weight to instructor quality
  
  // Adjust score based on course freshness (newer courses get a boost)
  const courseAge = (new Date() - new Date(course.createdAt)) / (1000 * 60 * 60 * 24 * 30); // Age in months
  const freshnessFactor = Math.max(0, 1 - (courseAge / 12)); // Courses older than 12 months get no boost
  score += freshnessFactor * 0.1; // 10% weight to freshness
  
  return score;
}

/**
 * Calculate relevance score for a learning path based on user preferences
 * @param {Object} path - The learning path object
 * @param {Object} userPreference - The user preference object
 * @param {number} interestWeight - The weight of the user's interest in the path category
 * @returns {number} - The calculated relevance score
 */
function calculatePathRelevanceScore(path, userPreference, interestWeight) {
  // Base score from interest weight (0-1)
  let score = interestWeight;
  
  // Adjust score based on path popularity
  score += (path.popularity / 100) * 0.3; // 30% weight to popularity
  
  // Adjust score based on time commitment vs user's available time
  const timeCommitmentFactor = Math.min(1, userPreference.availableTimePerWeek / path.estimatedCompletionTime);
  score += timeCommitmentFactor * 0.2; // 20% weight to time commitment
  
  // Adjust score based on path freshness
  const pathAge = (new Date() - new Date(path.createdAt)) / (1000 * 60 * 60 * 24 * 30); // Age in months
  const freshnessFactor = Math.max(0, 1 - (pathAge / 12)); // Paths older than 12 months get no boost
  score += freshnessFactor * 0.1; // 10% weight to freshness
  
  return score;
}

/**
 * Update user preferences based on user activity
 * @param {string} userId - The ID of the user
 * @param {string} courseId - The ID of the course the user interacted with
 * @param {string} actionType - The type of action (view, enroll, complete, etc.)
 * @returns {Promise<void>}
 */
exports.updateUserPreferences = async (userId, courseId, actionType) => {
  try {
    // Get user preferences
    let userPreference = await UserPreference.findOne({ user: userId });
    
    if (!userPreference) {
      // Create default preferences if not exists
      userPreference = await createDefaultPreferences(userId, []);
    }
    
    // Get course details
    const course = await Course.findById(courseId).populate("category");
    
    if (!course) {
      throw new Error("Course not found");
    }
    
    // Find if the category already exists in user interests
    const categoryId = course.category._id.toString();
    const existingInterestIndex = userPreference.interests.findIndex(
      interest => interest.category.toString() === categoryId
    );
    
    // Update interest weight based on action type
    const weightIncrement = getWeightIncrementForAction(actionType);
    
    if (existingInterestIndex >= 0) {
      // Update existing interest
      userPreference.interests[existingInterestIndex].weight += weightIncrement;
      // Cap weight at 5
      userPreference.interests[existingInterestIndex].weight = Math.min(
        5, 
        userPreference.interests[existingInterestIndex].weight
      );
    } else {
      // Add new interest
      userPreference.interests.push({
        category: categoryId,
        weight: 1 + weightIncrement
      });
    }
    
    // Update last activity timestamp
    userPreference.updatedAt = new Date();
    
    // Save changes
    await userPreference.save();
    
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};

/**
 * Get weight increment value based on action type
 * @param {string} actionType - The type of user action
 * @returns {number} - The weight increment value
 */
function getWeightIncrementForAction(actionType) {
  switch (actionType) {
    case "view":
      return 0.1;
    case "enroll":
      return 0.5;
    case "complete":
      return 1.0;
    case "rate":
      return 0.3;
    case "review":
      return 0.4;
    default:
      return 0.1;
  }
}
