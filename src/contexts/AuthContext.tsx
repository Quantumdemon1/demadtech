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
import { API_BASE_URL, setupApiAuth, clearApiAuth } from '@/services/api/base';
import { CookieManager } from '@/utils/cookieManager';
import { 
  testUsers, 
  testCredentials, 
  testCampaigns 
} from '@/utils/testAccountsData';
import { 
  initializeTestAccountSystem, 
  getTestDataForRole,
  simulateAPIDelay
} from '@/utils/authUtils';

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize test account system
    initializeTestAccountSystem();
    
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

  // Login handler with test account support
  const login = async (emailOrUsername: string, password: string, role?: 'donor' | 'politicalClient' | 'admin'): Promise<User> => {
    setLoading(true);
    try {
      // Check if using test credentials
      const isDonorTest = emailOrUsername === testCredentials.donor.username && password === testCredentials.donor.password;
      const isPoliticalTest = emailOrUsername === testCredentials.politicalClient.username && password === testCredentials.politicalClient.password;
      const isAdminTest = emailOrUsername === testCredentials.admin.username && password === testCredentials.admin.password;
      
      // If using test credentials, return the appropriate test user
      if (isDonorTest || isPoliticalTest || isAdminTest) {
        // Add a small delay for realism
        await simulateAPIDelay(600, 1200);
        
        let testUser;
        if (isDonorTest) {
          testUser = testUsers.find(u => u.role === 'donor');
        } else if (isPoliticalTest) {
          testUser = testUsers.find(u => u.role === 'politicalClient');
        } else {
          testUser = testUsers.find(u => u.role === 'admin');
        }
        
        if (testUser) {
          // Store user in localStorage and state
          localStorage.setItem('user', JSON.stringify(testUser));
          setUser(testUser);
          
          // Set up authentication cookies for test accounts
          CookieManager.setLoginPassword(password);
          
          // Show success toast with appropriate message
          toast.success(`Logged in as ${testUser.firstName || testUser.politicalClientName || 'Admin'} (Test Account)`);
          
          return testUser;
        }
      }
      
      // Real API login for non-test accounts
      try {
        // Set password cookie before API call
        document.cookie = `loginPw=${password}; path=/; SameSite=Lax`;
        
        // Determine which endpoint based on role
        let endpoint = '/donor';
        let mapFunction = mapDonorToUser;
        
        if (role === 'politicalClient') {
          endpoint = '/political-client';
          mapFunction = mapPoliticalClientToUser;
        } else if (role === 'admin') {
          endpoint = '/admin/auth';
          mapFunction = mapAdminToUser;
        }
        
        // Call API with loginUsername as query parameter
        const response = await fetch(
          `${API_BASE_URL}${endpoint}?loginUsername=${encodeURIComponent(emailOrUsername)}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Login failed');
        }
        
        const userData = await response.json();
        const mappedUser = mapFunction(userData);
        
        // Store user and show success
        localStorage.setItem('user', JSON.stringify(mappedUser));
        setUser(mappedUser);
        toast.success('Logged in successfully');
        
        return mappedUser;
      } catch (error) {
        console.error('Login error:', error);
        toast.error(error instanceof Error ? error.message : 'Invalid credentials');
        throw error;
      }
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
      // Prepare donor data
      const donorRequest = {
        donorName: `${userData.firstName} ${userData.lastName}`.trim(),
        loginUsername: userData.email || '',
        loginPw: password
      };
      
      // Call real API
      const response = await createDonorAPI(donorRequest);
      
      // Map response to User object
      const newUser = mapDonorToUser(response);
      
      // Set password cookie for future authenticated requests
      document.cookie = `loginPw=${password}; path=/; SameSite=Lax`;
      
      // Store user
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success('Account created successfully');
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific backend errors
      if ((error as any)?.status === 409) {
        toast.error('This email is already registered');
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
      // Simulate API delay
      await simulateAPIDelay(800, 1500);
      
      // Create new political client user
      const newUser = {
        id: `political-${Date.now()}`,
        loginUsername: userData.loginUsername || `org-${Date.now()}`,
        politicalClientName: userData.politicalClientName || 'New Organization',
        role: 'politicalClient',
        email: userData.email,
        createdAt: new Date().toISOString(),
        profileImageUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=150&h=150&fit=crop'
      };
      
      // Store in registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Store in current user
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser as User);
      
      toast.success('Organization account created successfully');
      return newUser as User;
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
    // Clear cookies
    document.cookie = 'loginPw=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Keep access token cookie (it's service-level, not user-level)
    
    // Clear localStorage and state
    localStorage.removeItem('user');
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
