import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import CampaignDashboard from '@/components/campaigns/CampaignDashboard';
import useAuth from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InitiativesTab from '@/components/initiatives/InitiativesTab';
import { Initiative } from '@/types';
import { Button } from '@/components/ui/button';
import { Building, Plus } from 'lucide-react';
import MetricCard from '@/components/ui/MetricCard';
import InitiativeSection from '@/components/initiatives/InitiativeSection';
import { getTestDataForRole } from '@/utils/authUtils';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('campaigns');
  const navigate = useNavigate();
  const [loadingInitiatives, setLoadingInitiatives] = useState<boolean>(false);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [joinedInitiatives, setJoinedInitiatives] = useState<Initiative[]>([]);

  // Redirect users based on their role - but only once on initial load
  React.useEffect(() => {
    if (user) {
      if (user.role === 'politicalClient') {
        navigate('/political-client/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
      // Donors stay on this page
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadTestData = async () => {
      setLoadingInitiatives(true);
      
      try {
        // Get test data based on user role
        const testData = getTestDataForRole(user.role, user.id);
        
        if (user.role === 'donor') {
          // Load initiatives for donor
          setInitiatives(testData.availableInitiatives || []);
          setJoinedInitiatives(testData.initiatives?.slice(0, 2) || []); // Simulate joined initiatives
        } else if (user.role === 'politicalClient') {
          // Load created initiatives for political client
          setInitiatives(testData.createdInitiatives || []);
        }
        
        // Simulate API delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (error) {
        console.error('Error loading test data:', error);
        setInitiatives([]);
        setJoinedInitiatives([]);
      } finally {
        setLoadingInitiatives(false);
      }
    };

    loadTestData();
  }, [user]);

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
