
// Campaign API endpoints
import { request } from './base';

/**
 * Get ad campaigns for a donor
 * @param loginUsername - The username of the authenticated donor
 * @returns Promise with all ad campaigns for the donor
 */
export const getDonorAdCampaignsAPI = (loginUsername: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to fetch ad campaigns."));
    }
    return request(`/ad-campaigns?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'GET',
    });
};

/**
 * Get a single ad campaign by ID
 * @param loginUsername - The username of the authenticated user
 * @param adCampaignGuid - The ID of the ad campaign
 * @returns Promise with detailed ad campaign data
 */
export const getAdCampaignByIdAPI = (loginUsername: string, adCampaignGuid: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to fetch an ad campaign."));
    }
    return request(`/ad-campaign/${encodeURIComponent(adCampaignGuid)}?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'GET',
    });
};

/**
 * Create a new ad campaign
 * @param loginUsername - The username of the authenticated donor
 * @param campaignData - Object containing campaign details
 * @returns Promise with the created ad campaign data
 */
export const createAdCampaignAPI = (loginUsername: string, campaignData: {
    name: string;
    initiativeGuid: string;
    description: string;
    seedAnswers: { question: string; answer: string }[];
    contentType?: 'funny' | 'personal' | 'formal';
    startDate?: string;
    endDate?: string;
    adSpend?: number;
}) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to create an ad campaign."));
    }
    return request(`/ad-campaign?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'PUT',
        body: JSON.stringify(campaignData),
    });
};

/**
 * Get ad creatives for an ad campaign
 * @param loginUsername - The username of the authenticated user
 * @param adCampaignGuid - The ID of the ad campaign
 * @returns Promise with ad creatives for the campaign
 */
export const getAdCreativesAPI = (loginUsername: string, adCampaignGuid: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to fetch ad creatives."));
    }
    return request(`/ad-campaign/ad-creatives?loginUsername=${encodeURIComponent(loginUsername)}&adCampaignGuid=${encodeURIComponent(adCampaignGuid)}`, {
        method: 'GET',
    });
};

/**
 * Create or update an ad creative
 * @param loginUsername - The username of the authenticated user
 * @param creativeData - Object containing ad creative details
 * @returns Promise with the created/updated ad creative data
 */
export const upsertAdCreativeAPI = (loginUsername: string, creativeData: {
    adCampaignGuid: string;
    adCreativeGuid?: string; // Include for updates, omit for creation
    name: string;
    caption: string;
    adCreativePayload: string; // Base64 image string
    sourceAssetGuid?: string; // Optional initiative asset GUID
}) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to create/update an ad creative."));
    }
    return request(`/ad-campaign/ad-creative?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'PUT',
        body: JSON.stringify(creativeData),
    });
};

/**
 * Delete an ad creative
 * @param loginUsername - The username of the authenticated user
 * @param adCreativeGuid - The ID of the ad creative to delete
 * @returns Promise with the deletion result
 */
export const deleteAdCreativeAPI = (loginUsername: string, adCreativeGuid: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to delete an ad creative."));
    }
    return request(`/ad-campaign/ad-creative?loginUsername=${encodeURIComponent(loginUsername)}&adCreativeGuid=${encodeURIComponent(adCreativeGuid)}`, {
        method: 'DELETE',
    });
};
