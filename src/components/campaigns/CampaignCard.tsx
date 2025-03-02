
import React from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
  className?: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, className }) => {
  const getStatusBadgeClass = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const democratFullName = campaign.contest 
    ? `${campaign.contest.democratFirstName} ${campaign.contest.democratLastName}`
    : 'Democratic Candidate';

  return (
    <div className={cn('campaign-card', className)}>
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-bold">{campaign.name}</h3>
        <span
          className={cn(
            'rounded-full px-2 py-1 text-xs font-medium',
            getStatusBadgeClass(campaign.status)
          )}
        >
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </span>
      </div>

      <div className="mb-2 space-y-1">
        <div className="text-sm">
          <span className="font-medium">Democrat Candidate:</span>{' '}
          {democratFullName}
        </div>
        <div className="text-sm">
          <span className="font-medium">Content Type:</span>{' '}
          {campaign.contentType.charAt(0).toUpperCase() + campaign.contentType.slice(1)}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-md border">
        {campaign.contentImage ? (
          <img
            src={campaign.contentImage}
            alt={campaign.name}
            className="h-48 w-full object-cover"
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
            alt="Default Campaign"
            className="h-48 w-full object-cover"
          />
        )}
        <div className="p-3">
          <p className="text-sm line-clamp-4">{campaign.contentText}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="font-medium">Impressions:</p>
          <p>{campaign.metrics?.impressions.toLocaleString() || 0}</p>
        </div>
        <div>
          <p className="font-medium">Clicks:</p>
          <p>{campaign.metrics?.clicks.toLocaleString() || 0}</p>
        </div>
        <div>
          <p className="font-medium">Shares:</p>
          <p>{campaign.metrics?.shares.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Created {formatDate(campaign.createdAt)}
        </span>
        <Link
          to={`/campaigns/${campaign.id}`}
          className="text-sm font-medium text-campaign-orange hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
