
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import CampaignMetrics from '@/components/campaigns/CampaignMetrics';
import useAuth from '@/hooks/useAuth';
import { Campaign, Initiative } from '@/types';
import CampaignHeader from '@/components/campaigns/CampaignHeader';
import CampaignDetailsPanel from '@/components/campaigns/CampaignDetailsPanel';
import CampaignContentPanel from '@/components/campaigns/CampaignContentPanel';
import LoadingState from '@/components/campaigns/LoadingState';
import NotFoundState from '@/components/campaigns/NotFoundState';
import { toast } from 'sonner';
import { getDonorAdCampaignsAPI, getAllInitiativesAPI } from '@/services/api';
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
        // Fetch both campaigns and initiatives in parallel
        const [campaignsResponse, initiativesResponse] = await Promise.all([
          getDonorAdCampaignsAPI(user.email),
          getAllInitiativesAPI(user.email)
        ]);

        // Map backend initiatives to frontend format
        const mappedInitiatives = Array.isArray(initiativesResponse)
          ? initiativesResponse.map(i => mapBackendInitiativeToInitiative(i))
          : [];
        setInitiatives(mappedInitiatives);

        // Find the specific campaign by id
        const backendCampaign = Array.isArray(campaignsResponse)
          ? campaignsResponse.find(c => c.adCampaignGuid === id)
          : null;

        if (backendCampaign) {
          // Find related initiative if available
          const initiative = mappedInitiatives.find(i => i.id === backendCampaign.initiativeGuid);
          
          // Map to frontend campaign format
          const mappedCampaign = mapBackendAdCampaignToCampaign(backendCampaign, initiative, user.id);
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
          showViewAllLink={true}
        />
        <CampaignContentPanel campaign={campaign} />
      </main>
    </div>
  );
};

export default CampaignDetail;
