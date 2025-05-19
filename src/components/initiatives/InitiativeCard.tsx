
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Compass, Users, LogIn, LogOut, Plus } from 'lucide-react';
import { Initiative } from '@/types';

interface InitiativeCardProps {
  initiative: Initiative;
  joined?: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
  onCreateCampaign?: () => void;
  isProcessing?: boolean;
}

const InitiativeCard: React.FC<InitiativeCardProps> = ({
  initiative,
  joined = false,
  onJoin,
  onLeave,
  onCreateCampaign,
  isProcessing = false
}) => {
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{initiative.initiativeName}</CardTitle>
          {initiative.status === 'new' && (
            <Badge className="bg-primary-purple text-white">New</Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{initiative.objective}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm">
          {initiative.targets?.location && (
            <div className="flex items-center gap-2 mb-1">
              <Compass className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {initiative.targets.location.slice(0, 2).join(', ')}
                {initiative.targets.location.length > 2 ? '...' : ''}
              </span>
            </div>
          )}
          
          {initiative.targets?.age && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {initiative.targets.age.slice(0, 2).join(', ')}
                {initiative.targets.age.length > 2 ? '...' : ''}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1 flex flex-col gap-2">
        {!joined ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onJoin}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Join Initiative'}
            <LogIn className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="w-full bg-campaign-orange text-white hover:bg-campaign-orange-dark" 
              onClick={onCreateCampaign}
            >
              Create Campaign
              <Plus className="ml-1 h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-gray-500" 
              onClick={onLeave}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Leave Initiative'}
              <LogOut className="ml-1 h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default InitiativeCard;
