
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import InitiativeSection from './InitiativeSection';
import useAuth from '@/hooks/useAuth';
import { getAllInitiativesAPI } from '@/services/api';
import { mapBackendInitiativeToInitiative } from '@/services/dataMapping';
import { Initiative } from '@/types';

const InitiativesTab: React.FC = () => {
  const { user } = useAuth();
  const [processingInitiativeIds, setProcessingInitiativeIds] = useState<string[]>([]);
  
  const loginUsername = user?.email || user?.loginUsername || '';
  
  // Fetch all initiatives
  const { data: allInitiatives, isLoading } = useQuery({
    queryKey: ['allInitiatives', loginUsername],
    queryFn: async () => {
      try {
        const response = await getAllInitiativesAPI(loginUsername);
        return Array.isArray(response)
          ? response.map(i => mapBackendInitiativeToInitiative(i))
          : [];
      } catch (error) {
        console.error("Error fetching initiatives:", error);
        toast.error("Failed to load initiatives");
        return [];
      }
    },
    enabled: !!loginUsername,
  });
  
  // TODO: In the future, we'll have a separate API call to fetch joined initiatives
  // For now, we're using an empty array as a placeholder
  const joinedInitiatives: Initiative[] = [];
  
  const handleJoinInitiative = (initiative: Initiative) => {
    // Add to processing state
    setProcessingInitiativeIds(prev => [...prev, initiative.id]);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast.success(`Joined initiative: ${initiative.initiativeName}`);
      setProcessingInitiativeIds(prev => prev.filter(id => id !== initiative.id));
      // In the future, this will trigger a refetch of joined initiatives
    }, 1000);
  };
  
  const handleLeaveInitiative = (initiative: Initiative) => {
    // Add to processing state
    setProcessingInitiativeIds(prev => [...prev, initiative.id]);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast.success(`Left initiative: ${initiative.initiativeName}`);
      setProcessingInitiativeIds(prev => prev.filter(id => id !== initiative.id));
      // In the future, this will trigger a refetch of joined initiatives
    }, 1000);
  };
  
  const handleCreateCampaign = (initiative: Initiative) => {
    // Navigate to campaign creation page with initiative data
    window.location.href = `/create-campaign?initiativeId=${initiative.id}`;
  };

  return (
    <div className="space-y-12">
      {/* My Initiatives Section */}
      <InitiativeSection
        title="My Initiatives"
        initiatives={joinedInitiatives}
        loading={isLoading}
        joined={true}
        onLeaveInitiative={handleLeaveInitiative}
        onCreateCampaign={handleCreateCampaign}
        processingInitiativeIds={processingInitiativeIds}
      />
      
      {/* Available Initiatives Section */}
      <InitiativeSection
        title="Available Initiatives"
        initiatives={allInitiatives || []}
        loading={isLoading}
        onJoinInitiative={handleJoinInitiative}
        processingInitiativeIds={processingInitiativeIds}
      />
    </div>
  );
};

export default InitiativesTab;
