
// Base API service for making HTTP requests
import { setCookie, getCookie } from '@/utils/cookieUtils';
import { CookieManager } from '@/utils/cookieManager';

/**
 * Base URL for API requests loaded from environment variable
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/v1';

/**
 * Access token for API authentication
 */
export const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || 'test-token-12345';

/**
 * Sets up required cookies for API authentication
 * @param password - User password to set in loginPw cookie
 */
export function setupApiAuth(password: string) {
    // Set access token cookie
    CookieManager.setAccessToken();
    
    // Set loginPw cookie with user's password
    if (password) {
        CookieManager.setLoginPassword(password);
    }
}

/**
 * Clears authentication cookies
 */
export function clearApiAuth() {
    CookieManager.clearAuthCookies();
}

/**
 * Checks if the required authentication cookies are present
 * @returns Object indicating if access token and login password cookies exist
 */
export function checkAuthCookies() {
    return {
        hasAccessToken: document.cookie.includes('accessToken='),
        hasLoginPw: document.cookie.includes('loginPw=')
    };
}

/**
 * Base request function for making API calls to the backend
 * - Automatically prepends API_BASE_URL to all paths
 * - Sets Content-Type to application/json for POST/PUT requests
 * - Includes credentials to send cookies (accessToken, loginPw) with every request
 * - Handles error responses and parses JSON data
 */
export async function request(endpoint: string, options: RequestInit = {}) {
    // Ensure access token is set
    const cookies = document.cookie;
    if (!cookies.includes('accessToken=')) {
        console.warn('⚠️ Access token not set. Setting now...');
        document.cookie = `accessToken=${import.meta.env.VITE_ACCESS_TOKEN || 'test-token-12345'}; path=/; SameSite=Lax`;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        credentials: 'include', // CRITICAL: This sends cookies
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        console.log(`🔄 API Request: ${options.method || 'GET'} ${endpoint}`);
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: response.statusText, status: response.status };
            }
            
            // Enhanced error logging
            if (response.status === 401) {
                console.error('🔐 Authentication failed. Access token or login password may be invalid or missing.');
                console.log('Current cookies:', document.cookie);
                
                // Check specific authentication cookies
                const authCookies = checkAuthCookies();
                console.log('Auth cookies present:', authCookies);
                
                if (!authCookies.hasAccessToken) {
                    console.error('Missing accessToken cookie');
                }
                
                if (!authCookies.hasLoginPw) {
                    console.error('Missing loginPw cookie');
                }
            } else if (response.status === 0) {
                console.error('🚫 CORS error or backend not reachable.');
                console.log('Attempted URL:', url);
                console.log('Is backend running on http://localhost:8080?');
            }
            
            const message = errorData?.error || errorData?.message || `API Error: ${response.status}`;
            const error = new Error(message);
            (error as any).status = response.status;
            (error as any).data = errorData;
            throw error;
        }

        if (response.status === 204) {
            return null; 
        }
        
        const data = await response.json();
        console.log(`✅ API Response:`, data);
        return data;
    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            console.error('🌐 Network error: Cannot reach backend at', API_BASE_URL);
            console.error('Please ensure:');
            console.error('1. Backend is running on http://localhost:8080');
            console.error('2. No firewall/proxy blocking the connection');
        }
        throw error;
    }
}
