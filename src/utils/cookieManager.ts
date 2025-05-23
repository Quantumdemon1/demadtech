
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
    console.log('✅ Login password cookie set');
  },

  // Clear authentication cookies
  clearAuthCookies: () => {
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'loginPw=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('🗑️ Auth cookies cleared');
  },

  // Check if cookies are set
  checkCookies: () => {
    const cookies = document.cookie;
    const hasAccessToken = cookies.includes('accessToken=');
    const hasLoginPw = cookies.includes('loginPw=');
    
    console.log('🍪 Cookie check:', { hasAccessToken, hasLoginPw });
    
    return {
      hasAccessToken,
      hasLoginPw
    };
  },
  
  // Get cookie by name
  getCookie: (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  },
  
  // Refresh auth cookies if they're about to expire
  refreshCookies: (password?: string) => {
    // Always refresh access token
    CookieManager.setAccessToken();
    
    // Only refresh login password if provided
    if (password) {
      CookieManager.setLoginPassword(password);
    }
    
    return CookieManager.checkCookies();
  }
};

// Auto-set access token when module loads
if (typeof window !== 'undefined') {
  CookieManager.setAccessToken();
}
