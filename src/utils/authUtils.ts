
import { User } from "@/types";
import { toast } from "sonner";

// Demo account data
export const demoAccounts = [
  {
    id: 'demo-user-123',
    email: 'demo@adtech.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'donor',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-admin-456',
    email: 'admin@adtech.com',
    password: 'admin123',
    firstName: 'Demo',
    lastName: 'Admin',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-political-789',
    loginUsername: 'political',
    password: 'client123',
    politicalClientName: 'Demo Political Organization',
    role: 'politicalClient',
    createdAt: new Date().toISOString()
  }
];

// Initialize demo accounts in localStorage
export const initializeDemoAccounts = (): void => {
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  
  // Only add demo accounts if they don't already exist
  let updated = false;
  
  demoAccounts.forEach(demoAccount => {
    const identifier = demoAccount.email || demoAccount.loginUsername;
    if (!registeredUsers.some((u: Partial<User>) => 
      (u.email === identifier || u.loginUsername === identifier)
    )) {
      registeredUsers.push(demoAccount);
      updated = true;
      console.log(`Demo account created: ${identifier}`);
    }
  });
  
  if (updated) {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }
};

// Get stored user from localStorage
export const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Store user in localStorage
export const storeUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
export const removeStoredUser = (): void => {
  localStorage.removeItem('user');
};

// Get registered users from localStorage
export const getRegisteredUsers = (): any[] => {
  return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
};

// Update registered users in localStorage
export const updateRegisteredUsers = (users: any[]): void => {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};
