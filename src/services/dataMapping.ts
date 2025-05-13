
import { User } from "@/types";

/**
 * Data Mapping Utilities
 * 
 * This file contains functions to map between frontend data models and backend API schemas.
 * The mappings handle differences in field names, data structure, and conventions.
 */

/**
 * Maps backend donor response to frontend User object
 */
export function mapDonorToUser(donorData: any): User {
  return {
    id: donorData.donorGuid,
    role: 'donor',
    // If donorName is provided, we could try to split it into firstName/lastName
    // but this can be unreliable, so we just store it as a combined name field
    firstName: donorData.donorName?.split(' ')[0] || '',
    lastName: donorData.donorName?.split(' ').slice(1).join(' ') || '',
    loginUsername: donorData.loginUsername,
    email: donorData.loginUsername, // Backend uses loginUsername as the email identifier
    accountBalance: donorData.accountBalance,
    profileImageUrl: donorData.profileImageUrl,
    profileImagePresignedUrl: donorData.profileImagePresignedUrl,
    // Note: These fields below are not currently provided by the backend
    // but are defined in the frontend User interface
    phone: '',
    occupation: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    createdAt: new Date().toISOString(), // Use current date as fallback
  };
}

/**
 * Maps backend political client response to frontend User object
 */
export function mapPoliticalClientToUser(clientData: any): User {
  return {
    id: clientData.politicalClientGuid,
    role: 'politicalClient',
    politicalClientName: clientData.politicalClientName,
    loginUsername: clientData.loginUsername,
    email: clientData.loginUsername, // Backend uses loginUsername as the email identifier
    profileImageUrl: clientData.profileImageUrl,
    profileImagePresignedUrl: clientData.profileImagePresignedUrl,
    // These fields are required by the User interface but may not be relevant for political clients
    firstName: '',
    lastName: '',
    createdAt: new Date().toISOString(), // Use current date as fallback
  };
}

/**
 * Maps frontend User to backend donor creation/update request body
 */
export function mapUserToDonorRequest(user: Partial<User> & { password?: string }): {
  donorName: string;
  loginUsername: string;
  loginPw: string;
} {
  return {
    // Combine firstName and lastName for donorName
    donorName: user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || '',
    // Use loginUsername directly or fall back to email
    loginUsername: user.loginUsername || user.email || '',
    // Include loginPw if it was provided (for creation)
    loginPw: user.password || '',
  };
}

/**
 * Maps frontend User to backend political client creation/update request body
 */
export function mapUserToPoliticalClientRequest(user: Partial<User> & { password?: string }): {
  politicalClientName: string;
  loginUsername: string;
  loginPw: string;
} {
  return {
    politicalClientName: user.politicalClientName || '',
    loginUsername: user.loginUsername || user.email || '',
    // Include loginPw if it was provided (for creation)
    loginPw: user.password || '',
  };
}
