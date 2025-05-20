
import { request } from './base';

/**
 * Get admin user details
 * @param loginUsername - The username of the admin
 * @returns Promise with admin details
 */
export const getAdminDetailsAPI = (loginUsername: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to fetch admin details."));
    }
    return request(`/admin/auth?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'GET',
    });
};

/**
 * Get list of unapproved campaigns that need admin review
 * @param adminLoginUsername - The username of the admin
 * @returns Promise with list of unapproved campaigns
 */
export const getUnapprovedAdCampaignsAdminAPI = (adminLoginUsername: string) => {
    if (!adminLoginUsername) {
        return Promise.reject(new Error("adminLoginUsername is required to fetch unapproved campaigns."));
    }
    return request(`/admin/ad-campaigns/unapproved?loginUsername=${encodeURIComponent(adminLoginUsername)}`, {
        method: 'GET',
    });
};

/**
 * Update campaign status (approve or reject)
 * Simplified endpoint that only requires campaign ID and new status
 * @param adminLoginUsername - The username of the admin
 * @param adCampaignGuid - The ID of the campaign to update
 * @param status - The new status (approved or rejected)
 * @returns Promise with updated campaign data
 */
export const updateAdCampaignStatusAdminAPI = (
    adminLoginUsername: string, 
    adCampaignGuid: string, 
    status: 'approved' | 'rejected'
) => {
    if (!adminLoginUsername) {
        return Promise.reject(new Error("adminLoginUsername is required to update campaign status."));
    }
    return request(`/admin/ad-campaign?loginUsername=${encodeURIComponent(adminLoginUsername)}`, {
        method: 'PUT',
        body: JSON.stringify({
            adCampaignGuid,
            adCampaignStatus: status
        }),
    });
};

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
 * Create or update an award
 * @param adminLoginUsername - The username of the admin
 * @param awardData - Object containing award data (name, description, image)
 * @returns Promise with created/updated award data
 */
export const upsertAwardAdminAPI = (adminLoginUsername: string, awardData: {
    awardGuid?: string; // Include for updates, omit for creation
    name: string;
    description: string;
    filename?: string;
    payload?: string; // Base64 image string
}) => {
    if (!adminLoginUsername) {
        return Promise.reject(new Error("adminLoginUsername is required to create/update an award."));
    }
    return request(`/admin/award?loginUsername=${encodeURIComponent(adminLoginUsername)}`, {
        method: 'PUT',
        body: JSON.stringify(awardData),
    });
};

/**
 * Delete an award
 * @param adminLoginUsername - The username of the admin
 * @param awardGuid - The ID of the award to delete
 * @returns Promise with deletion result
 */
export const deleteAwardAdminAPI = (adminLoginUsername: string, awardGuid: string) => {
    if (!adminLoginUsername) {
        return Promise.reject(new Error("adminLoginUsername is required to delete an award."));
    }
    return request(`/admin/award?loginUsername=${encodeURIComponent(adminLoginUsername)}&awardGuid=${encodeURIComponent(awardGuid)}`, {
        method: 'DELETE',
    });
};
