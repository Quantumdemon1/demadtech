
import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { 
  initializeDemoAccounts, 
  getStoredUser,
  removeStoredUser 
} from '@/utils/authUtils';
import {
  loginUser,
  signupUser,
  signupPoliticalClient,
  logoutUser
} from './authOperations';

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize demo accounts if they don't exist
    initializeDemoAccounts();
    
    // Check if user is already logged in
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (emailOrUsername: string, password: string, role?: 'donor' | 'politicalClient' | 'admin') => {
    setLoading(true);
    try {
      const authenticatedUser = await loginUser(emailOrUsername, password, role);
      setUser(authenticatedUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup handler
  const signup = async (userData: Partial<User>, password: string) => {
    setLoading(true);
    try {
      const newUser = await signupUser(userData, password);
      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Political client signup handler
  const politicalClientSignup = async (userData: Partial<User>, password: string) => {
    setLoading(true);
    try {
      const newClient = await signupPoliticalClient(userData, password);
      setUser(newClient);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    removeStoredUser();
    setUser(null);
    logoutUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, politicalClientSignup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
