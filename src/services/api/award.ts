
// Award API endpoints
import { request } from './base';

/**
 * Get all available awards
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

/**
 * Get all system awards (public endpoint)
 * @returns Promise with all awards in the system
 */
export const getAllAwardsSystemAPI = () => {
    return request('/awards', {
        method: 'GET'
    });
};
