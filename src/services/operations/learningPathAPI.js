import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { learningPathEndpoints } from "../apis";
import { setProgress } from "../../slices/loadingBarSlice";

const {
  GET_ALL_LEARNING_PATHS_API,
  GET_LEARNING_PATH_DETAILS_API,
  GET_RECOMMENDED_LEARNING_PATHS_API,
  GET_RECOMMENDED_COURSES_API,
  ENROLL_IN_LEARNING_PATH_API,
  UPDATE_LEARNING_PATH_PROGRESS_API,
  GET_USER_LEARNING_PATHS_API,
  CREATE_LEARNING_PATH_API,
} = learningPathEndpoints;

// Get all learning paths
export const getAllLearningPaths = async (dispatch) => {
  dispatch(setProgress(50));
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_LEARNING_PATHS_API);
    console.log("GET ALL LEARNING PATHS API RESPONSE....", response);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    result = response.data.data;
  } catch (error) {
    console.log("GET ALL LEARNING PATHS API ERROR....", error);
    toast.error("Failed to fetch learning paths");
  }
  dispatch(setProgress(100));
  return result;
};

// Get learning path details
export const getLearningPathDetails = async (pathId, dispatch) => {
  dispatch(setProgress(50));
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      `${GET_LEARNING_PATH_DETAILS_API}/${pathId}`
    );
    console.log("GET LEARNING PATH DETAILS API RESPONSE....", response);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    result = response.data.data;
  } catch (error) {
    console.log("GET LEARNING PATH DETAILS API ERROR....", error);
    toast.error("Failed to fetch learning path details");
  }
  dispatch(setProgress(100));
  return result;
};

// Get recommended learning paths
export const getRecommendedLearningPaths = async (token, dispatch) => {
  dispatch(setProgress(50));
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_RECOMMENDED_LEARNING_PATHS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("GET RECOMMENDED LEARNING PATHS API RESPONSE....", response);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    result = response.data.data;
  } catch (error) {
    console.log("GET RECOMMENDED LEARNING PATHS API ERROR....", error);
    toast.error("Failed to fetch recommended learning paths");
  }
  dispatch(setProgress(100));
  return result;
};

// Get recommended courses
export const getRecommendedCourses = async (token, dispatch) => {
  dispatch(setProgress(50));
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_RECOMMENDED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("GET RECOMMENDED COURSES API RESPONSE....", response);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    result = response.data.data;
  } catch (error) {
    console.log("GET RECOMMENDED COURSES API ERROR....", error);
    toast.error("Failed to fetch recommended courses");
  }
  dispatch(setProgress(100));
  return result;
};

// Enroll in a learning path
export const enrollInLearningPath = async (pathId, token, dispatch) => {
  const toastId = toast.loading("Enrolling in learning path...");
  dispatch(setProgress(50));
  let success = false;
  
  try {
    const response = await apiConnector(
      "POST",
      `${ENROLL_IN_LEARNING_PATH_API}/${pathId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("ENROLL IN LEARNING PATH API RESPONSE....", response);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    toast.success("Successfully enrolled in learning path");
    success = true;
  } catch (error) {
    console.log("ENROLL IN LEARNING PATH API ERROR....", error);
    toast.error("Failed to enroll in learning path");
  }
  
  toast.dismiss(toastId);
  dispatch(setProgress(100));
  return success;
};

// Update learning path progress
export const updateLearningPathProgress = async (pathId, progress, token, dispatch) => {
  dispatch(setProgress(50));
  let success = false;
  
  try {
    const response = await apiConnector(
      "PUT",
      `${UPDATE_LEARNING_PATH_PROGRESS_API}/${pathId}`,
      { progress },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("UPDATE LEARNING PATH PROGRESS API RESPONSE....", response);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    success = true;
  } catch (error) {
    console.log("UPDATE LEARNING PATH PROGRESS API ERROR....", error);
    toast.error("Failed to update learning path progress");
  }
  
  dispatch(setProgress(100));
  return success;
};

// Get user's learning paths
export const getUserLearningPaths = async (token, dispatch) => {
  dispatch(setProgress(50));
  let result = [];
  
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_LEARNING_PATHS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("GET USER LEARNING PATHS API RESPONSE....", response);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    result = response.data.data;
  } catch (error) {
    console.log("GET USER LEARNING PATHS API ERROR....", error);
    toast.error("Failed to fetch your learning paths");
  }
  
  dispatch(setProgress(100));
  return result;
};

// Create a learning path (Admin only)
export const createLearningPath = async (formData, token, dispatch) => {
  const toastId = toast.loading("Creating learning path...");
  dispatch(setProgress(50));
  let success = false;
  
  try {
    const response = await apiConnector(
      "POST",
      CREATE_LEARNING_PATH_API,
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("CREATE LEARNING PATH API RESPONSE....", response);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    toast.success("Learning path created successfully");
    success = true;
  } catch (error) {
    console.log("CREATE LEARNING PATH API ERROR....", error);
    toast.error("Failed to create learning path");
  }
  
  toast.dismiss(toastId);
  dispatch(setProgress(100));
  return success;
};
