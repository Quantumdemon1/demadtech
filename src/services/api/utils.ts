
// API utility functions

/**
 * Validates that a username is provided for authenticated requests
 * @param loginUsername - The username to validate
 * @returns True if valid, throws error if invalid
 */
export function validateUsername(loginUsername?: string): true {
  if (!loginUsername) {
    throw new Error("loginUsername is required for this API call");
  }
  return true;
}

/**
 * Formats a URL with query parameters
 * @param endpoint - Base endpoint
 * @param params - Object containing query parameters
 * @returns Formatted URL with query string
 */
export function formatUrl(endpoint: string, params: Record<string, string | undefined>): string {
  const url = new URL(endpoint, 'http://base');
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.append(key, value);
    }
  }
  
  return url.pathname + url.search;
}

/**
 * Creates a query string with loginUsername
 * @param loginUsername - The username to include in the query
 * @returns Query string with username parameter
 */
export function withLoginUsername(loginUsername: string, endpoint: string): string {
  validateUsername(loginUsername);
  return `${endpoint}?loginUsername=${encodeURIComponent(loginUsername)}`;
}
