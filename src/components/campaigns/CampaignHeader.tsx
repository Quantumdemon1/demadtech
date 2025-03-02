
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Campaign } from '@/types';

interface CampaignHeaderProps {
  campaign: Campaign;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ campaign }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <Link to="/dashboard" className="text-sm text-campaign-orange hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{campaign.name}</h1>
      </div>
      <Button asChild className="bg-campaign-orange hover:bg-campaign-orange-dark">
        <Link to={`/campaigns/${campaign.id}/edit`}>Edit Campaign</Link>
      </Button>
    </div>
  );
};

export default CampaignHeader;
