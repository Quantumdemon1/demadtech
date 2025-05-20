
// Admin API endpoints
import { request } from './base';

/**
 * Get admin details by loginUsername
 * @param loginUsername - The username of the admin to fetch
 * @returns Promise with admin data from the backend
 */
export const getAdminDetailsAPI = (loginUsername: string) => {
    return request(`/admin/auth?loginUsername=${encodeURIComponent(loginUsername)}`, { 
        method: 'GET' 
    });
};

/**
 * Get all unapproved ad campaigns
 * @param adminLoginUsername - The username of the authenticated admin
 * @returns Promise with unapproved ad campaigns
 */
export const getUnapprovedAdCampaignsAdminAPI = (adminLoginUsername: string) => {
    if (!adminLoginUsername) {
        return Promise.reject(new Error("Admin loginUsername is required to fetch unapproved campaigns."));
    }
    return request(`/admin/ad-campaigns/unapproved?loginUsername=${encodeURIComponent(adminLoginUsername)}`, {
        method: 'GET'
    });
};

/**
 * Update an ad campaign's status
 * @param adminLoginUsername - The username of the authenticated admin
 * @param adCampaignId - The ID of the ad campaign to update
 * @param status - The new status ('approved' or 'rejected')
 * @returns Promise with the updated ad campaign
 */
export const updateAdCampaignStatusAdminAPI = (
    adminLoginUsername: string, 
    adCampaignId: string, 
    status: 'approved' | 'rejected'
) => {
    if (!adminLoginUsername) {
        return Promise.reject(new Error("Admin loginUsername is required to update campaign status."));
    }
    return request(`/admin/ad-campaign?loginUsername=${encodeURIComponent(adminLoginUsername)}`, {
        method: 'PUT',
        body: JSON.stringify({
            adCampaignId,
            adCampaignStatus: status
        }),
    });
};

/**
 * Create or update an award
 * @param adminLoginUsername - The username of the authenticated admin
 * @param awardData - Object containing award details
 * @returns Promise with the created/updated award data
 */
export const upsertAwardAdminAPI = (adminLoginUsername: string, awardData: {
    name: string;
    description: string;
    filename?: string;
    payload?: string;
    awardGuid?: string;
}) => {
    if (!adminLoginUsername) {
        return Promise.reject(new Error("Admin loginUsername is required to create/update an award."));
    }
    return request(`/award?loginUsername=${encodeURIComponent(adminLoginUsername)}`, {
        method: 'PUT',
        body: JSON.stringify(awardData),
    });
};

/**
 * Delete an award
 * @param adminLoginUsername - The username of the authenticated admin
 * @param awardGuid - The ID of the award to delete
 * @returns Promise with the deletion result
 */
export const deleteAwardAdminAPI = (adminLoginUsername: string, awardGuid: string) => {
    if (!adminLoginUsername) {
        return Promise.reject(new Error("Admin loginUsername is required to delete an award."));
    }
    return request(`/award?loginUsername=${encodeURIComponent(adminLoginUsername)}&awardGuid=${encodeURIComponent(awardGuid)}`, {
        method: 'DELETE'
    });
};
