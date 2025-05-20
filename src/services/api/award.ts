
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

/**
 * Get all available awards for a specific user
 * @param loginUsername - The username of the authenticated user
 * @returns Promise with all awards data
 */
export const getAllAwardsAPI = (loginUsername: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to fetch awards."));
    }
    return request(`/awards?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'GET',
    });
};
