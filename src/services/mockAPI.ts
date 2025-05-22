
import { simulateAPIDelay, getTestDataForRole } from '@/utils/authUtils';
import { testUsers, testCredentials } from '@/utils/testAccountsData';
import { mapDonorToUser, mapPoliticalClientToUser, mapAdminToUser } from './dataMapping';

/**
 * Mock API Service
 * 
 * This service simulates backend API responses using test data.
 * Used for development and testing when the real backend is unavailable.
 */
export class MockAPIService {
  private isTestMode = true; // Set to false when real backend is ready

  async mockRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.isTestMode) {
      throw new Error('Mock API should not be used in production mode');
    }

    // Simulate network delay
    await simulateAPIDelay();

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    console.log(`Mock API handling: ${method} ${endpoint}`);

    // Route mock requests
    if (endpoint.includes('/login/')) {
      return this.handleMockLogin(endpoint, body);
    }
    
    if (endpoint.includes('/donor') && method === 'GET') {
      return this.handleGetDonor(endpoint);
    }
    
    if (endpoint.includes('/donor') && method === 'POST') {
      return this.handleCreateDonor(body);
    }
    
    if (endpoint.includes('/political-client') && method === 'GET') {
      return this.handleGetPoliticalClient(endpoint);
    }
    
    if (endpoint.includes('/political-client') && method === 'POST') {
      return this.handleCreatePoliticalClient(body);
    }
    
    if (endpoint.includes('/initiatives/all')) {
      return this.handleGetAllInitiatives();
    }
    
    if (endpoint.includes('/ad-campaigns')) {
      return this.handleGetAdCampaigns(endpoint);
    }
    
    if (endpoint.includes('/ad-campaign') && method === 'PUT') {
      return this.handleCreateAdCampaign(endpoint, body);
    }
    
    if (endpoint.includes('/admin/ad-campaigns/unapproved')) {
      return this.handleGetUnapprovedCampaigns();
    }

    if (endpoint.includes('/admin/auth')) {
      return this.handleGetAdminDetails(endpoint);
    }

    // Default response for unhandled endpoints
    console.warn(`Mock API: Unhandled endpoint ${method} ${endpoint}`);
    throw new Error(`Mock API endpoint not implemented: ${endpoint}`);
  }

  private handleMockLogin(endpoint: string, body: any) {
    const { loginUsername, loginPw } = body;
    
    // Determine role from endpoint
    let role = 'donor';
    if (endpoint.includes('/login/political-client')) role = 'politicalClient';
    if (endpoint.includes('/login/admin')) role = 'admin';
    
    // Check credentials
    const expectedCreds = testCredentials[role as keyof typeof testCredentials];
    if (loginUsername !== expectedCreds.username || loginPw !== expectedCreds.password) {
      const error = new Error('Invalid credentials');
      (error as any).code = 'INVALID_CREDENTIALS';
      throw error;
    }
    
    // Find and return user
    const user = testUsers.find(u => 
      (u.email === loginUsername || u.loginUsername === loginUsername) && u.role === role
    );
    
    if (!user) {
      const error = new Error('User not found');
      (error as any).code = 'USER_NOT_FOUND';
      throw error;
    }
    
    return {
      user: this.formatUserForAPI(user),
      role: user.role
    };
  }
  
  private handleGetDonor(endpoint: string) {
    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    const loginUsername = urlParams.get('loginUsername');
    
    const user = testUsers.find(u => 
      (u.email === loginUsername || u.loginUsername === loginUsername) && u.role === 'donor'
    );
    
    if (!user) {
      throw new Error('Donor not found');
    }
    
    return this.formatUserForAPI(user);
  }

  private handleGetAdminDetails(endpoint: string) {
    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    const loginUsername = urlParams.get('loginUsername');
    
    const user = testUsers.find(u => 
      (u.email === loginUsername || u.loginUsername === loginUsername) && u.role === 'admin'
    );
    
    if (!user) {
      throw new Error('Admin not found');
    }
    
    return {
      adminGuid: user.id,
      name: `${user.firstName} ${user.lastName}`,
      loginUsername: user.loginUsername
    };
  }
  
  private handleCreateDonor(body: any) {
    // Simulate user creation (just return success)
    const newUser = {
      donorGuid: `donor-${Date.now()}`,
      donorName: body.donorName,
      loginUsername: body.loginUsername,
      accountBalance: '0'
    };
    
    return newUser;
  }
  
  private handleGetPoliticalClient(endpoint: string) {
    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    const loginUsername = urlParams.get('loginUsername');
    
    const user = testUsers.find(u => 
      u.loginUsername === loginUsername && u.role === 'politicalClient'
    );
    
    if (!user) {
      throw new Error('Political client not found');
    }
    
    return {
      politicalClientGuid: user.id,
      politicalClientName: user.politicalClientName,
      loginUsername: user.loginUsername,
      profileImageUrl: user.profileImageUrl
    };
  }
  
  private handleCreatePoliticalClient(body: any) {
    const newClient = {
      politicalClientGuid: `political-${Date.now()}`,
      politicalClientName: body.politicalClientName,
      loginUsername: body.loginUsername
    };
    
    return newClient;
  }
  
  private handleGetAllInitiatives() {
    const testData = getTestDataForRole('donor');
    return testData.initiatives?.map(initiative => ({
      initiativeGuid: initiative.id,
      initiativeName: initiative.initiativeName,
      initiativeImageUrl: initiative.initiativeImageUrl,
      objective: initiative.objective,
      seedQuestions: initiative.seedQuestions,
      status: initiative.status,
      targets: initiative.targets
    })) || [];
  }
  
  private handleGetAdCampaigns(endpoint: string) {
    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    const loginUsername = urlParams.get('loginUsername');
    
    const user = testUsers.find(u => 
      (u.email === loginUsername || u.loginUsername === loginUsername)
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const testData = getTestDataForRole('donor', user.id);
    return testData.campaigns?.map(campaign => ({
      adCampaignGuid: campaign.id,
      name: campaign.name,
      description: campaign.contentText,
      initiativeGuid: campaign.contestId,
      status: campaign.status,
      seedAnswers: [
        { question: 'Why is this important to you?', answer: 'Sample answer 1' },
        { question: 'What change do you want to see?', answer: 'Sample answer 2' }
      ]
    })) || [];
  }
  
  private handleCreateAdCampaign(endpoint: string, body: any) {
    // Simulate campaign creation
    const newCampaign = {
      adCampaignGuid: `camp-${Date.now()}`,
      name: body.name,
      description: body.description,
      initiativeGuid: body.initiativeGuid,
      status: 'pending'
    };
    
    return newCampaign;
  }
  
  private handleGetUnapprovedCampaigns() {
    const testData = getTestDataForRole('admin');
    return testData.pendingCampaigns?.map(campaign => ({
      adCampaignGuid: campaign.id,
      name: campaign.name,
      description: campaign.contentText,
      initiativeGuid: campaign.contestId,
      status: campaign.status,
      donorGuid: campaign.userId
    })) || [];
  }
  
  private formatUserForAPI(user: any) {
    if (user.role === 'donor') {
      return {
        donorGuid: user.id,
        donorName: `${user.firstName} ${user.lastName}`,
        loginUsername: user.loginUsername || user.email,
        accountBalance: user.accountBalance || '0',
        profileImageUrl: user.profileImageUrl
      };
    } else if (user.role === 'politicalClient') {
      return {
        politicalClientGuid: user.id,
        politicalClientName: user.politicalClientName,
        loginUsername: user.loginUsername,
        profileImageUrl: user.profileImageUrl
      };
    } else if (user.role === 'admin') {
      return {
        adminGuid: user.id,
        name: `${user.firstName} ${user.lastName}`,
        loginUsername: user.loginUsername
      };
    }
    return user;
  }
}

export const mockAPI = new MockAPIService();
