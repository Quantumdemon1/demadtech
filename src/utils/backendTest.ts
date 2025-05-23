
import { toast } from 'sonner';
import { API_BASE_URL } from '@/services/api/base';

/**
 * Tests the connection to the backend server
 * Used to validate that the API is reachable and authentication is working
 */
export const testBackendConnection = async () => {
  console.log('🧪 Testing backend connection...');
  
  try {
    // Test 1: Basic connectivity
    const response = await fetch(`${API_BASE_URL}/live`);
    if (!response.ok) {
      throw new Error('Backend health check failed');
    }
    
    console.log('✅ Backend is reachable');
    
    // Test 2: Check access token
    const testResponse = await fetch(`${API_BASE_URL}/awards`, {
      credentials: 'include'
    });
    
    if (testResponse.status === 401) {
      console.error('❌ Access token not working');
      toast.error('Access token issue. Check cookie settings.');
    } else {
      console.log('✅ Access token is valid');
      toast.success('Backend connection successful!');
    }
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    toast.error('Cannot connect to backend. Is it running on port 8080?');
  }
};

// Auto-run in development
if (import.meta.env.DEV) {
  setTimeout(testBackendConnection, 2000);
}
