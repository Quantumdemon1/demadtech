
// Re-export all API functions from their respective modules
export * from './base';
export * from './admin';
export * from './donor';
export * from './initiative';
export * from './political-client';
export * from './campaign';
export * from './award';
export * from './auth';
export * from './core';
export * from './utils';

// Export authentication helpers
export { setupApiAuth, clearApiAuth, checkAuthCookies } from './base';
