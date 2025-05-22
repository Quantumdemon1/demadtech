
import React from 'react';
import { Campaign } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, DollarSign } from 'lucide-react';
import CampaignTimeline from '@/components/campaigns/CampaignTimeline';

interface CampaignDetailsPanelProps {
  campaign: Campaign;
}

const CampaignDetailsPanel: React.FC<CampaignDetailsPanelProps> = ({ campaign }) => {
  // Format dates with error handling
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  // Map status to badge variant - fixed to only use supported variants
  const getStatusVariant = (status: Campaign['status']) => {
    switch(status) {
      case 'draft': return 'secondary';
      case 'pending': return 'outline'; // Changed from 'warning' to 'outline'
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'active': return 'default'; // Changed from 'success' to 'default'
      case 'completed': return 'outline';
      default: return 'outline';
    }
  };

  // Safe access to candidate names with fallbacks
  const democratFullName = campaign.contest?.democratFirstName && campaign.contest?.democratLastName
    ? `${campaign.contest.democratFirstName} ${campaign.contest.democratLastName}`
    : campaign.contest?.democratFirstName || 'Democratic Candidate';

  const republicanFullName = campaign.contest?.republicanFirstName && campaign.contest?.republicanLastName
    ? `${campaign.contest.republicanFirstName} ${campaign.contest.republicanLastName}`
    : campaign.contest?.republicanFirstName || 'Republican Candidate';

  return (
    <div className="mb-8 rounded-lg border p-6">
      <h2 className="mb-4 text-2xl font-bold">Campaign Details</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Election Information</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Democrat:</span>{' '}
              {democratFullName}
            </p>
            <p>
              <span className="font-medium">Republican:</span>{' '}
              {republicanFullName}
            </p>
            <p>
              <span className="font-medium">State:</span> {campaign.contest?.state || 'N/A'}
            </p>
            <p>
              <span className="font-medium">District:</span> {campaign.contest?.district || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Election Date:</span>{' '}
              {campaign.contest?.electionDate ? formatDate(campaign.contest.electionDate) : 'N/A'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Campaign Information</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-medium mr-2">Status:</span>
              <Badge variant={getStatusVariant(campaign.status)}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
            </div>
            <p>
              <span className="font-medium">Content Type:</span>{' '}
              <span className="capitalize">{campaign.contentType}</span>
            </p>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="font-medium mr-1">Duration:</span>
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="font-medium mr-1">Ad Spend:</span>
              ${campaign.adSpend.toLocaleString()}
            </div>
            {campaign.donation && (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="font-medium mr-1">Donation:</span>
                ${campaign.donation.toLocaleString()}
              </div>
            )}
            <p>
              <span className="font-medium">Created:</span>{' '}
              {formatDate(campaign.createdAt)}
            </p>
          </div>
        </div>
        
        <div>
          <CampaignTimeline campaign={campaign} />
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPanel;
