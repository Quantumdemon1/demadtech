
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
export function mapUserToDonorRequest(user: Partial<User>): {
  donorName: string;
  loginUsername: string;
  loginPw?: string;
} {
  return {
    // Combine firstName and lastName for donorName
    donorName: user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || '',
    // Use loginUsername directly or fall back to email
    loginUsername: user.loginUsername || user.email || '',
    // Only include loginPw if it was provided (for creation)
    ...(user.hasOwnProperty('password') && { loginPw: (user as any).password }),
  };
}

/**
 * Maps frontend User to backend political client creation/update request body
 */
export function mapUserToPoliticalClientRequest(user: Partial<User>): {
  politicalClientName: string;
  loginUsername: string;
  loginPw?: string;
} {
  return {
    politicalClientName: user.politicalClientName || '',
    loginUsername: user.loginUsername || user.email || '',
    // Only include loginPw if it was provided (for creation)
    ...(user.hasOwnProperty('password') && { loginPw: (user as any).password }),
  };
}

/**
 * DATA MAPPING NOTES
 * 
 * Key differences between frontend and backend data models:
 * 
 * 1. Identifiers:
 *    - Backend: Uses {entity}Guid (e.g., donorGuid, politicalClientGuid)
 *    - Frontend: Uses id for all entity types
 * 
 * 2. Authentication:
 *    - Backend: Uses loginUsername + loginPw cookie
 *    - Frontend: Uses email + password
 * 
 * 3. Name handling:
 *    - Backend: Single donorName or politicalClientName field
 *    - Frontend: firstName + lastName (for donors) or politicalClientName (for political clients)
 * 
 * 4. Extended profile data:
 *    - Frontend User interface includes phone, address, city, state, zip, occupation
 *    - Current backend schema doesn't explicitly support these in basic operations
 * 
 * 5. Role determination:
 *    - Frontend needs a 'role' field ('donor', 'politicalClient', 'admin')
 *    - Backend doesn't explicitly return a role field; it's determined by which endpoint is used
 */
