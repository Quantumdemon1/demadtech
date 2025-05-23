
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';
import { simulateAPIDelay } from '@/utils/authUtils';
import { CookieManager } from '@/utils/cookieManager';

/**
 * Hook for managing authentication state
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Update user profile in context and localStorage after account updates
  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return {
    user,
    setUser,
    loading,
    setLoading,
    updateUserProfile
  };
};
