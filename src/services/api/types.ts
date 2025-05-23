
// API Types

/**
 * Common options for API requests
 */
export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * API error interface 
 */
export interface ApiError extends Error {
  status?: number;
  data?: any;
  code?: string;
  details?: any;
}

/**
 * Base API response interface
 */
export interface ApiResponse<T = any> {
  data: T;
  error?: string;
  status: number;
}
