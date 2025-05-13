
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
