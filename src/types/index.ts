export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  occupation?: string;
  role: 'donor' | 'politicalClient' | 'admin';
  // Political Client specific fields
  politicalClientName?: string;
  ein?: string;
  fecNum?: string;
  fundingMethod?: string;
  pacId?: string;
  platform?: string;
  profileImageUrl?: string;
  targets?: any;
  // Keep track of which login method was used
  loginUsername?: string;
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
  login: (email: string, password: string, role?: 'donor' | 'politicalClient' | 'admin') => Promise<void>;
  signup: (userData: Partial<User>, password: string) => Promise<void>;
  politicalClientSignup: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
}
