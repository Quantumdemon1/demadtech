
import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from 'sonner';
import { getDonorAPI, createDonorAPI, updateDonorAPI, getPoliticalClientAPI, createPoliticalClientAPI } from '@/services/api';
import { mapDonorToUser, mapPoliticalClientToUser, mapUserToDonorRequest, mapUserToPoliticalClientRequest } from '@/services/dataMapping';
import { setCookie, removeCookie } from '@/utils/cookieUtils';

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
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

  // Login handler
  const login = async (emailOrUsername: string, password: string, role?: 'donor' | 'politicalClient' | 'admin'): Promise<User> => {
    setLoading(true);
    try {
      // Set loginPw cookie for authentication
      setCookie('loginPw', password, { path: '/' });
      
      let userData: User;
      
      // Decide which API endpoint to use based on role
      if (role === 'politicalClient') {
        const clientData = await getPoliticalClientAPI(emailOrUsername);
        userData = mapPoliticalClientToUser(clientData);
      } else {
        // Default to donor login if role is not specified or is 'donor'
        const donorData = await getDonorAPI(emailOrUsername);
        userData = mapDonorToUser(donorData);
      }
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Logged in successfully');
      return userData;
    } catch (error) {
      // If login fails, remove the loginPw cookie
      removeCookie('loginPw');
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup handler for donors
  const signup = async (userData: Partial<User>, password: string): Promise<User> => {
    setLoading(true);
    try {
      // Create request body for donor creation
      const donorData = mapUserToDonorRequest({
        ...userData,
        password // Add password to be mapped by the utility
      });
      
      // Call API to create donor
      const response = await createDonorAPI(donorData);
      
      // If successful, login with the new credentials to get full user details
      return await login(userData.email || donorData.loginUsername, password, 'donor');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Political client signup handler
  const politicalClientSignup = async (userData: Partial<User>, password: string): Promise<User> => {
    setLoading(true);
    try {
      // Create request body for political client creation
      const clientData = mapUserToPoliticalClientRequest({
        ...userData,
        password // Add password to be mapped by the utility
      });
      
      // Call API to create political client
      const response = await createPoliticalClientAPI(clientData);
      
      // If successful, login with the new credentials
      return await login(userData.loginUsername || clientData.loginUsername, password, 'politicalClient');
    } catch (error) {
      console.error('Political client signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create political client account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    // Remove loginPw cookie
    removeCookie('loginPw');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Update user profile in context and localStorage after account updates
  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      politicalClientSignup, 
      logout,
      updateUserProfile // Add this to the context value
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
