
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import CampaignMetrics from '@/components/campaigns/CampaignMetrics';
import useAuth from '@/hooks/useAuth';
import { Campaign } from '@/types';
import CampaignHeader from '@/components/campaigns/CampaignHeader';
import CampaignDetailsPanel from '@/components/campaigns/CampaignDetailsPanel';
import CampaignContentPanel from '@/components/campaigns/CampaignContentPanel';
import LoadingState from '@/components/campaigns/LoadingState';
import NotFoundState from '@/components/campaigns/NotFoundState';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch the campaign from an API
    // For now, we'll just use dummy data
    if (!id) return;

    const mockCampaign: Campaign = {
      id,
      name: 'Support for Education Reform',
      userId: user?.id || '',
      contestId: '123',
      contest: {
        id: '123',
        state: 'California',
        district: '12',
        electionDate: '2024-11-05',
        democratFirstName: 'Jane',
        democratLastName: 'Smith',
        republicanFirstName: 'John',
        republicanLastName: 'Doe',
      },
      contentType: 'formal',
      contentText: 'Education is the foundation of our democracy. Vote for Jane Smith to ensure our schools get the funding they deserve.',
      startDate: '2024-09-01',
      endDate: '2024-11-04',
      adSpend: 500,
      status: 'active',
      metrics: {
        impressions: 5200,
        clicks: 1200,
        shares: 300,
      },
      createdAt: '2024-08-15',
    };

    setTimeout(() => {
      setCampaign(mockCampaign);
      setLoading(false);
    }, 1000);
  }, [id, user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (!campaign) {
    return <NotFoundState />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container py-8">
        <CampaignHeader campaign={campaign} />
        <CampaignDetailsPanel campaign={campaign} />
        <CampaignMetrics
          metrics={campaign.metrics || { impressions: 0, clicks: 0, shares: 0 }}
          showViewAllLink={true}
        />
        <CampaignContentPanel campaign={campaign} />
      </main>
    </div>
  );
};

export default CampaignDetail;
