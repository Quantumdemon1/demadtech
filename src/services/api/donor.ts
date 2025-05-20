
// Donor API endpoints
import { request } from './base';

/**
 * Get a specific donor by loginUsername
 * @param loginUsername - The username of the authenticated donor
 * @returns Promise with donor data
 */
export const getDonorAPI = (loginUsername: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to fetch donor data."));
    }
    return request(`/donor?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'GET',
    });
};

/**
 * Update donor profile
 * @param loginUsername - The username of the authenticated donor
 * @param donorData - Object containing fields to update
 * @returns Promise with the updated donor data
 */
export const updateDonorAPI = (loginUsername: string, donorData: {
    donorName?: string;
    profileImageFilename?: string;
    profileImagePayload?: string;
}) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to update donor profile."));
    }
    return request(`/donor?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'PUT',
        body: JSON.stringify(donorData),
    });
};

/**
 * Search donors by name or other criteria
 * @param loginUsername - The username of the authenticated political client
 * @param searchQuery - The search string to find donors
 * @returns Promise with matching donors data
 */
export const searchDonorsAPI = (loginUsername: string, searchQuery: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to search donors."));
    }
    return request(`/donors/search?loginUsername=${encodeURIComponent(loginUsername)}&q=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
    });
};
