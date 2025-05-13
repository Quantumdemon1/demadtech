
import React from 'react';
import Header from '@/components/layout/Header';
import CampaignDashboard from '@/components/campaigns/CampaignDashboard';
import useAuth from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container py-8">
        <CampaignDashboard />
      </main>
    </div>
  );
};

export default Dashboard;
