
import { request } from './base';

/**
 * Get all awards in the system
 * This endpoint is public but requires the service-level accessToken cookie
 * @returns Promise with list of all awards
 */
export const getAllAwardsSystemAPI = () => {
    return request('/awards', {
        method: 'GET',
    });
};
