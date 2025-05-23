
import React, { createContext, useEffect } from 'react';
import { AuthContextType, User } from '@/types';
import { toast } from 'sonner';
import { loginUser, signupDonor, signupPoliticalClient, logoutUser } from '@/services/auth/authActions';
import { useAuthState } from '@/hooks/useAuthState';
import { initializeTestAccountSystem } from '@/utils/authUtils';

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, loading, setLoading, updateUserProfile } = useAuthState();

  useEffect(() => {
    // Initialize test account system
    initializeTestAccountSystem();
  }, []);

  // Login handler
  const login = async (emailOrUsername: string, password: string, role?: 'donor' | 'politicalClient' | 'admin'): Promise<User> => {
    setLoading(true);
    try {
      const loggedInUser = await loginUser(emailOrUsername, password, role);
      
      // Store user in localStorage and state
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      
      return loggedInUser;
    } catch (error) {
      // Error handling is done in loginUser
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup handler for donors
  const signup = async (userData: Partial<User>, password: string): Promise<User> => {
    setLoading(true);
    try {
      const newUser = await signupDonor(userData, password);
      
      // Store user
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return newUser;
    } catch (error) {
      // Error handling is done in signupDonor
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Political client signup handler
  const politicalClientSignup = async (userData: Partial<User>, password: string): Promise<User> => {
    setLoading(true);
    try {
      const newUser = await signupPoliticalClient(userData, password);
      
      // Store in current user
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser as User);
      
      return newUser as User;
    } catch (error) {
      // Error handling is done in signupPoliticalClient
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    logoutUser();
    
    // Clear localStorage and state
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      politicalClientSignup, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
