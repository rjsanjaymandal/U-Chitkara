// Utility functions for token handling

/**
 * Get the authentication token from localStorage or Redux store
 * @param {Object} store - Redux store (optional)
 * @returns {string|null} - The authentication token or null if not found
 */
export const getAuthToken = (store = null) => {
  // First try to get token from localStorage
  let token = localStorage.getItem("token");
  
  // If not in localStorage but store is provided, try to get from Redux store
  if (!token && store) {
    const state = store.getState();
    token = state.auth.token;
  }
  
  return token;
};

/**
 * Format the authorization header with the Bearer prefix
 * @param {string} token - The authentication token
 * @returns {string} - The formatted authorization header
 */
export const formatAuthHeader = (token) => {
  if (!token) return null;
  
  // Check if token already has Bearer prefix
  if (token.startsWith("Bearer ")) {
    return token;
  }
  
  return `Bearer ${token}`;
};
