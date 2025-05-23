
import { request } from './base';

/**
 * Log in a user with email/username and password
 * This will set authentication cookies that will be automatically included in future requests
 * @param credentials - User login credentials
 * @returns Promise with user data
 */
export const loginAPI = (credentials: {
    emailOrUsername: string;
    password: string;
}) => {
    // For login, we need to set the loginPw cookie before making the request
    document.cookie = `loginPw=${credentials.password}; path=/; SameSite=Lax`;
    
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

/**
 * Sign up a new user
 * @param userData - New user registration data
 * @param password - User password
 * @returns Promise with created user data
 */
export const signupAPI = (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    occupation?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    role: string;
}, password: string) => {
    // For signup, we need to set the loginPw cookie before making the request
    document.cookie = `loginPw=${password}; path=/; SameSite=Lax`;
    
    return request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ ...userData, password }),
    });
};

/**
 * Log out the current user
 * This will clear authentication cookies
 * @returns Promise with logout confirmation
 */
export const logoutAPI = () => {
    return request('/auth/logout', {
        method: 'POST',
    });
};

/**
 * Get the current authenticated user's information
 * Uses cookies for authentication
 * @param loginUsername - The username or email of the user
 * @returns Promise with user data
 */
export const getCurrentUserAPI = (loginUsername: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to get user data."));
    }
    
    // Check if access token is set
    if (!document.cookie.includes('accessToken=')) {
        return Promise.reject(new Error("Access token is missing. Please log in again."));
    }
    
    return request(`/auth/me?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'GET',
    });
};
