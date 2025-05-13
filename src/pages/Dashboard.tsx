import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import CampaignDashboard from '@/components/campaigns/CampaignDashboard';
import useAuth from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Initiative } from '@/types';
import { Users, ArrowRight, Compass } from 'lucide-react';

// Mock initiatives data
const mockInitiatives: Initiative[] = [
  {
    id: '1',
    initiativeName: 'Climate Action Fund',
    initiativeImageUrl: '/placeholder.svg',
    objective: 'Support candidates committed to environmental protection and climate change action',
    status: 'active',
    targets: {
      location: ['California', 'New York', 'Washington'],
      age: ['18-24', '25-34']
    },
    seedQuestions: [
      'What environmental policies do you support?',
      'How would you address climate change at the local level?'
    ],
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    initiativeName: 'Education Reform Coalition',
    initiativeImageUrl: '/placeholder.svg',
    objective: 'Advocate for better education funding and teacher support',
    status: 'active',
    targets: {
      location: ['Texas', 'Florida', 'Georgia'],
      education: ['College Degree', 'Graduate Degree']
    },
    seedQuestions: [
      'How would you improve public school funding?',
      'What\'s your position on teacher salary increases?'
    ],
    createdAt: '2024-04-01'
  },
  {
    id: '3',
    initiativeName: 'Healthcare Access Project',
    initiativeImageUrl: '/placeholder.svg',
    objective: 'Support politicians advocating for affordable healthcare access',
    status: 'new',
    targets: {
      age: ['35-44', '45-54', '55+'],
      location: ['Midwest', 'Rural Areas']
    },
    seedQuestions: [
      'What\'s your plan to make healthcare more affordable?',
      'How would you address the needs of rural healthcare facilities?'
    ],
    createdAt: '2024-04-20'
  },
  {
    id: '4',
    initiativeName: 'Digital Privacy Alliance',
    initiativeImageUrl: '/placeholder.svg',
    objective: 'Support candidates committed to protecting digital rights and privacy',
    status: 'active',
    targets: {
      age: ['18-24', '25-34'],
      education: ['College Degree', 'Technical Training']
    },
    seedQuestions: [
      'What regulations would you propose to protect user data?',
      'How do you balance innovation with privacy concerns?'
    ],
    createdAt: '2024-02-10'
  }
];

// User's joined initiatives (mock data)
const mockJoinedInitiatives: Initiative[] = [
  mockInitiatives[0], 
  mockInitiatives[3]
];

const InitiativeCard: React.FC<{ initiative: Initiative; joined?: boolean }> = ({ initiative, joined = false }) => {
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{initiative.initiativeName}</CardTitle>
          {initiative.status === 'new' && (
            <Badge className="bg-primary-purple text-white">New</Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{initiative.objective}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm">
          {initiative.targets?.location && (
            <div className="flex items-center gap-2 mb-1">
              <Compass className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {initiative.targets.location.slice(0, 2).join(', ')}
                {initiative.targets.location.length > 2 ? '...' : ''}
              </span>
            </div>
          )}
          
          {initiative.targets?.age && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {initiative.targets.age.slice(0, 2).join(', ')}
                {initiative.targets.age.length > 2 ? '...' : ''}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <Button variant="outline" className="w-full" asChild>
          <a href="#">
            {joined ? 'View Details' : 'Join Initiative'}
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

const InitiativeSection: React.FC<{ 
  title: string; 
  initiatives: Initiative[]; 
  loading: boolean;
  joined?: boolean;
}> = ({ title, initiatives, loading, joined = false }) => {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <Button variant="ghost" size="sm" asChild>
          <a href="#">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[200px]">
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initiatives.map((initiative) => (
            <InitiativeCard 
              key={initiative.id} 
              initiative={initiative}
              joined={joined} 
            />
          ))}
        </div>
      )}
    </section>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('campaigns');
  const [loadingInitiatives, setLoadingInitiatives] = useState<boolean>(true);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [joinedInitiatives, setJoinedInitiatives] = useState<Initiative[]>([]);

  useEffect(() => {
    // Simulate loading initiatives data
    const loadData = async () => {
      setLoadingInitiatives(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInitiatives(mockInitiatives);
      setJoinedInitiatives(mockJoinedInitiatives);
      setLoadingInitiatives(false);
    };

    loadData();
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Only show initiatives tabs for donors
  const isDonor = user.role === 'donor';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container py-8">
        {isDonor ? (
          <Tabs defaultValue="campaigns" className="w-full space-y-6" 
            value={activeTab} 
            onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
              <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4">
              <CampaignDashboard />
            </TabsContent>

            <TabsContent value="initiatives" className="space-y-8">
              {/* My Joined Initiatives */}
              {joinedInitiatives.length > 0 && (
                <InitiativeSection 
                  title="My Joined Initiatives" 
                  initiatives={joinedInitiatives}
                  loading={loadingInitiatives}
                  joined={true}
                />
              )}

              {/* Explore Initiatives */}
              <InitiativeSection 
                title="Explore Initiatives" 
                initiatives={initiatives}
                loading={loadingInitiatives}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <CampaignDashboard />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
