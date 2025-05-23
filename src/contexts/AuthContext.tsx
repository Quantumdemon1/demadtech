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
      const endpoint = role ? `/login/${role}` : '/login/donor';
      
      // Set up authentication cookies before making the login request
      CookieManager.setLoginPassword(password);
      
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
        // Clear cookies if login fails
        CookieManager.clearAuthCookies();
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
      // Simulate API delay
      await simulateAPIDelay(800, 1500);
      
      // Create request body for donor creation
      const donorData = mapUserToDonorRequest({
        ...userData,
        password // Add password to be mapped by the utility
      });
      
      // For demo purposes, store in localStorage instead of calling real API
      const newUser = {
        id: `donor-${Date.now()}`,
        email: userData.email,
        loginUsername: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'donor',
        phone: userData.phone,
        occupation: userData.occupation,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zip: userData.zip,
        accountBalance: '0.00',
        createdAt: new Date().toISOString(),
        profileImageUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face'
      };
      
      // Store in registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Store in current user
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser as User);
      
      toast.success('Account created successfully');
      return newUser as User;
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
    // Remove user from localStorage
    localStorage.removeItem('user');
    // Clear authentication cookies
    CookieManager.clearAuthCookies();
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
