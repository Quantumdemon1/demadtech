
// Initiative API endpoints
import { request } from './core';
import { validateUsername } from './utils';

/**
 * Initiative data types
 */
interface InitiativeData {
  initiativeName: string;
  objective: string;
  seedQuestions: string;
  status: 'new' | 'active' | 'complete';
  targets: string;
  initiativeGuid?: string;
  initiativeImageFilename?: string;
  initiativeImagePayload?: string;
}

interface InitiativeAssetData {
  assetGuid?: string;
  assetFilename: string;
  assetPayload: string;
  description: string;
  initiativeGuid: string;
  name: string;
}

/**
 * Create or update an initiative
 * @param loginUsername - The username of the authenticated political client
 * @param initiativeData - Object containing initiative details
 * @returns Promise with the created/updated initiative data
 */
export const upsertInitiativeAPI = (loginUsername: string, initiativeData: InitiativeData) => {
  validateUsername(loginUsername);
  return request(`/initiative?loginUsername=${encodeURIComponent(loginUsername)}`, {
    method: 'PUT',
    body: JSON.stringify(initiativeData),
  });
};

/**
 * Get all initiatives
 * @param loginUsername - The username of the authenticated user
 * @returns Promise with all initiatives data
 */
export const getAllInitiativesAPI = (loginUsername: string) => {
  validateUsername(loginUsername);
  return request(`/initiatives/all?loginUsername=${encodeURIComponent(loginUsername)}`, { 
    method: 'GET' 
  });
};

/**
 * Get assets for an initiative
 * @param loginUsername - The username of the authenticated user
 * @param initiativeGuid - The ID of the initiative
 * @returns Promise with initiative assets
 */
export const getInitiativeAssetsAPI = (loginUsername: string, initiativeGuid: string) => {
  validateUsername(loginUsername);
  return request(`/initiative/assets?loginUsername=${encodeURIComponent(loginUsername)}&initiativeId=${encodeURIComponent(initiativeGuid)}`, {
    method: 'GET',
  });
};

/**
 * Create or update an initiative asset
 * @param loginUsername - The username of the authenticated political client
 * @param assetData - Object containing asset details
 * @returns Promise with the created/updated asset data
 */
export const upsertInitiativeAssetAPI = (loginUsername: string, assetData: InitiativeAssetData) => {
  validateUsername(loginUsername);
  return request(`/initiative/asset?loginUsername=${encodeURIComponent(loginUsername)}`, {
    method: 'PUT',
    body: JSON.stringify(assetData),
  });
};

/**
 * Get initiatives joined by a donor
 * @param loginUsername - The username of the authenticated donor
 * @returns Promise with donor's joined initiatives
 */
export const getDonorJoinedInitiativesAPI = (loginUsername: string) => {
  validateUsername(loginUsername);
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
  validateUsername(loginUsername);
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
  validateUsername(loginUsername);
  return request(`/donor/initiative?loginUsername=${encodeURIComponent(loginUsername)}&donorGuid=${encodeURIComponent(donorGuid)}&initiativeId=${encodeURIComponent(initiativeGuid)}`, {
    method: 'DELETE',
  });
};
