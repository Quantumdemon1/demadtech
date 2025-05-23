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
  // Handle both test data format and real backend format
  const id = donorData.donorGuid || donorData.id;
  const loginUsername = donorData.loginUsername || donorData.email;
  
  return {
    id: id,
    role: 'donor',
    firstName: donorData.firstName || donorData.donorName?.split(' ')[0] || '',
    lastName: donorData.lastName || donorData.donorName?.split(' ').slice(1).join(' ') || '',
    loginUsername: loginUsername,
    email: loginUsername, // Backend uses loginUsername as email
    accountBalance: donorData.accountBalance || '0.00',
    profileImageUrl: donorData.profileImageUrl || donorData.profileImagePresignedUrl,
    profileImagePresignedUrl: donorData.profileImagePresignedUrl,
    // Frontend-only fields (not in backend)
    phone: donorData.phone || '',
    occupation: donorData.occupation || '',
    address: donorData.address || '',
    city: donorData.city || '',
    state: donorData.state || '',
    zip: donorData.zip || '',
    createdAt: donorData.createdAt || new Date().toISOString(),
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
 * Enhanced to handle richer campaign data from backend
 */
export function mapBackendAdCampaignToCampaign(adCampaignData: any, initiative?: any, userId?: string): Campaign {
  // Create a contest object from initiative data if available
  const contestDetails: Contest = {
    id: adCampaignData.initiativeGuid,
    state: initiative?.targets?.location?.[0] || adCampaignData.initiativeDetails?.targets?.location?.[0] || 'N/A',
    district: initiative?.targets?.location?.[1] || adCampaignData.initiativeDetails?.targets?.location?.[1] || 'N/A',
    democratFirstName: adCampaignData.initiativeDetails?.democratFirstName || 'Candidate', 
    democratLastName: adCampaignData.initiativeDetails?.democratLastName || 'Name',
    republicanFirstName: adCampaignData.initiativeDetails?.republicanFirstName || 'Opponent',
    republicanLastName: adCampaignData.initiativeDetails?.republicanLastName || 'Name',
    electionDate: adCampaignData.initiativeDetails?.electionDate || new Date().toISOString().split('T')[0],
  };
  
  // Get description from seedAnswers if available or use description field
  let contentText = adCampaignData.description || '';
  if (!contentText && adCampaignData.seedAnswers && adCampaignData.seedAnswers.length > 0) {
    // Combine seed answers if no description is provided
    contentText = adCampaignData.seedAnswers.map((sa: any) => 
      `${sa.question}: ${sa.answer}`
    ).join('\n\n');
  }
  
  // Use the directly provided metrics or default to zeros
  const metrics = adCampaignData.metrics || {
    impressions: 0,
    clicks: 0,
    shares: 0,
  };
  
  return {
    id: adCampaignData.adCampaignGuid,
    name: adCampaignData.name,
    userId: userId || adCampaignData.donorGuid || '',
    contestId: adCampaignData.initiativeGuid,
    contest: contestDetails,
    contentType: adCampaignData.contentType || 'formal', // Use provided contentType or default
    contentText,
    contentImage: adCampaignData.contentImageS3Url || adCampaignData.contentImage || '',
    startDate: adCampaignData.startDate || new Date().toISOString().split('T')[0],
    endDate: adCampaignData.endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    adSpend: adCampaignData.adSpend || 500,
    donation: adCampaignData.donation,
    status: (adCampaignData.status as Campaign['status']) || 'pending',
    metrics: metrics,
    createdAt: adCampaignData.createdAt || new Date().toISOString(),
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
  contentType?: 'funny' | 'personal' | 'formal';
  startDate?: string;
  endDate?: string;
  adSpend?: number;
} {
  return {
    name: campaign.name || '',
    initiativeGuid: campaign.contestId || '',
    description: campaign.contentText || '',
    seedAnswers,
    contentType: campaign.contentType,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    adSpend: campaign.adSpend,
  };
}

/**
 * Maps admin data from the backend to the frontend User type
 * @param adminData - The admin data from the backend API
 * @returns User object with admin role
 */
export const mapAdminToUser = (adminData: any): User => {
  return {
    id: adminData.adminGuid,
    loginUsername: adminData.loginUsername,
    firstName: adminData.name?.split(' ')[0] || '',
    lastName: adminData.name?.split(' ').slice(1).join(' ') || '',
    role: 'admin',
    createdAt: adminData.createdAt || new Date().toISOString(),
  };
};
