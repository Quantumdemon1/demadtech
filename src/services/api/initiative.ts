
// Initiative API endpoints
import { request } from './base';

/**
 * Create or update an initiative
 * @param loginUsername - The username of the authenticated political client
 * @param initiativeData - Object containing initiative details
 * @returns Promise with the created/updated initiative data
 */
export const upsertInitiativeAPI = (loginUsername: string, initiativeData: {
    initiativeName: string;
    objective: string;
    seedQuestions: string;
    status: 'new' | 'active' | 'complete';
    targets: string;
    initiativeGuid?: string;
    initiativeImageFilename?: string;
    initiativeImagePayload?: string;
}) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to create/update an initiative."));
    }
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
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to fetch initiatives."));
    }
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
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to fetch initiative assets."));
    }
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
export const upsertInitiativeAssetAPI = (loginUsername: string, assetData: {
    assetGuid?: string;
    assetFilename: string;
    assetPayload: string;
    description: string;
    initiativeGuid: string;
    name: string;
}) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to create/update an asset."));
    }
    return request(`/initiative/asset?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'PUT',
        body: JSON.stringify(assetData),
    });
};
