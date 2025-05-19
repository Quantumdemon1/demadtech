// API Client Service for communicating with the backend
// Backend URL is loaded from environment variable VITE_API_BASE_URL

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/v1';

/**
 * Base request function for making API calls to the backend
 * - Automatically prepends API_BASE_URL to all paths
 * - Sets Content-Type to application/json for POST/PUT requests
 * - Includes credentials to send cookies (accessToken, loginPw) with every request
 * - Handles error responses and parses JSON data
 */
async function request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        // Include credentials (cookies) with every request
        credentials: 'include', 
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            // If response is not JSON or empty
            errorData = { message: response.statusText, status: response.status };
        }
        // Prefer backend error message if available
        const message = errorData?.error || errorData?.message || `API Error: ${response.status}`;
        const error = new Error(message);
        // Attach status and data to the error object for more context
        (error as any).status = response.status;
        (error as any).data = errorData;
        throw error;
    }

    if (response.status === 204) { // No Content
        return null; 
    }
    return response.json();
}

// === DONOR API ENDPOINTS ===

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

// === POLITICAL CLIENT API ENDPOINTS ===

/**
 * Get political client details by loginUsername
 * @param loginUsername - The username of the political client to fetch
 * @returns Promise with political client data
 */
export const getPoliticalClientAPI = (loginUsername: string) => {
    return request(`/political-client?loginUsername=${encodeURIComponent(loginUsername)}`, { 
        method: 'GET' 
    });
};

/**
 * Create a new political client account
 * @param clientData - Object containing required political client data
 * @returns Promise with the created political client data
 */
export const createPoliticalClientAPI = (clientData: { 
    politicalClientName: string, 
    loginUsername: string, 
    loginPw: string 
}) => {
    return request('/political-client', {
        method: 'POST',
        body: JSON.stringify(clientData),
    });
};

/**
 * Update an existing political client account
 * @param loginUsername - The username of the political client to update
 * @param clientData - Object containing fields to update
 * @returns Promise with the updated political client data
 */
export const updatePoliticalClientAPI = (loginUsername: string, clientData: {
    politicalClientName?: string,
    ein?: string,
    email?: string,
    fecNum?: string,
    fundingMethod?: string,
    loginUsername?: string,
    loginPw?: string,
    pacId?: string,
    platform?: string,
    profileImageFilename?: string,
    profileImagePayload?: string,
    targets?: string
}) => {
    return request(`/political-client?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'PUT',
        body: JSON.stringify(clientData),
    });
};

/**
 * Get initiatives created by a political client
 * @param loginUsername - The username of the authenticated political client
 * @returns Promise with the political client's initiatives
 */
export const getPoliticalClientInitiativesAPI = (loginUsername: string) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to fetch initiatives."));
    }
    return request(`/political-client/initiatives?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'GET',
    });
};

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

/**
 * Add funds to a donor's account
 * @param loginUsername - The username of the authenticated political client
 * @param paymentData - Object containing payment details
 * @returns Promise with the payment result
 */
export const politicalClientPayDonorAPI = (loginUsername: string, paymentData: {
    amount: string;
    donorGuid: string;
    initiativeGuid: string;
}) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to make a payment."));
    }
    return request(`/political-client/donor/pay?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'POST',
        body: JSON.stringify(paymentData),
    });
};

/**
 * Grant an award to a donor
 * @param loginUsername - The username of the authenticated political client
 * @param grantData - Object containing award grant details
 * @returns Promise with the grant result
 */
export const politicalClientGrantAwardAPI = (loginUsername: string, grantData: {
    awardGuid: string;
    donorGuid: string;
    adCampaignGuid?: string;
    initiativeGuid?: string;
}) => {
    if (!loginUsername) {
        return Promise.reject(new Error("loginUsername is required to grant an award."));
    }
    return request(`/political-client/donor/award?loginUsername=${encodeURIComponent(loginUsername)}`, {
        method: 'POST',
        body: JSON.stringify(grantData),
    });
};

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

// === INITIATIVE API ENDPOINTS ===

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

// === AD CAMPAIGN API ENDPOINTS ===

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

// Removed the duplicate getInitiativeAssetsAPI function that was here
