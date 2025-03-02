
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Campaign, CampaignMetrics as CampaignMetricsType } from '@/types';
import CampaignCard from './CampaignCard';
import CampaignMetrics from './CampaignMetrics';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const CampaignDashboard: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalMetrics, setTotalMetrics] = useState<CampaignMetricsType>({
    impressions: 0,
    clicks: 0,
    shares: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch campaigns from an API
    // For now, we'll just use dummy data
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
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
      },
      {
        id: '2',
        name: 'Environmental Protection Campaign',
        userId: user?.id || '',
        contestId: '456',
        contest: {
          id: '456',
          state: 'New York',
          district: '10',
          electionDate: '2024-11-05',
          democratFirstName: 'Michael',
          democratLastName: 'Johnson',
          republicanFirstName: 'Robert',
          republicanLastName: 'Williams',
        },
        contentType: 'personal',
        contentText: 'As someone who grew up near the coast, I know how important environmental protection is. Michael Johnson will fight for clean water and air.',
        startDate: '2024-09-15',
        endDate: '2024-11-04',
        adSpend: 750,
        status: 'pending',
        metrics: {
          impressions: 3500,
          clicks: 800,
          shares: 150,
        },
        createdAt: '2024-08-20',
      },
      {
        id: '3',
        name: 'Healthcare For All',
        userId: user?.id || '',
        contestId: '789',
        contest: {
          id: '789',
          state: 'Texas',
          district: '5',
          electionDate: '2024-11-05',
          democratFirstName: 'Sarah',
          democratLastName: 'Brown',
          republicanFirstName: 'Thomas',
          republicanLastName: 'Miller',
        },
        contentType: 'funny',
        contentText: 'Healthcare shouldn't be a luxury. Vote for Sarah Brown because she believes everyone deserves access to quality care without going bankrupt.',
        startDate: '2024-10-01',
        endDate: '2024-11-04',
        adSpend: 600,
        status: 'draft',
        metrics: {
          impressions: 1000,
          clicks: 250,
          shares: 50,
        },
        createdAt: '2024-08-25',
      },
    ];

    // Calculate total metrics
    const metrics = mockCampaigns.reduce(
      (acc, campaign) => {
        if (campaign.metrics) {
          acc.impressions += campaign.metrics.impressions || 0;
          acc.clicks += campaign.metrics.clicks || 0;
          acc.shares += campaign.metrics.shares || 0;
        }
        return acc;
      },
      { impressions: 0, clicks: 0, shares: 0 }
    );

    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setTotalMetrics(metrics);
      setLoading(false);
    }, 1000);
  }, [user]);

  if (loading) {
    return (
      <div className="animate-fade-in flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-campaign-orange mx-auto"></div>
          <p className="text-muted-foreground">Loading your campaigns...</p>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="animate-fade-in mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <h3 className="mb-2 text-xl font-semibold">No campaigns yet</h3>
        <p className="mb-6 max-w-md text-muted-foreground">
          You haven't created any campaigns yet. Start your first campaign to
          engage with voters.
        </p>
        <Button asChild className="bg-campaign-orange hover:bg-campaign-orange-dark">
          <Link to="/create-campaign">Create Your First Campaign</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <CampaignMetrics
        metrics={totalMetrics}
        title="My Metrics"
        showViewAllLink={false}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Top Campaigns I Created
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignDashboard;
