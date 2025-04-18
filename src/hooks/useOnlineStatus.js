import { useState, useEffect } from 'react';

/**
 * Custom hook to track online/offline status with debounce
 * @returns {boolean} Current online status
 */
export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [debouncedIsOnline, setDebouncedIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Update online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Debounce the online status to prevent flickering
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedIsOnline(isOnline);
    }, 1500); // 1.5 second debounce
    
    return () => clearTimeout(timeoutId);
  }, [isOnline]);
  
  return debouncedIsOnline;
}
