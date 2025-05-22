
import { useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';
import { toast } from 'sonner';

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    // Instead of throwing an error, display a toast and return a safe fallback
    toast.error('Authentication context not found. Please reload the application.');
    
    // Return a safe fallback object with empty functions
    return {
      user: null,
      loading: false,
      login: async () => { 
        toast.error('Authentication service unavailable');
        throw new Error('Auth context not available');
      },
      signup: async () => {
        toast.error('Authentication service unavailable');
        throw new Error('Auth context not available');
      },
      politicalClientSignup: async () => {
        toast.error('Authentication service unavailable');
        throw new Error('Auth context not available');
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
