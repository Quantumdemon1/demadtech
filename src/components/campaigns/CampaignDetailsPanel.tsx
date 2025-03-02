
import React from 'react';
import { Campaign } from '@/types';

interface CampaignDetailsPanelProps {
  campaign: Campaign;
}

const CampaignDetailsPanel: React.FC<CampaignDetailsPanelProps> = ({ campaign }) => {
  return (
    <div className="mb-8 rounded-lg border p-6">
      <h2 className="mb-4 text-2xl font-bold">Campaign Details</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p>
            <span className="font-medium">Dem. Contestant Name:</span>{' '}
            {campaign.contest?.democratFirstName} {campaign.contest?.democratLastName}
          </p>
          <p>
            <span className="font-medium">Rep. Contestant Name:</span>{' '}
            {campaign.contest?.republicanFirstName} {campaign.contest?.republicanLastName}
          </p>
          <p>
            <span className="font-medium">State:</span> {campaign.contest?.state}
          </p>
          <p>
            <span className="font-medium">District #:</span> {campaign.contest?.district}
          </p>
        </div>
        <div>
          <p>
            <span className="font-medium">Campaign Length:</span>{' '}
            {campaign.startDate} - {campaign.endDate}
          </p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span className="capitalize">{campaign.status}</span>
          </p>
          <p>
            <span className="font-medium">Ad Spend:</span> ${campaign.adSpend}
          </p>
          <p>
            <span className="font-medium">Content Type:</span>{' '}
            <span className="capitalize">{campaign.contentType}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPanel;
