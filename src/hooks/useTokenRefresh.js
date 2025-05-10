import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { handleTokenExpiration } from '../utils/tokenRefresh';

/**
 * Custom hook to handle token refresh and expiration
 * @param {boolean} redirectOnExpire - Whether to redirect to login page on token expiration
 * @returns {Object} - Object containing refreshToken function
 */
const useTokenRefresh = (redirectOnExpire = true) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check token validity on component mount
  useEffect(() => {
    const checkTokenValidity = async () => {
      const isTokenValid = await handleTokenExpiration(dispatch);
      
      if (!isTokenValid && redirectOnExpire) {
        toast.error("Your session has expired. Please log in again.");
        navigate('/login');
      }
    };
    
    checkTokenValidity();
  }, [dispatch, navigate, redirectOnExpire]);

  // Function to manually refresh token
  const refreshToken = async () => {
    const isTokenValid = await handleTokenExpiration(dispatch);
    
    if (!isTokenValid && redirectOnExpire) {
      toast.error("Your session has expired. Please log in again.");
      navigate('/login');
      return false;
    }
    
    return isTokenValid;
  };

  return { refreshToken };
};

export default useTokenRefresh;
