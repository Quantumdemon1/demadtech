
import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, MousePointer, Share2 } from 'lucide-react';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  type: 'impressions' | 'clicks' | 'shares' | string;
  highlighted?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  type,
  highlighted = false,
  className,
  ...props
}) => {
  // Determine icon based on type
  const getIcon = () => {
    switch (type) {
      case 'impressions':
        return <Eye className="h-8 w-8 text-red-500" />;
      case 'clicks':
        return <MousePointer className="h-8 w-8 text-campaign-orange" />;
      case 'shares':
        return <Share2 className="h-8 w-8 text-blue-500" />;
      default:
        return <MousePointer className="h-8 w-8 text-campaign-orange" />;
    }
  };

  return (
    <div
      className={cn(
        'metric-card group',
        highlighted && 'ring-2 ring-campaign-orange/50',
        className
      )}
      {...props}
    >
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-background/50 p-2 transition-transform duration-300 group-hover:scale-110">
        {getIcon()}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

export default MetricCard;
