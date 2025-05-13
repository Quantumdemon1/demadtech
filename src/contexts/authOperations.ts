
import { User } from "@/types";
import { toast } from "sonner";
import { 
  getRegisteredUsers, 
  updateRegisteredUsers, 
  storeUser 
} from "@/utils/authUtils";

// Login operation
export const loginUser = async (
  emailOrUsername: string, 
  password: string, 
  role?: 'donor' | 'politicalClient' | 'admin'
): Promise<User> => {
  try {
    // Get registered users
    const registeredUsers = getRegisteredUsers();
    
    // Filter by role if provided
    const potentialUsers = role 
      ? registeredUsers.filter((u: any) => u.role === role)
      : registeredUsers;
    
    // Find matching user
    const foundUser = potentialUsers.find((u: any) => {
      // Check both email and loginUsername
      const matchesIdentifier = (u.email === emailOrUsername || u.loginUsername === emailOrUsername);
      return matchesIdentifier && u.password === password;
    });
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }
    
    // Remove password before returning
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Store user in localStorage
    storeUser(userWithoutPassword as User);
    
    toast.success('Logged in successfully');
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Invalid email or password');
    throw error;
  }
};

// Signup operation for regular users (donors)
export const signupUser = async (
  userData: Partial<User>, 
  password: string
): Promise<User> => {
  try {
    // Set default role to donor if not provided
    if (!userData.role) {
      userData.role = 'donor';
    }
    
    // Get registered users
    const registeredUsers = getRegisteredUsers();
    
    // Check if email already exists
    if (userData.email && registeredUsers.some((u: Partial<User>) => u.email === userData.email)) {
      throw new Error('Email already in use');
    }
    
    // Create new user with ID
    const newUser = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      password, // In a real app, this would be hashed
      createdAt: new Date().toISOString()
    };
    
    // Add to registered users
    registeredUsers.push(newUser);
    updateRegisteredUsers(registeredUsers);
    
    // Remove password before returning
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Store user in localStorage
    storeUser(userWithoutPassword as User);
    
    toast.success('Account created successfully');
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Signup error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to create account');
    throw error;
  }
};

// Signup operation for political clients
export const signupPoliticalClient = async (
  userData: Partial<User>, 
  password: string
): Promise<User> => {
  try {
    // Set role to politicalClient
    userData.role = 'politicalClient';
    
    // Get registered users
    const registeredUsers = getRegisteredUsers();
    
    // Check if loginUsername already exists
    if (userData.loginUsername && registeredUsers.some(
      (u: Partial<User>) => u.loginUsername === userData.loginUsername
    )) {
      throw new Error('Username already in use');
    }
    
    // Create new political client with ID
    const newClient = {
      ...userData,
      id: `political-client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      password, // In a real app, this would be hashed
      createdAt: new Date().toISOString()
    };
    
    // Add to registered users
    registeredUsers.push(newClient);
    updateRegisteredUsers(registeredUsers);
    
    // Remove password before returning
    const { password: _, ...clientWithoutPassword } = newClient;
    
    // Store user in localStorage
    storeUser(clientWithoutPassword as User);
    
    toast.success('Political client account created successfully');
    return clientWithoutPassword as User;
  } catch (error) {
    console.error('Political client signup error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to create political client account');
    throw error;
  }
};

// Logout operation
export const logoutUser = (): void => {
  localStorage.removeItem('user');
  toast.success('Logged out successfully');
};
