import axios from "axios";

// Create axios instance with default configuration
export const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Always send cookies with requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config?.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        `[API Error] ${error.response.status} ${error.config?.url}:`,
        error.response.data
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("[API No Response]:", error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("[API Setup Error]:", error.message);
    }
    return Promise.reject(error);
  }
);

// Simple in-memory cache for GET requests
const cache = new Map();

/**
 * Makes API requests with proper error handling and caching for GET requests
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} url - API endpoint URL
 * @param {object} bodyData - Request body data (for POST, PUT, etc.)
 * @param {object} headers - Custom headers
 * @param {object} params - URL parameters
 * @param {object} options - Additional options (timeout, signal, etc.)
 * @returns {Promise} - Promise that resolves to the API response
 */
export const apiConnector = (
  method,
  url,
  bodyData,
  headers,
  params,
  options = {}
) => {
  try {
    // Validate inputs
    if (!method || !url) {
      console.error("[API Error] Method and URL are required");
      return Promise.reject(new Error("Method and URL are required"));
    }

    // Create a cache key from the URL and params for GET requests
    const cacheKey =
      method === "GET" ? `${url}-${JSON.stringify(params || {})}` : null;

    // Check cache for GET requests
    if (method === "GET" && cacheKey && cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      // Only use cache if it's less than 5 minutes old
      if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
        console.log("[API Cache] Using cached data for:", url);
        return Promise.resolve(cachedData.response);
      }
    }

    // Process authentication headers
    let authHeaders = { ...headers };

    // If we have an Authorization header with a token, ensure it's properly formatted
    if (authHeaders && authHeaders.Authorization) {
      // Check if the token already has the Bearer prefix
      if (!authHeaders.Authorization.startsWith("Bearer ")) {
        authHeaders.Authorization = `Bearer ${authHeaders.Authorization}`;
      }
    }

    // Add security headers for non-GET requests
    const secureHeaders =
      method !== "GET"
        ? {
            "X-Requested-With": "XMLHttpRequest", // Helps prevent CSRF attacks
            ...authHeaders,
          }
        : authHeaders;

    // Log the request details (excluding sensitive data)
    if (bodyData) {
      const logData = { ...bodyData };
      if (logData.password) logData.password = "[REDACTED]";
      console.log(`[API Request Data] ${method} ${url}:`, logData);
    }

    // Make the actual API call
    return axiosInstance({
      method: method,
      url: url,
      data: bodyData || null,
      headers: secureHeaders || null,
      params: params || null,
      withCredentials: true, // Send cookies with cross-origin requests
      timeout: options.timeout || 30000, // Default 30 second timeout
      signal: options.signal, // AbortController signal for request cancellation
    })
      .then((response) => {
        // Cache GET responses
        if (method === "GET" && cacheKey) {
          cache.set(cacheKey, {
            response,
            timestamp: Date.now(),
          });
        }
        return response;
      })
      .catch((error) => {
        // Create a safe response object that won't cause "Cannot read properties of undefined" errors
        console.error(
          `[API Error Handler] Error in ${method} ${url}:`,
          error.message
        );

        // Rethrow the error to be handled by the caller
        throw error;
      });
  } catch (error) {
    console.error("[API Connector Error]", error);
    return Promise.reject(error);
  }
};
