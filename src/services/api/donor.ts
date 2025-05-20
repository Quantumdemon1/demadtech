
// Donor API endpoints
import { request } from './base';

/**
 * Get donor details by loginUsername
 * @param loginUsername - The username of the donor to fetch
 * @returns Promise with donor data from the backend
 */
export const getDonorAPI = (loginUsername: string) => {
    return request(`/donor?loginUsername=${encodeURIComponent(loginUsername)}`, { 
        method: 'GET' 
    });
};

/**
 * Create a new donor account
 * @param donorData - Object containing donorName, loginUsername, and loginPw
 * @returns Promise with the created donor data
 */
export const createDonorAPI = (donorData: { 
    donorName: string, 
    loginUsername: string, 
    loginPw: string 
}) => {
    return request('/donor', {
        method: 'POST',
        body: JSON.stringify(donorData),
    });
};

/**
 * Update an existing donor account
 * @param loginUsername - The username of the donor to update
 * @param donorData - Object containing fields to update
 * @returns Promise with the updated donor data
 */
export const updateDonorAPI = (loginUsername: string, donorData: {
    donorName?: string,
    profileImageFilename?: string,
    profileImagePayload?: string
}) => {
    return request(`/donor?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'PUT',
        body: JSON.stringify(donorData),
    });
};

/**
 * Get initiatives joined by a donor
 * @param loginUsername - The username of the authenticated donor
 * @returns Promise with donor's joined initiatives
 */
export const getDonorJoinedInitiativesAPI = (loginUsername: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to fetch joined initiatives."));
    }
    return request(`/donor/initiatives?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'GET',
    });
};

/**
 * Link a donor to an initiative (join)
 * @param loginUsername - The username of the authenticated donor
 * @param initiativeGuid - The ID of the initiative to join
 * @returns Promise with the created donor-initiative link
 */
export const linkDonorToInitiativeAPI = (loginUsername: string, initiativeGuid: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to join an initiative."));
    }
    return request(`/donor/initiative?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'POST',
        body: JSON.stringify({ initiativeGuid }),
    });
};

/**
 * Unlink a donor from an initiative (leave)
 * @param loginUsername - The username of the authenticated donor
 * @param donorGuid - The ID of the donor
 * @param initiativeGuid - The ID of the initiative to leave
 * @returns Promise with the response
 */
export const unlinkDonorFromInitiativeAPI = (loginUsername: string, donorGuid: string, initiativeGuid: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to leave an initiative."));
    }
    return request(`/donor/initiative?loginUsername=${encodeURIComponent(loginUsername)}&donorGuid=${encodeURIComponent(donorGuid)}&initiativeId=${encodeURIComponent(initiativeGuid)}`, {
        method: 'DELETE',
    });
};
