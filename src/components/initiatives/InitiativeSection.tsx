
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { Initiative } from '@/types';
import InitiativeCard from './InitiativeCard';

interface InitiativeSectionProps {
  title: string;
  initiatives: Initiative[];
  loading: boolean;
  joined?: boolean;
  onJoinInitiative?: (initiative: Initiative) => void;
  onLeaveInitiative?: (initiative: Initiative) => void;
  onCreateCampaign?: (initiative: Initiative) => void;
  processingInitiativeIds?: string[];
}

const InitiativeSection: React.FC<InitiativeSectionProps> = ({
  title,
  initiatives,
  loading,
  joined = false,
  onJoinInitiative,
  onLeaveInitiative,
  onCreateCampaign,
  processingInitiativeIds = []
}) => {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {initiatives.length > 3 && (
          <Button variant="ghost" size="sm" asChild>
            <a href="#">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[200px]">
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : initiatives.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-500">
            {joined 
              ? 'You haven\'t joined any initiatives yet. Explore initiatives to get started.' 
              : 'No initiatives found. Check back later for new opportunities.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initiatives.map((initiative) => (
            <InitiativeCard 
              key={initiative.id} 
              initiative={initiative}
              joined={joined}
              onJoin={() => onJoinInitiative?.(initiative)}
              onLeave={() => onLeaveInitiative?.(initiative)}
              onCreateCampaign={() => onCreateCampaign?.(initiative)}
              isProcessing={processingInitiativeIds.includes(initiative.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default InitiativeSection;
