
import { User, Campaign, Contest, Initiative } from "@/types";

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

/**
 * Maps backend initiative response to frontend Initiative object
 */
export function mapBackendInitiativeToInitiative(initiativeData: any): Initiative {
  return {
    id: initiativeData.initiativeGuid,
    initiativeName: initiativeData.initiativeName,
    initiativeImageUrl: initiativeData.initiativeImageUrl || initiativeData.initiativeImagePresignedUrl,
    objective: initiativeData.objective || '',
    seedQuestions: initiativeData.seedQuestions || [],
    status: initiativeData.status || 'active',
    targets: initiativeData.targets || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Maps backend ad campaign response to frontend Campaign object
 * Fills missing data with placeholders
 */
export function mapBackendAdCampaignToCampaign(adCampaignData: any, initiative?: any, userId?: string): Campaign {
  // Create a contest object from initiative data if available
  const contestDetails: Contest = {
    id: adCampaignData.initiativeGuid,
    state: initiative?.targets?.location?.[0] || 'N/A',
    district: initiative?.targets?.location?.[1] || 'N/A',
    democratFirstName: 'Candidate', // Placeholder
    democratLastName: 'Name', // Placeholder
    republicanFirstName: 'Opponent', // Placeholder
    republicanLastName: 'Name', // Placeholder
    electionDate: new Date().toISOString().split('T')[0], // Today as placeholder
  };
  
  // Get description from seedAnswers if available or use description field
  let contentText = adCampaignData.description || '';
  if (!contentText && adCampaignData.seedAnswers && adCampaignData.seedAnswers.length > 0) {
    // Combine seed answers if no description is provided
    contentText = adCampaignData.seedAnswers.map((sa: any) => 
      `${sa.question}: ${sa.answer}`
    ).join('\n\n');
  }
  
  return {
    id: adCampaignData.adCampaignGuid,
    name: adCampaignData.name,
    userId: userId || '',
    contestId: adCampaignData.initiativeGuid,
    contest: contestDetails,
    contentType: 'formal', // Default placeholder
    contentText,
    startDate: new Date().toISOString().split('T')[0], // Today as placeholder
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Month from now as placeholder
    adSpend: 500, // Default placeholder
    status: (adCampaignData.status as Campaign['status']) || 'pending',
    metrics: {
      impressions: 0,
      clicks: 0,
      shares: 0,
    },
    createdAt: new Date().toISOString(),
  };
}

/**
 * Maps frontend Campaign to backend ad campaign creation request
 */
export function mapCampaignToAdCampaignRequest(campaign: Partial<Campaign>, seedAnswers: Array<{question: string, answer: string}>): {
  name: string;
  initiativeGuid: string;
  description: string;
  seedAnswers: Array<{question: string, answer: string}>;
} {
  return {
    name: campaign.name || '',
    initiativeGuid: campaign.contestId || '',
    description: campaign.contentText || '',
    seedAnswers,
  };
}
