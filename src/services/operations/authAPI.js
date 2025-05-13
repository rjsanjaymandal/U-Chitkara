import { toast } from "react-hot-toast";

import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setProgress } from "../../slices/loadingBarSlice";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    // const toastId = toast.loading("Loading...")
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });
      dispatch(setProgress(100));
      console.log("SENDOTP API RESPONSE............", response);

      console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error(error?.response?.data?.message);
      dispatch(setProgress(100));
    }
    dispatch(setLoading(false));
    // toast.dismiss(toastId)
  };
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      console.log("SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(setProgress(100));
      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      dispatch(setProgress(100));
      console.log("SIGNUP API ERROR............", error);
      toast.error("Signup Failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));
    dispatch(setProgress(30)); // Start progress

    try {
      console.log("Attempting login with email:", email);

      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      dispatch(setProgress(50)); // Update progress

      // Make the API call
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      dispatch(setProgress(70)); // Update progress

      // Log response status (not sensitive data)
      console.log("LOGIN API RESPONSE STATUS:", response?.status);
      console.log("LOGIN API RESPONSE SUCCESS:", response?.data?.success);

      // Check if response exists and has data
      if (!response || !response.data) {
        throw new Error("No response data received from server");
      }

      // Check if login was successful
      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      // Check if token exists
      if (!response.data.token) {
        throw new Error("Authentication token not received");
      }

      // Check if user data exists
      if (!response.data.user) {
        throw new Error("User data not received");
      }

      dispatch(setProgress(90)); // Update progress

      // Login successful, update state
      dispatch(setToken(response.data.token));

      // Process user image
      let userImage;
      try {
        userImage = response.data.user.image
          ? response.data.user.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      } catch (imageError) {
        console.warn("Error setting user image:", imageError);
        userImage = "https://api.dicebear.com/5.x/initials/svg?seed=User";
      }

      // Update user state with image
      const userData = { ...response.data.user, image: userImage };

      // Save to Redux state
      dispatch(setUser(userData));

      // Save to localStorage
      try {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (storageError) {
        console.warn("Error saving to localStorage:", storageError);
        // Continue even if localStorage fails
      }

      dispatch(setProgress(100)); // Complete progress
      toast.success("Login Successful");

      // Navigate to dashboard
      navigate("/dashboard/my-profile");
    } catch (error) {
      dispatch(setProgress(100)); // Complete progress on error too
      console.error("LOGIN API ERROR:", error);

      // Handle different types of errors
      let errorMessage = "Login failed. Please try again.";

      if (error.name === "AbortError") {
        errorMessage =
          "Login request timed out. Please check your internet connection and try again.";
      } else if (error.message === "Network Error") {
        errorMessage =
          "Network error. Please check if the server is running and try again.";
      } else if (error.response && error.response.data) {
        // The request was made and the server responded with a status code outside 2xx range
        errorMessage =
          error.response.data.message || "Server error. Please try again.";
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage =
          "No response from server. Please check your connection and try again.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage =
          error.message || "An unexpected error occurred. Please try again.";
      }

      toast.error(errorMessage);
    } finally {
      // Always clean up
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      console.log("RESETPASSTOKEN RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESETPASSTOKEN ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Failed To Send Reset Email";
      toast.error(errorMessage);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function resetPassword(
  password,
  confirmPassword,
  token,
  setresetComplete
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      console.log("RESETPASSWORD RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Reset Successfully");
      setresetComplete(true);
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error);
      const errorMessage =
        error.response?.data?.message || "Failed To Reset Password";
      toast.error(errorMessage);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

export function forgotPassword(email, setEmailSent) {
  return async (dispatch) => {
    // const toastId = toast.loading("Loading...")
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      console.log("FORGOTPASSWORD RESPONSE............", response);

      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("FORGOTPASSWORD ERROR............", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      toast.error(errorMessage);
    }
    // toast.dismiss(toastId)
    dispatch(setLoading(false));
  };
}
