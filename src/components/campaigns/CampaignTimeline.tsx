
import React from 'react';
import { Campaign } from '@/types';
import { format, isAfter } from 'date-fns';

interface CampaignTimelineProps {
  campaign: Campaign;
}

const CampaignTimeline: React.FC<CampaignTimelineProps> = ({ campaign }) => {
  // Format dates for display and check status
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  const today = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  const createdDate = new Date(campaign.createdAt);
  
  // Determine if certain phases are complete based on dates and status
  const isApproved = ['approved', 'active', 'completed'].includes(campaign.status);
  const isLaunched = ['active', 'completed'].includes(campaign.status) || 
    (isApproved && isAfter(today, startDate));
  const isCompleted = campaign.status === 'completed' || 
    (isLaunched && isAfter(today, endDate));

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
              {formatDate(campaign.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
            isApproved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
          }`}>
            {isApproved ? '✓' : '⋯'}
          </div>
          <div>
            <p className="font-medium">Content Approved</p>
            <p className="text-sm text-muted-foreground">
              {isApproved 
                ? `Approved ${formatDate(campaign.startDate)}` 
                : 'Pending approval'}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
            isLaunched ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
          }`}>
            {isLaunched ? '✓' : '⋯'}
          </div>
          <div>
            <p className="font-medium">Campaign Launched</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(campaign.startDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
            isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
          }`}>
            {isCompleted ? '✓' : '⋯'}
          </div>
          <div>
            <p className="font-medium">Campaign {isCompleted ? 'Completed' : 'End'}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(campaign.endDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignTimeline;
