import axios from "axios";

export const axiosInstance = axios.create({});

// Simple in-memory cache for GET requests
const cache = new Map();

export const apiConnector = (method, url, bodyData, headers, params) => {
  // Create a cache key from the URL and params
  const cacheKey =
    method === "GET" ? `${url}-${JSON.stringify(params || {})}` : null;

  // Check cache for GET requests
  if (method === "GET" && cacheKey && cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);
    // Only use cache if it's less than 5 minutes old
    if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
      console.log("Using cached data for:", url);
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
    console.log(
      "Using Authorization header:",
      authHeaders.Authorization.substring(0, 20) + "..."
    );
  }

  // Make the actual API call
  // Add security headers for non-GET requests
  const secureHeaders =
    method !== "GET"
      ? {
          "X-Requested-With": "XMLHttpRequest", // Helps prevent CSRF attacks
          ...authHeaders,
        }
      : authHeaders;

  return axiosInstance({
    method: method,
    url: url,
    data: bodyData ? bodyData : null,
    headers: secureHeaders ? secureHeaders : null,
    params: params ? params : null,
    withCredentials: true, // Send cookies with cross-origin requests
  }).then((response) => {
    // Cache GET responses
    if (method === "GET" && cacheKey) {
      cache.set(cacheKey, {
        response,
        timestamp: Date.now(),
      });
    }
    return response;
  });
};
