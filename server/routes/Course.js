// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getInstructorCourses,
  editCourse,
  getFullCourseDetails,
  deleteCourse,
  searchCourse,
  markLectureAsComplete,
  getEnrolledStudents,
  addStudentToCourse,
  removeStudentFromCourse,
} = require("../controllers/Course");

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
  addCourseToCategory,
} = require("../controllers/Category");

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReviews");

//demo
const { isDemo } = require("../middlewares/demo");

// Importing Middlewares
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, isDemo, createCourse);
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, isDemo, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);
// Edit a Course
router.post("/editCourse", auth, isInstructor, isDemo, editCourse);
// Get all Courses of a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
//Get full course details
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
// Delete a Course
router.delete("/deleteCourse", auth, isDemo, deleteCourse);
// Search Courses
router.post("/searchCourse", searchCourse);
//mark lecture as complete
router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);

// ********************************************************************************************************
//                                      Student Management for Instructors
// ********************************************************************************************************
// Get all students enrolled in a course
router.post("/getEnrolledStudents", auth, isInstructor, getEnrolledStudents);
// Add a student to a course
router.post("/addStudentToCourse", auth, isInstructor, addStudentToCourse);

// Test route for adding a student to a course (no auth)
router.post("/testAddStudentToCourse", addStudentToCourse);

// Simple test route
router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Test route is working",
  });
});
// Remove a student from a course
router.post(
  "/removeStudentFromCourse",
  auth,
  isInstructor,
  removeStudentFromCourse
);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, isDemo, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;
