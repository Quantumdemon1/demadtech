
// Base API service for making HTTP requests
import { setCookie, getCookie } from '@/utils/cookieUtils';

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
    // Set accessToken cookie (persistent for 30 days)
    setCookie('accessToken', ACCESS_TOKEN, {
        expires: 30 * 24 * 60 * 60, // 30 days in seconds
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
    });
    
    // Set loginPw cookie with user's password (session only)
    if (password) {
        setCookie('loginPw', password, {
            secure: window.location.protocol === 'https:',
            sameSite: 'lax'
        });
    }
}

/**
 * Clears authentication cookies
 */
export function clearApiAuth() {
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    document.cookie = 'loginPw=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
}

/**
 * Base request function for making API calls to the backend
 * - Automatically prepends API_BASE_URL to all paths
 * - Sets Content-Type to application/json for POST/PUT requests
 * - Includes credentials to send cookies (accessToken, loginPw) with every request
 * - Handles error responses and parses JSON data
 */
export async function request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        // Include credentials (cookies) with every request
        credentials: 'include', 
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            // If response is not JSON or empty
            errorData = { message: response.statusText, status: response.status };
        }
        // Prefer backend error message if available
        const message = errorData?.error || errorData?.message || `API Error: ${response.status}`;
        const error = new Error(message);
        // Attach status and data to the error object for more context
        (error as any).status = response.status;
        (error as any).data = errorData;
        throw error;
    }

    if (response.status === 204) { // No Content
        return null; 
    }
    return response.json();
}
