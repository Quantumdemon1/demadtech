
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import CampaignDashboard from '@/components/campaigns/CampaignDashboard';
import useAuth from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InitiativesTab from '@/components/initiatives/InitiativesTab';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('campaigns');

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
              <InitiativesTab />
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
