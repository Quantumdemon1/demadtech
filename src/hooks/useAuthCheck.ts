
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAuth from './useAuth';

/**
 * Hook for checking authentication status and redirecting if not authenticated
 * @param requiresAuth - Whether the current page requires authentication
 * @param writeOperation - Whether the current action requires write permissions (needs loginPw cookie)
 * @returns Object with user and helper functions for checking authentication
 */
function useAuthCheck(requiresAuth = true, writeOperation = false) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const loginUsername = user?.email || user?.loginUsername || '';

  useEffect(() => {
    if (requiresAuth && !loginUsername) {
      toast.error("Please log in to continue");
      navigate('/login');
    }
  }, [requiresAuth, loginUsername, navigate]);

  /**
   * Check if the user is authenticated and has the necessary cookies for the operation
   * Can be used before API calls to ensure proper authentication
   * @returns True if the user is properly authenticated, false otherwise
   */
  const checkAuthStatus = () => {
    if (!loginUsername) {
      toast.error("Please log in to continue");
      navigate('/login');
      return false;
    }

    if (writeOperation && !document.cookie.includes('loginPw=')) {
      toast.error("Session expired. Please log in again");
      navigate('/login');
      return false;
    }

    return true;
  };

  return {
    user,
    loginUsername,
    isAuthenticated: !!loginUsername,
    hasLoginCookie: document.cookie.includes('loginPw='),
    checkAuthStatus
  };
}

export default useAuthCheck;
