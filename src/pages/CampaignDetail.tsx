
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import CampaignMetrics from '@/components/campaigns/CampaignMetrics';
import useAuth from '@/hooks/useAuth';
import { Campaign, Initiative } from '@/types';
import CampaignHeader from '@/components/campaigns/CampaignHeader';
import CampaignDetailsPanel from '@/components/campaigns/CampaignDetailsPanel';
import CampaignContentPanel from '@/components/campaigns/CampaignContentPanel';
import AdCreativesPanel from '@/components/campaigns/AdCreativesPanel';
import LoadingState from '@/components/campaigns/LoadingState';
import NotFoundState from '@/components/campaigns/NotFoundState';
import { toast } from 'sonner';
import { getAdCampaignByIdAPI, getAllInitiativesAPI } from '@/services/api';
import { mapBackendAdCampaignToCampaign, mapBackendInitiativeToInitiative } from '@/services/dataMapping';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user || !user.email) {
      setLoading(false);
      return;
    }

    const fetchCampaignData = async () => {
      setLoading(true);
      try {
        // Fetch both specific campaign and all initiatives in parallel
        const [campaignResponse, initiativesResponse] = await Promise.all([
          getAdCampaignByIdAPI(user.email, id),
          getAllInitiativesAPI(user.email)
        ]);

        // Map backend initiatives to frontend format
        const mappedInitiatives = Array.isArray(initiativesResponse)
          ? initiativesResponse.map(i => mapBackendInitiativeToInitiative(i))
          : [];
        setInitiatives(mappedInitiatives);

        // Process the single campaign response
        if (campaignResponse) {
          // Find related initiative if available
          const initiative = mappedInitiatives.find(i => i.id === campaignResponse.initiativeGuid);
          
          // Map to frontend campaign format
          const mappedCampaign = mapBackendAdCampaignToCampaign(campaignResponse, initiative, user.id);
          setCampaign(mappedCampaign);
        } else {
          setCampaign(null);
          toast.error("Campaign not found");
        }
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        toast.error("Failed to load campaign details. Please try again.");
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
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
          showViewAllLink={false}
          title="Campaign Performance"
        />
        <CampaignContentPanel campaign={campaign} />
        <AdCreativesPanel 
          campaignId={campaign.id} 
          initiativeId={campaign.contestId}
        />
      </main>
    </div>
  );
};

export default CampaignDetail;
