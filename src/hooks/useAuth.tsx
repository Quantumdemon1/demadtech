
import { useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User } from '@/types';

interface AuthResponse {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role?: 'donor' | 'politicalClient' | 'admin') => Promise<User>;
  signup: (userData: Partial<User>, password: string) => Promise<User>;
  politicalClientSignup: (userData: Partial<User>, password: string) => Promise<User>;
  logout: () => void;
  updateUserProfile: (userData: User) => void;
}

const useAuth = (): AuthResponse => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    // Instead of throwing an error, display a toast and return a safe fallback
    toast.error('Authentication context not found. Please reload the application.');
    console.error('useAuth hook must be used within an AuthProvider');
    
    // Return a safe fallback object with empty functions
    return {
      user: null,
      loading: false,
      login: async () => { 
        toast.error('Authentication service unavailable');
        return Promise.reject(new Error('Auth context not available'));
      },
      signup: async () => {
        toast.error('Authentication service unavailable');
        return Promise.reject(new Error('Auth context not available'));
      },
      politicalClientSignup: async () => {
        toast.error('Authentication service unavailable');
        return Promise.reject(new Error('Auth context not available'));
      },
      logout: () => {
        toast.error('Authentication service unavailable');
      },
      updateUserProfile: () => {
        toast.error('Authentication service unavailable');
      },
    };
  }
  
  return context;
};

export default useAuth;
