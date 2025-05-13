
/**
 * Sets a cookie with the specified name, value and options
 */
export function setCookie(name: string, value: string, options: { 
  path?: string; 
  expires?: Date | number; 
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
} = {}): void {
  const { path = '/', secure, expires, sameSite } = options;
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (path) {
    cookieString += `; path=${path}`;
  }
  
  if (expires) {
    if (typeof expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + expires * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
  }
  
  if (secure) {
    cookieString += '; secure';
  }
  
  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }
  
  document.cookie = cookieString;
}

/**
 * Gets a cookie value by name
 */
export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  
  return undefined;
}

/**
 * Removes a cookie by setting its expiration to the past
 */
export function removeCookie(name: string, path = '/'): void {
  setCookie(name, '', {
    path,
    expires: new Date(0) // Set expiration to the past
  });
}
