
// Campaign API endpoints
import { request } from './core';
import { validateUsername } from './utils';

/**
 * Campaign data types
 */
interface CampaignData {
  name: string;
  initiativeGuid: string;
  description: string;
  seedAnswers: { question: string; answer: string }[];
  contentType?: 'funny' | 'personal' | 'formal';
  startDate?: string;
  endDate?: string;
  adSpend?: number;
}

interface AdCreativeData {
  adCampaignGuid: string;
  adCreativeGuid?: string; // Include for updates, omit for creation
  name: string;
  caption: string;
  adCreativePayload: string; // Base64 image string
  sourceAssetGuid?: string; // Optional initiative asset GUID
}

/**
 * Get ad campaigns for a donor
 * @param loginUsername - The username of the authenticated donor
 * @returns Promise with all ad campaigns for the donor
 */
export const getDonorAdCampaignsAPI = (loginUsername: string) => {
  validateUsername(loginUsername);
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
  validateUsername(loginUsername);
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
export const createAdCampaignAPI = (loginUsername: string, campaignData: CampaignData) => {
  validateUsername(loginUsername);
  
  // For write operations, check if loginPw cookie is set
  if (!document.cookie.includes('loginPw=')) {
    return Promise.reject(new Error("Authentication expired. Please log in again."));
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
  validateUsername(loginUsername);
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
export const upsertAdCreativeAPI = (loginUsername: string, creativeData: AdCreativeData) => {
  validateUsername(loginUsername);
  
  // For write operations, check if loginPw cookie is set
  if (!document.cookie.includes('loginPw=')) {
    return Promise.reject(new Error("Authentication expired. Please log in again."));
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
  validateUsername(loginUsername);
  
  // For write operations, check if loginPw cookie is set
  if (!document.cookie.includes('loginPw=')) {
    return Promise.reject(new Error("Authentication expired. Please log in again."));
  }
  
  return request(`/ad-campaign/ad-creative?loginUsername=${encodeURIComponent(loginUsername)}&adCreativeGuid=${encodeURIComponent(adCreativeGuid)}`, {
    method: 'DELETE',
  });
};
