import { setToken } from "../slices/authSlice";
import { apiConnector } from "../services/apiConnector";
import { endpoints } from "../services/apis";

// Get the refresh token endpoint from the API endpoints
const { REFRESH_TOKEN_API } = endpoints;

/**
 * Attempts to refresh the authentication token
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Promise<boolean>} - True if token refresh was successful, false otherwise
 */
export const refreshToken = async (dispatch) => {
  try {
    // Get the refresh token from localStorage
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.error("No refresh token available");
      return false;
    }

    // Call the refresh token API
    const response = await apiConnector("POST", REFRESH_TOKEN_API, {
      refreshToken: refreshToken,
    });

    if (response.data.success) {
      // Update the token in Redux and localStorage
      const newToken = response.data.token;
      dispatch(setToken(newToken));
      localStorage.setItem("token", newToken);

      console.log("Token refreshed successfully");
      return true;
    } else {
      console.error("Token refresh failed:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

/**
 * Checks if a token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} - True if token is expired, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    // Extract the payload from the JWT token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);

    // Check if the token is expired
    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // Assume token is expired if there's an error
  }
};

/**
 * Handles token expiration by attempting to refresh the token
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Promise<boolean>} - True if token is valid or was refreshed, false otherwise
 */
export const handleTokenExpiration = async (dispatch) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    console.log("Token is expired or missing, attempting to refresh");
    return await refreshToken(dispatch);
  }

  return true; // Token is valid
};
