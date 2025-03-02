
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from 'sonner';

// Simulate authentication with localStorage
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo account data
const demoAccounts = [
  {
    id: 'demo-user-123',
    email: 'demo@adtech.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'user',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-admin-456',
    email: 'admin@adtech.com',
    password: 'admin123',
    name: 'Demo Admin',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize demo accounts if they don't exist
    initializeDemoAccounts();
    
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Initialize demo accounts in localStorage
  const initializeDemoAccounts = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Only add demo accounts if they don't already exist
    let updated = false;
    
    demoAccounts.forEach(demoAccount => {
      if (!registeredUsers.some((u: Partial<User>) => u.email === demoAccount.email)) {
        registeredUsers.push(demoAccount);
        updated = true;
        console.log(`Demo account created: ${demoAccount.email}`);
      }
    });
    
    if (updated) {
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, we would make an API call here
      // For now, we'll just simulate a login with localStorage
      
      // Check if email exists in "registered users"
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const foundUser = registeredUsers.find((u: Partial<User> & { password: string }) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Set user in state and localStorage
      setUser(userWithoutPassword as User);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: Partial<User>, password: string) => {
    setLoading(true);
    try {
      // In a real app, we would make an API call here
      // For now, we'll just simulate a signup with localStorage
      
      // Check if email already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (registeredUsers.some((u: Partial<User>) => u.email === userData.email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user with ID
      const newUser = {
        ...userData,
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
      };
      
      // Store in "registered users"
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Set user in state and localStorage
      setUser(userWithoutPassword as User);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast.success('Account created successfully');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
