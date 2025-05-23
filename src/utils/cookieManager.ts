
// Cookie management for backend authentication
export const CookieManager = {
  // Set the service access token (required for ALL API calls)
  setAccessToken: () => {
    const token = import.meta.env.VITE_ACCESS_TOKEN || 'test-token-12345';
    document.cookie = `accessToken=${token}; path=/; SameSite=Lax`;
    console.log('✅ Access token cookie set');
  },

  // Set user password cookie (required for authenticated endpoints)
  setLoginPassword: (password: string) => {
    document.cookie = `loginPw=${password}; path=/; SameSite=Lax`;
  },

  // Clear authentication cookies
  clearAuthCookies: () => {
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'loginPw=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },

  // Check if cookies are set
  checkCookies: () => {
    const cookies = document.cookie;
    return {
      hasAccessToken: cookies.includes('accessToken='),
      hasLoginPw: cookies.includes('loginPw=')
    };
  }
};

// Auto-set access token when module loads
if (typeof window !== 'undefined') {
  CookieManager.setAccessToken();
}
