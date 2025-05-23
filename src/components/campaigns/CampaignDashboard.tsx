
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Campaign, CampaignMetrics as CampaignMetricsType, Initiative } from '@/types';
import CampaignCard from './CampaignCard';
import CampaignMetrics from './CampaignMetrics';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useAuthCheck from '@/hooks/useAuthCheck';
import { getDonorAdCampaignsAPI, getAllInitiativesAPI } from '@/services/api';
import { mapBackendAdCampaignToCampaign, mapBackendInitiativeToInitiative } from '@/services/dataMapping';
import { Plus } from 'lucide-react';
import { getTestDataForRole } from '@/utils/authUtils';

const CampaignDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loginUsername, isAuthenticated, checkAuthStatus } = useAuthCheck();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [totalMetrics, setTotalMetrics] = useState<CampaignMetricsType>({
    impressions: 0,
    clicks: 0,
    shares: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Authentication check
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch both campaigns and initiatives in parallel
        const [campaignsResponse, initiativesResponse] = await Promise.all([
          getDonorAdCampaignsAPI(loginUsername),
          getAllInitiativesAPI(loginUsername)
        ]);

        // Map backend initiatives to frontend format
        const mappedInitiatives = Array.isArray(initiativesResponse)
          ? initiativesResponse.map(i => mapBackendInitiativeToInitiative(i))
          : [];
        setInitiatives(mappedInitiatives);

        // Map backend campaigns to frontend format
        const mappedCampaigns = Array.isArray(campaignsResponse)
          ? campaignsResponse.map(campaign => {
              // Find related initiative if available
              const initiative = mappedInitiatives.find(i => i.id === campaign.initiativeGuid);
              return mapBackendAdCampaignToCampaign(campaign, initiative, user.id);
            })
          : [];
        setCampaigns(mappedCampaigns);

        // Calculate total metrics from the mapped campaigns
        const metrics = mappedCampaigns.reduce(
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
        setTotalMetrics(metrics);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        
        if (error?.status === 401) {
          toast.error("Authentication failed. Please log in again.");
          navigate('/login');
        } else if (error?.name === 'TypeError' && error?.message.includes('Failed to fetch')) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Failed to load campaigns. Please try again.");
        }
        setCampaigns([]);
        setInitiatives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, loginUsername, navigate, isAuthenticated]);

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
          My Campaigns
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
