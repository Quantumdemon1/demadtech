
import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from 'sonner';
import { 
  getDonorAPI, 
  createDonorAPI, 
  updateDonorAPI, 
  getPoliticalClientAPI, 
  createPoliticalClientAPI, 
  getAdminDetailsAPI
} from '@/services/api';
import { 
  mapDonorToUser, 
  mapPoliticalClientToUser, 
  mapUserToDonorRequest, 
  mapUserToPoliticalClientRequest,
  mapAdminToUser
} from '@/services/dataMapping';
import { removeCookie } from '@/utils/cookieUtils';
import { API_BASE_URL } from '@/services/api/base';

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
      // Determine the login endpoint based on role
      const endpoint = role ? `/login/${role}` : '/login/donor';
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: includes cookies
        body: JSON.stringify({
          loginUsername: emailOrUsername,
          loginPw: password
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const { user, role: userRole } = await response.json();
      
      // Map backend user data to frontend format
      const userData = userRole === 'politicalClient' 
        ? mapPoliticalClientToUser(user)
        : userRole === 'admin'
          ? mapAdminToUser(user)
          : mapDonorToUser(user);
      
      // Store user in localStorage and state
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Logged in successfully');
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific login error codes
      if ((error as any).code === 'INVALID_CREDENTIALS') {
        toast.error('Invalid username or password');
      } else if ((error as any).code === 'ACCOUNT_LOCKED') {
        toast.error('Your account has been locked. Please contact support.');
      } else if ((error as any).code === 'USER_NOT_FOUND') {
        toast.error('User not found. Please check your credentials.');
      } else {
        toast.error(error instanceof Error ? error.message : 'Invalid credentials');
      }
      
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
      
      // Handle specific error codes from backend
      if ((error as any).code === 'USERNAME_TAKEN') {
        toast.error('This email is already registered. Please use a different email.');
      } else if ((error as any).code === 'MISSING_REQUIRED_FIELDS') {
        const missingFields = (error as any).details?.missing_fields || [];
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      } else if ((error as any).code === 'INVALID_EMAIL_FORMAT') {
        toast.error('Please enter a valid email address.');
      } else if ((error as any).code === 'WEAK_PASSWORD') {
        toast.error('Password does not meet security requirements. Please use a stronger password.');
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to create account');
      }
      
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
      
      // Handle specific error codes
      if ((error as any).code === 'USERNAME_TAKEN') {
        toast.error('This username is already taken. Please choose a different username.');
      } else if ((error as any).code === 'MISSING_REQUIRED_FIELDS') {
        const missingFields = (error as any).details?.missing_fields || [];
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      } else if ((error as any).code === 'INVALID_ORGANIZATION_INFO') {
        toast.error('Please provide valid organization information.');
      } else if ((error as any).code === 'WEAK_PASSWORD') {
        toast.error('Password does not meet security requirements. Please use a stronger password.');
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to create political client account');
      }
      
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
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
