
import React from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { CampaignMetrics as CampaignMetricsType } from '@/types';
import { cn } from '@/lib/utils';

interface CampaignMetricsProps {
  metrics: CampaignMetricsType;
  className?: string;
  title?: string;
  showViewAllLink?: boolean;
}

const CampaignMetrics: React.FC<CampaignMetricsProps> = ({
  metrics,
  className,
  title = 'Campaign Metrics',
  showViewAllLink = false,
}) => {
  // Calculate CTR (Click-Through Rate) as percentage
  const ctr = metrics.impressions > 0 
    ? ((metrics.clicks / metrics.impressions) * 100).toFixed(2) 
    : '0.00';

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {showViewAllLink && (
          <a href="#" className="text-sm text-campaign-orange hover:underline">
            View All Metrics
          </a>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          type="impressions"
          value={`${Math.floor(metrics.impressions / 1000)}K+`}
          label="Impressions"
        />
        <MetricCard
          type="clicks"
          value={`${Math.floor(metrics.clicks / 1000)}K+`}
          label="Clicks"
        />
        <MetricCard
          type="shares"
          value={`${metrics.shares}+`}
          label="Shares"
        />
        <MetricCard
          type="ctr"
          value={`${ctr}%`}
          label="CTR"
        />
      </div>
    </div>
  );
};

export default CampaignMetrics;
