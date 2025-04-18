import { toast } from "react-hot-toast";
import { courseEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";

const {
  GET_ENROLLED_STUDENTS_API,
  ADD_STUDENT_TO_COURSE_API,
  REMOVE_STUDENT_FROM_COURSE_API,
} = courseEndpoints;

// Get all students enrolled in a course
export const getEnrolledStudents = async (courseId, token) => {
  const toastId = toast.loading("Loading students...");
  try {
    const response = await apiConnector(
      "POST",
      GET_ENROLLED_STUDENTS_API,
      {
        courseId,
      },
      {
        Authorisation: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Students loaded successfully");
    return response.data.data;
  } catch (error) {
    console.log("GET_ENROLLED_STUDENTS_API API ERROR............", error);
    toast.error(error.response?.data?.message || "Could not fetch students");
    return [];
  } finally {
    toast.dismiss(toastId);
  }
};

// Add a student to a course
export const addStudentToCourse = async (courseId, studentEmail, token) => {
  const toastId = toast.loading("Adding student...");
  try {
    console.log("Token being sent:", token);
    console.log("Course ID:", courseId);
    console.log("Student Email:", studentEmail);
    console.log("API URL:", ADD_STUDENT_TO_COURSE_API);

    // Use the correct API endpoint
    console.log("Using API endpoint:", ADD_STUDENT_TO_COURSE_API);

    // Add token to both headers and body for debugging
    const response = await apiConnector(
      "POST",
      ADD_STUDENT_TO_COURSE_API, // Use the correct API endpoint
      {
        courseId,
        studentEmail,
      },
      {
        Authorisation: `Bearer ${token}`,
      }
    );

    console.log("API Response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Student added successfully");
    return true;
  } catch (error) {
    console.error("ADD_STUDENT_TO_COURSE_API API ERROR:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error message:", error.message);
    toast.error(
      error.response?.data?.message || error.message || "Could not add student"
    );
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};

// Remove a student from a course
export const removeStudentFromCourse = async (courseId, studentId, token) => {
  const toastId = toast.loading("Removing student...");
  try {
    const response = await apiConnector(
      "POST",
      REMOVE_STUDENT_FROM_COURSE_API,
      {
        courseId,
        studentId,
      },
      {
        Authorisation: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Student removed successfully");
    return true;
  } catch (error) {
    console.log("REMOVE_STUDENT_FROM_COURSE_API API ERROR............", error);
    toast.error(error.response?.data?.message || "Could not remove student");
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};
