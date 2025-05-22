import { User } from "@/types";
import { toast } from "sonner";
import { 
  testUsers, 
  testCredentials, 
  testCampaigns, 
  testInitiatives, 
  testPendingCampaigns, 
  testPoliticalClientInitiatives 
} from "./testAccountsData";

// Initialize comprehensive test data in localStorage
export const initializeTestAccountSystem = (): void => {
  // Store test users
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  
  // Only add test users if they don't already exist
  let updated = false;
  
  testUsers.forEach(testUser => {
    const identifier = testUser.email || testUser.loginUsername;
    if (!existingUsers.some((u: Partial<User>) => 
      (u.email === identifier || u.loginUsername === identifier)
    )) {
      existingUsers.push(testUser);
      updated = true;
      console.log(`Test account created: ${identifier} (${testUser.role})`);
    }
  });
  
  if (updated) {
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
  }
  
  // Store test campaigns (for donor account)
  localStorage.setItem('testCampaigns', JSON.stringify(testCampaigns));
  
  // Store test initiatives
  localStorage.setItem('testInitiatives', JSON.stringify(testInitiatives));
  
  // Store pending campaigns (for admin account)
  localStorage.setItem('testPendingCampaigns', JSON.stringify(testPendingCampaigns));
  
  // Store political client initiatives
  localStorage.setItem('testPoliticalClientInitiatives', JSON.stringify(testPoliticalClientInitiatives));
  
  console.log('Test account system initialized with realistic data');
};

// Get test data for the current user role
export const getTestDataForRole = (role: string, userId?: string) => {
  switch (role) {
    case 'donor':
      return {
        campaigns: testCampaigns.filter(c => c.userId === userId),
        initiatives: testInitiatives,
        availableInitiatives: testInitiatives.filter(i => i.status === 'active')
      };
    
    case 'politicalClient':
      return {
        initiatives: testPoliticalClientInitiatives,
        createdInitiatives: testPoliticalClientInitiatives
      };
    
    case 'admin':
      return {
        pendingCampaigns: testPendingCampaigns,
        allCampaigns: [...testCampaigns, ...testPendingCampaigns],
        allInitiatives: [...testInitiatives, ...testPoliticalClientInitiatives],
        allUsers: testUsers
      };
    
    default:
      return {};
  }
};

// Simulate API response delays for realism
export const simulateAPIDelay = (minMs: number = 300, maxMs: number = 800): Promise<void> => {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Test account credentials helper
export const getTestCredentials = () => testCredentials;

// Display test account information
export const showTestAccountInfo = (): void => {
  const info = `
🧪 TEST ACCOUNTS AVAILABLE:

👤 DONOR ACCOUNT:
   Email: ${testCredentials.donor.username}
   Password: ${testCredentials.donor.password}
   Features: Create campaigns, view initiatives, metrics

🏛️ POLITICAL CLIENT:
   Username: ${testCredentials.politicalClient.username}  
   Password: ${testCredentials.politicalClient.password}
   Features: Create initiatives, manage campaigns

⚙️ ADMIN ACCOUNT:
   Email: ${testCredentials.admin.username}
   Password: ${testCredentials.admin.password}
   Features: Approve campaigns, manage users
  `;
  
  console.log(info);
  toast.info("Check console for test account credentials", {
    duration: 3000,
    description: "Three different account types available for testing"
  });
};

// Legacy functions (keep for compatibility)
export const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const storeUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem('user');
};

export const getRegisteredUsers = (): any[] => {
  return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
};

export const updateRegisteredUsers = (users: any[]): void => {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};
