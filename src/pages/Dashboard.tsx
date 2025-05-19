
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Users, ArrowRight, Compass, LogIn, LogOut, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getAllInitiativesAPI, getDonorJoinedInitiativesAPI, linkDonorToInitiativeAPI, unlinkDonorFromInitiativeAPI } from '@/services/api';
import { mapBackendInitiativeToInitiative } from '@/services/dataMapping';

const InitiativeCard: React.FC<{ 
  initiative: Initiative; 
  joined?: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
  onCreateCampaign?: () => void;
  isProcessing?: boolean;
}> = ({ 
  initiative, 
  joined = false, 
  onJoin, 
  onLeave,
  onCreateCampaign,
  isProcessing = false 
}) => {
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
      <CardFooter className="pt-1 flex flex-col gap-2">
        {!joined ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onJoin}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Join Initiative'}
            <LogIn className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="w-full bg-campaign-orange text-white hover:bg-campaign-orange-dark" 
              onClick={onCreateCampaign}
            >
              Create Campaign
              <Plus className="ml-1 h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-gray-500" 
              onClick={onLeave}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Leave Initiative'}
              <LogOut className="ml-1 h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

const InitiativeSection: React.FC<{ 
  title: string; 
  initiatives: Initiative[]; 
  loading: boolean;
  joined?: boolean;
  onJoinInitiative?: (initiative: Initiative) => void;
  onLeaveInitiative?: (initiative: Initiative) => void;
  onCreateCampaign?: (initiative: Initiative) => void;
  processingInitiativeIds?: string[];
}> = ({ 
  title, 
  initiatives, 
  loading, 
  joined = false,
  onJoinInitiative,
  onLeaveInitiative,
  onCreateCampaign,
  processingInitiativeIds = []
}) => {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {initiatives.length > 3 && (
          <Button variant="ghost" size="sm" asChild>
            <a href="#">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        )}
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
      ) : initiatives.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-500">
            {joined 
              ? 'You haven\'t joined any initiatives yet. Explore initiatives to get started.' 
              : 'No initiatives found. Check back later for new opportunities.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initiatives.map((initiative) => (
            <InitiativeCard 
              key={initiative.id} 
              initiative={initiative}
              joined={joined}
              onJoin={() => onJoinInitiative?.(initiative)}
              onLeave={() => onLeaveInitiative?.(initiative)}
              onCreateCampaign={() => onCreateCampaign?.(initiative)}
              isProcessing={processingInitiativeIds.includes(initiative.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('campaigns');
  const [loadingAllInitiatives, setLoadingAllInitiatives] = useState<boolean>(true);
  const [loadingJoinedInitiatives, setLoadingJoinedInitiatives] = useState<boolean>(true);
  const [allInitiatives, setAllInitiatives] = useState<Initiative[]>([]);
  const [joinedInitiatives, setJoinedInitiatives] = useState<Initiative[]>([]);
  const [processingInitiativeIds, setProcessingInitiativeIds] = useState<string[]>([]);

  // Fetch all initiatives and joined initiatives
  useEffect(() => {
    if (!user || !user.email) {
      setLoadingAllInitiatives(false);
      setLoadingJoinedInitiatives(false);
      return;
    }

    // Fetch all initiatives
    const fetchAllInitiatives = async () => {
      setLoadingAllInitiatives(true);
      try {
        const response = await getAllInitiativesAPI(user.email);
        const mappedInitiatives = Array.isArray(response)
          ? response.map(i => mapBackendInitiativeToInitiative(i))
          : [];
        setAllInitiatives(mappedInitiatives);
      } catch (error) {
        console.error("Error fetching initiatives:", error);
        toast.error("Failed to load initiatives. Please try again.");
        setAllInitiatives([]);
      } finally {
        setLoadingAllInitiatives(false);
      }
    };

    // Fetch joined initiatives
    const fetchJoinedInitiatives = async () => {
      setLoadingJoinedInitiatives(true);
      try {
        const response = await getDonorJoinedInitiativesAPI(user.email);
        const mappedInitiatives = Array.isArray(response)
          ? response.map(i => mapBackendInitiativeToInitiative(i))
          : [];
        setJoinedInitiatives(mappedInitiatives);
      } catch (error) {
        console.error("Error fetching joined initiatives:", error);
        toast.error("Failed to load your joined initiatives. Please try again.");
        setJoinedInitiatives([]);
      } finally {
        setLoadingJoinedInitiatives(false);
      }
    };

    fetchAllInitiatives();
    fetchJoinedInitiatives();
  }, [user]);

  // Filter allInitiatives to exclude those already joined
  const notJoinedInitiatives = allInitiatives.filter(
    initiative => !joinedInitiatives.some(joined => joined.id === initiative.id)
  );

  const handleJoinInitiative = async (initiative: Initiative) => {
    if (!user || !user.email) {
      toast.error("Please log in to join an initiative");
      return;
    }

    // Add initiative to processingInitiativeIds
    setProcessingInitiativeIds(prev => [...prev, initiative.id]);

    try {
      await linkDonorToInitiativeAPI(user.email, initiative.id);
      
      // Add initiative to joinedInitiatives
      setJoinedInitiatives(prev => [...prev, initiative]);
      
      toast.success(`Successfully joined: ${initiative.initiativeName}`);
    } catch (error) {
      console.error("Error joining initiative:", error);
      toast.error(`Failed to join initiative: ${(error as Error).message}`);
    } finally {
      // Remove initiative from processingInitiativeIds
      setProcessingInitiativeIds(prev => prev.filter(id => id !== initiative.id));
    }
  };

  const handleLeaveInitiative = async (initiative: Initiative) => {
    if (!user || !user.email || !user.id) {
      toast.error("Please log in to leave an initiative");
      return;
    }

    // Add initiative to processingInitiativeIds
    setProcessingInitiativeIds(prev => [...prev, initiative.id]);

    try {
      await unlinkDonorFromInitiativeAPI(user.email, user.id, initiative.id);
      
      // Remove initiative from joinedInitiatives
      setJoinedInitiatives(prev => prev.filter(i => i.id !== initiative.id));
      
      toast.success(`Successfully left: ${initiative.initiativeName}`);
    } catch (error) {
      console.error("Error leaving initiative:", error);
      toast.error(`Failed to leave initiative: ${(error as Error).message}`);
    } finally {
      // Remove initiative from processingInitiativeIds
      setProcessingInitiativeIds(prev => prev.filter(id => id !== initiative.id));
    }
  };

  const handleCreateCampaign = (initiative: Initiative) => {
    // Navigate to create campaign page with initiative pre-selected
    navigate('/create-campaign', { 
      state: { 
        initiativeId: initiative.id,
        initiativeName: initiative.initiativeName,
        seedQuestions: initiative.seedQuestions
      }
    });
  };

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
              <InitiativeSection 
                title="My Joined Initiatives" 
                initiatives={joinedInitiatives}
                loading={loadingJoinedInitiatives}
                joined={true}
                onLeaveInitiative={handleLeaveInitiative}
                onCreateCampaign={handleCreateCampaign}
                processingInitiativeIds={processingInitiativeIds}
              />

              {/* Explore Initiatives */}
              <InitiativeSection 
                title="Explore Initiatives" 
                initiatives={notJoinedInitiatives}
                loading={loadingAllInitiatives}
                onJoinInitiative={handleJoinInitiative}
                processingInitiativeIds={processingInitiativeIds}
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
