import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { codePlaygroundEndpoints } from "../apis";
import { setProgress } from "../../slices/loadingBarSlice";

const { EXECUTE_CODE_API } = codePlaygroundEndpoints;

// Execute code
export const executeCode = async (
  code,
  language,
  stdin = "",
  token,
  dispatch
) => {
  dispatch(setProgress(50));
  let result = null;

  // Create a toast notification that we can reference later
  const toastId = toast.loading("Executing code...");

  try {
    console.log("Sending code execution request:", {
      language,
      codeLength: code.length,
      hasStdin: stdin.length > 0,
    });

    const response = await apiConnector(
      "POST",
      EXECUTE_CODE_API,
      { code, language, stdin },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("EXECUTE CODE API RESPONSE....", response);

    if (!response.data.success && response.data.message) {
      // Check for specific error messages
      if (response.data.message.includes("API key")) {
        toast.error("Code execution service is not properly configured");
        toast.dismiss(toastId);
        return {
          success: false,
          message: response.data.message,
          error: "configuration_error",
        };
      }

      throw new Error(response.data.message || "Failed to execute code");
    }

    result = response.data;
    toast.success("Code executed successfully");
    toast.dismiss(toastId);
  } catch (error) {
    console.log("EXECUTE CODE API ERROR....", error);

    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Error response data:", error.response.data);
      console.log("Error response status:", error.response.status);

      if (error.response.status === 401) {
        toast.error("Authentication required. Please log in again.");
      } else if (error.response.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(
          error.response.data?.message ||
            "Server error. Please try again later."
        );
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log("Error request:", error.request);
      toast.error(
        "No response from server. Please check your internet connection."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error(error.message || "Failed to execute code");
    }

    toast.dismiss(toastId);
  }

  dispatch(setProgress(100));
  return result;
};
