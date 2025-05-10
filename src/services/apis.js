// Set the base URL based on environment
const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

// Log the API base URL (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("API Base URL:", BASE_URL);
}

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  REFRESH_TOKEN_API: BASE_URL + "/auth/refresh-token",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_ALL_INSTRUCTOR_DASHBOARD_DETAILS_API:
    BASE_URL + "/profile/getInstructorDashboardDetails",
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  ADD_COURSE_TO_CATEGORY_API: BASE_URL + "/course/addCourseToCategory",
  SEARCH_COURSES_API: BASE_URL + "/course/searchCourse",
  CREATE_CATEGORY_API: BASE_URL + "/course/createCategory",
  GET_ENROLLED_STUDENTS_API: BASE_URL + "/course/getEnrolledStudents",
  ADD_STUDENT_TO_COURSE_API: BASE_URL + "/course/addStudentToCourse",
  REMOVE_STUDENT_FROM_COURSE_API: BASE_URL + "/course/removeStudentFromCourse",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
};

// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
};

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
};
// LEETCODE API
export const leetCodeEndpoints = {
  UPDATE_LEETCODE_USERNAME_API: BASE_URL + "/leetcode/username",
  GET_LEETCODE_STATS_API: BASE_URL + "/leetcode/stats",
  GET_ALL_PROBLEMS_API: BASE_URL + "/leetcode/problems",
  GET_PROBLEM_BY_ID_API: BASE_URL + "/leetcode/problems",
  UPDATE_PROBLEM_PROGRESS_API: BASE_URL + "/leetcode/progress",
  GET_USER_PROGRESS_API: BASE_URL + "/leetcode/progress",
};

// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/contact/contactUs",
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};

// LEARNING PATH API
export const learningPathEndpoints = {
  GET_ALL_LEARNING_PATHS_API: BASE_URL + "/learning-path/getAllLearningPaths",
  GET_LEARNING_PATH_DETAILS_API:
    BASE_URL + "/learning-path/getLearningPathDetails",
  GET_RECOMMENDED_LEARNING_PATHS_API:
    BASE_URL + "/learning-path/getRecommendedLearningPaths",
  GET_RECOMMENDED_COURSES_API:
    BASE_URL + "/learning-path/getRecommendedCourses",
  ENROLL_IN_LEARNING_PATH_API: BASE_URL + "/learning-path/enrollInLearningPath",
  UPDATE_LEARNING_PATH_PROGRESS_API:
    BASE_URL + "/learning-path/updateLearningPathProgress",
  GET_USER_LEARNING_PATHS_API: BASE_URL + "/learning-path/getUserLearningPaths",
  CREATE_LEARNING_PATH_API: BASE_URL + "/learning-path/createLearningPath",
};

// CODE PLAYGROUND API
export const codePlaygroundEndpoints = {
  EXECUTE_CODE_API: BASE_URL + "/code/execute",
};
