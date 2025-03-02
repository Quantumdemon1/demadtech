
import React from 'react';
import { Campaign } from '@/types';

interface CampaignTimelineProps {
  campaign: Campaign;
}

const CampaignTimeline: React.FC<CampaignTimelineProps> = ({ campaign }) => {
  return (
    <div>
      <h3 className="mb-2 text-lg font-medium">Campaign Timeline</h3>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800">
            ✓
          </div>
          <div>
            <p className="font-medium">Campaign Created</p>
            <p className="text-sm text-muted-foreground">
              {new Date(campaign.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800">
            ✓
          </div>
          <div>
            <p className="font-medium">Content Approved</p>
            <p className="text-sm text-muted-foreground">
              {new Date(
                new Date(campaign.createdAt).getTime() + 86400000
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800">
            ✓
          </div>
          <div>
            <p className="font-medium">Campaign Launched</p>
            <p className="text-sm text-muted-foreground">
              {new Date(campaign.startDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        {campaign.status !== 'completed' ? (
          <div className="flex items-start space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              ⋯
            </div>
            <div>
              <p className="font-medium">Campaign End</p>
              <p className="text-sm text-muted-foreground">
                {new Date(campaign.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800">
              ✓
            </div>
            <div>
              <p className="font-medium">Campaign Completed</p>
              <p className="text-sm text-muted-foreground">
                {new Date(campaign.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignTimeline;
