
export interface User {
  id: string;  // Maps to backend's 'donorGuid' or 'politicalClientGuid'
  email?: string;  // Maps to backend's 'loginUsername' for authentication
  firstName?: string;  // Combined with lastName to form 'donorName' for backend
  lastName?: string;   // Combined with firstName to form 'donorName' for backend
  loginUsername?: string;  // Direct mapping to backend's 'loginUsername'
  politicalClientName?: string;  // For political client users
  role: 'donor' | 'politicalClient' | 'admin';  // Role is determined at login
  phone?: string;  // Currently not in backend schema
  occupation?: string;  // Currently not in backend schema
  address?: string;  // Currently not in backend schema
  city?: string;  // Currently not in backend schema
  state?: string;  // Currently not in backend schema
  zip?: string;  // Currently not in backend schema
  createdAt: string;
  
  // Backend-specific fields
  accountBalance?: string;  // For donor accounts
  profileImageUrl?: string;  // For user profile images
  profileImagePresignedUrl?: string;  // Temporary URL for image upload/download
}

export interface Contest {
  id: string;
  state: string;
  district: string;
  electionDate: string;
  democratFirstName: string;
  democratLastName: string;
  republicanFirstName: string;
  republicanLastName: string;
  targetZipCodes?: string[];
  targetAges?: string[];
  socialMediaKeywords?: string[];
  contentKeywords?: string[];
}

export interface Campaign {
  id: string;
  name: string;
  userId: string;
  contestId: string;
  contest?: Contest;
  contentType: 'funny' | 'personal' | 'formal';
  contentText: string;
  contentImage?: string;
  startDate: string;
  endDate: string;
  adSpend: number;
  donation?: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  metrics?: CampaignMetrics;
  createdAt: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  shares: number;
  [key: string]: number;
}

export interface QuestionAnswers {
  importantReason: string;
  votingFeeling: string;
  votingDifference: string;
  reachingOut: string;
}

export type ContentGroup = {
  type: 'funny' | 'personal' | 'formal';
  text: string;
  image?: string;
};

export interface Initiative {
  id: string;
  initiativeName: string;
  initiativeImageUrl?: string;
  objective: string;
  seedQuestions?: string[];
  status: 'new' | 'active' | 'complete';
  targets?: {
    age?: string[];
    education?: string[];
    gender?: string[];
    language?: string[];
    location?: string[];
    relationship?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string, role?: 'donor' | 'politicalClient' | 'admin') => Promise<User>;
  signup: (userData: Partial<User>, password: string) => Promise<User>;
  politicalClientSignup: (userData: Partial<User>, password: string) => Promise<User>;
  logout: () => void;
  updateUserProfile: (updatedUser: User) => void;
}
