
// Base API service for making HTTP requests
import { CookieManager } from '@/utils/cookieManager';
import { request, API_BASE_URL, ACCESS_TOKEN } from './core';

// Re-export core functionality
export { request, API_BASE_URL, ACCESS_TOKEN };

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
  return CookieManager.checkCookies();
}
