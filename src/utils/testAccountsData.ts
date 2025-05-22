
import { User, Campaign, Initiative, Contest } from '@/types';

// Test Initiatives (shared across accounts)
export const testInitiatives: Initiative[] = [
  {
    id: 'init-climate-001',
    initiativeName: 'Climate Action Now',
    initiativeImageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e0?w=400',
    objective: 'Support candidates committed to aggressive climate change action and renewable energy policies',
    status: 'active',
    seedQuestions: [
      'What specific climate policies would you prioritize in your first 100 days?',
      'How would you balance environmental protection with economic growth?',
      'What role should renewable energy play in our energy future?'
    ],
    targets: {
      age: ['18-24', '25-34', '35-44'],
      education: ['College Degree', 'Graduate Degree'],
      location: ['California', 'New York', 'Washington'],
      relationship: ['Single', 'Married']
    },
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-20T14:15:00Z'
  },
  {
    id: 'init-education-002',
    initiativeName: 'Education First Coalition',
    initiativeImageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    objective: 'Advocate for increased education funding, teacher support, and student debt relief',
    status: 'active',
    seedQuestions: [
      'How would you address the teacher shortage crisis?',
      'What is your plan for making college more affordable?',
      'How would you improve K-12 education funding?'
    ],
    targets: {
      age: ['25-34', '35-44', '45-54'],
      education: ['High School', 'College Degree', 'Graduate Degree'],
      location: ['Texas', 'Florida', 'Illinois'],
      gender: ['All']
    },
    createdAt: '2024-02-28T09:00:00Z',
    updatedAt: '2024-03-18T16:45:00Z'
  },
  {
    id: 'init-healthcare-003',
    initiativeName: 'Healthcare for All',
    initiativeImageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    objective: 'Support universal healthcare access and affordable prescription medications',
    status: 'active',
    seedQuestions: [
      'How would you make healthcare more affordable for working families?',
      'What is your position on Medicare expansion?',
      'How would you address prescription drug costs?'
    ],
    targets: {
      age: ['35-44', '45-54', '55+'],
      location: ['Midwest', 'South', 'Rural Areas'],
      relationship: ['Married', 'Divorced']
    },
    createdAt: '2024-01-15T08:20:00Z',
    updatedAt: '2024-03-22T11:30:00Z'
  },
  {
    id: 'init-economy-004',
    initiativeName: 'Economic Justice Alliance',
    initiativeImageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
    objective: 'Promote fair wages, workers\' rights, and economic equality policies',
    status: 'new',
    seedQuestions: [
      'How would you raise the minimum wage while supporting small businesses?',
      'What policies would you support to reduce income inequality?',
      'How would you strengthen workers\' rights and unions?'
    ],
    targets: {
      age: ['25-34', '35-44'],
      education: ['High School', 'Technical Training', 'College Degree'],
      location: ['Industrial Cities', 'Rust Belt'],
      relationship: ['All']
    },
    createdAt: '2024-03-25T12:00:00Z',
    updatedAt: '2024-03-25T12:00:00Z'
  }
];

// Test Contests (for campaign context)
export const testContests: Contest[] = [
  {
    id: 'contest-ca-12',
    state: 'California',
    district: '12',
    electionDate: '2024-11-05',
    democratFirstName: 'Maria',
    democratLastName: 'Rodriguez',
    republicanFirstName: 'John',
    republicanLastName: 'Thompson',
    targetZipCodes: ['94102', '94103', '94110'],
    targetAges: ['25-34', '35-44'],
    socialMediaKeywords: ['climate', 'environment', 'green energy'],
    contentKeywords: ['climate action', 'renewable energy', 'sustainability']
  },
  {
    id: 'contest-tx-08',
    state: 'Texas',
    district: '8',
    electionDate: '2024-11-05',
    democratFirstName: 'David',
    democratLastName: 'Johnson',
    republicanFirstName: 'Sarah',
    republicanLastName: 'Williams',
    targetZipCodes: ['77001', '77002', '77003'],
    targetAges: ['35-44', '45-54'],
    socialMediaKeywords: ['education', 'schools', 'teachers'],
    contentKeywords: ['education funding', 'teacher support', 'student success']
  },
  {
    id: 'contest-ny-15',
    state: 'New York',
    district: '15',
    electionDate: '2024-11-05',
    democratFirstName: 'Jennifer',
    democratLastName: 'Chen',
    republicanFirstName: 'Michael',
    republicanLastName: 'Davis',
    targetZipCodes: ['10001', '10002', '10003'],
    targetAges: ['18-24', '25-34'],
    socialMediaKeywords: ['healthcare', 'medicare', 'affordable care'],
    contentKeywords: ['healthcare access', 'medical costs', 'insurance']
  }
];

// Test Users with realistic data
export const testUsers: User[] = [
  // DONOR ACCOUNT
  {
    id: 'donor-001',
    email: 'sarah.voter@email.com',
    loginUsername: 'sarah.voter@email.com',
    firstName: 'Sarah',
    lastName: 'Voter',
    role: 'donor',
    phone: '(555) 123-4567',
    occupation: 'Software Engineer',
    address: '123 Democracy Lane',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    accountBalance: '150.00',
    createdAt: '2024-01-15T10:30:00Z',
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face'
  },
  // POLITICAL CLIENT ACCOUNT
  {
    id: 'political-001',
    loginUsername: 'progressive-pac',
    politicalClientName: 'Progressive Action Committee',
    role: 'politicalClient',
    email: 'contact@progressivepac.org',
    createdAt: '2024-02-01T09:00:00Z',
    profileImageUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=150&h=150&fit=crop'
  },
  // ADMIN ACCOUNT
  {
    id: 'admin-001',
    email: 'admin@adtech.com',
    loginUsername: 'admin@adtech.com',
    firstName: 'Alex',
    lastName: 'Administrator',
    role: 'admin',
    createdAt: '2024-01-01T12:00:00Z',
    profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
];

// Test login credentials
export const testCredentials = {
  donor: { username: 'sarah.voter@email.com', password: 'demo123' },
  politicalClient: { username: 'progressive-pac', password: 'client123' },
  admin: { username: 'admin@adtech.com', password: 'admin123' }
};

// Test Campaigns for the donor
export const testCampaigns: Campaign[] = [
  {
    id: 'camp-donor-001',
    name: 'Climate Action Support - CA District 12',
    userId: 'donor-001',
    contestId: 'contest-ca-12',
    contest: testContests[0],
    contentType: 'personal',
    contentText: 'As a parent in San Francisco, I\'m deeply concerned about the climate crisis. Maria Rodriguez has a comprehensive plan to transition to renewable energy and create green jobs. We need leaders who will act now on climate change for our children\'s future.',
    contentImage: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e0?w=600&h=400&fit=crop',
    startDate: '2024-04-01',
    endDate: '2024-10-30',
    adSpend: 250,
    donation: 100,
    status: 'active',
    metrics: {
      impressions: 15420,
      clicks: 892,
      shares: 45
    },
    createdAt: '2024-03-20T14:30:00Z'
  },
  {
    id: 'camp-donor-002',
    name: 'Education Funding Initiative',
    userId: 'donor-001',
    contestId: 'contest-tx-08',
    contest: testContests[1],
    contentType: 'formal',
    contentText: 'Texas students deserve better. David Johnson\'s education plan includes increased teacher pay, smaller class sizes, and more resources for our schools. Investment in education is investment in our future.',
    startDate: '2024-03-15',
    endDate: '2024-11-04',
    adSpend: 150,
    donation: 75,
    status: 'pending',
    metrics: {
      impressions: 8230,
      clicks: 456,
      shares: 23
    },
    createdAt: '2024-03-15T11:15:00Z'
  },
  {
    id: 'camp-donor-003',
    name: 'Healthcare Access Campaign',
    userId: 'donor-001',
    contestId: 'contest-ny-15',
    contest: testContests[2],
    contentType: 'funny',
    contentText: 'Healthcare shouldn\'t bankrupt you! 🏥💸 Jennifer Chen gets it - she\'s fighting for affordable healthcare that actually works for working families. Because the only thing that should be expensive about healthcare is the relief when you\'re feeling better! #HealthcareForAll',
    startDate: '2024-05-01',
    endDate: '2024-10-31',
    adSpend: 300,
    donation: 125,
    status: 'draft',
    metrics: {
      impressions: 0,
      clicks: 0,
      shares: 0
    },
    createdAt: '2024-04-25T16:45:00Z'
  }
];

// Admin test data - campaigns pending approval
export const testPendingCampaigns: Campaign[] = [
  {
    id: 'camp-pending-001',
    name: 'Youth Climate Strike Support',
    userId: 'donor-other-001',
    contestId: 'contest-ca-12',
    contest: testContests[0],
    contentType: 'personal',
    contentText: 'I\'m 19 and I\'ve been striking for climate action since I was 15. Maria Rodriguez is the first candidate who actually listens to young voters. She understands that climate change isn\'t a future problem - it\'s happening now.',
    startDate: '2024-04-15',
    endDate: '2024-11-01',
    adSpend: 200,
    status: 'pending',
    createdAt: '2024-04-10T09:20:00Z'
  },
  {
    id: 'camp-pending-002',
    name: 'Teacher Appreciation Campaign',
    userId: 'donor-other-002',
    contestId: 'contest-tx-08',
    contest: testContests[1],
    contentType: 'formal',
    contentText: 'As a retired teacher with 30 years of experience, I know what our schools need. David Johnson\'s plan to raise teacher salaries and reduce class sizes will help attract and retain the best educators for our children.',
    startDate: '2024-04-20',
    endDate: '2024-11-03',
    adSpend: 175,
    status: 'pending',
    createdAt: '2024-04-18T13:45:00Z'
  },
  {
    id: 'camp-pending-003',
    name: 'Small Business Healthcare Relief',
    userId: 'donor-other-003',
    contestId: 'contest-ny-15',
    contest: testContests[2],
    contentType: 'personal',
    contentText: 'I own a small restaurant and healthcare costs are crushing my business. Jennifer Chen\'s healthcare plan would help small businesses like mine provide coverage for our employees without going bankrupt.',
    startDate: '2024-05-01',
    endDate: '2024-10-30',
    adSpend: 225,
    status: 'pending',
    createdAt: '2024-04-22T10:30:00Z'
  }
];

// Political Client test data - initiatives they've created
export const testPoliticalClientInitiatives: Initiative[] = [
  {
    id: 'init-pac-001',
    initiativeName: 'Digital Privacy Rights',
    initiativeImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400',
    objective: 'Protect digital privacy rights and regulate big tech data collection',
    status: 'active',
    seedQuestions: [
      'How would you regulate social media companies to protect user privacy?',
      'What is your position on government surveillance programs?',
      'How would you ensure fair competition in the tech industry?'
    ],
    targets: {
      age: ['18-24', '25-34'],
      education: ['College Degree', 'Graduate Degree'],
      location: ['California', 'New York', 'Washington'],
      relationship: ['All']
    },
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2024-03-10T09:30:00Z'
  },
  {
    id: 'init-pac-002',
    initiativeName: 'Voter Access Protection',
    initiativeImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    objective: 'Ensure voting access and election security for all eligible citizens',
    status: 'new',
    seedQuestions: [
      'How would you expand voting access while maintaining election security?',
      'What is your position on voter ID requirements?',
      'How would you address gerrymandering?'
    ],
    targets: {
      age: ['All'],
      education: ['All'],
      location: ['All States'],
      relationship: ['All']
    },
    createdAt: '2024-03-01T11:15:00Z',
    updatedAt: '2024-03-01T11:15:00Z'
  }
];
