
// Political Client API endpoints
import { request } from './base';

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
