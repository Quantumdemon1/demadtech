
import React from 'react';
import { Campaign } from '@/types';
import CampaignTimeline from './CampaignTimeline';

interface CampaignContentPanelProps {
  campaign: Campaign;
}

const CampaignContentPanel: React.FC<CampaignContentPanelProps> = ({ campaign }) => {
  return (
    <div className="mt-8 rounded-lg border p-6">
      <h2 className="mb-4 text-2xl font-bold">Campaign Content</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-medium">Content Preview</h3>
          <div className="overflow-hidden rounded-lg border">
            <img
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
              alt="Campaign Preview"
              className="h-64 w-full object-cover"
            />
            <div className="p-4">
              <p>{campaign.contentText}</p>
            </div>
          </div>
        </div>
        <CampaignTimeline campaign={campaign} />
      </div>
    </div>
  );
};

export default CampaignContentPanel;
