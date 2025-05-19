
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import InitiativeSection from './InitiativeSection';
import { Initiative } from '@/types';
import useAuth from '@/hooks/useAuth';
import { getAllInitiativesAPI, getDonorJoinedInitiativesAPI, linkDonorToInitiativeAPI, unlinkDonorFromInitiativeAPI } from '@/services/api';
import { mapBackendInitiativeToInitiative } from '@/services/dataMapping';

const InitiativesTab: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingAllInitiatives, setLoadingAllInitiatives] = useState<boolean>(true);
  const [loadingJoinedInitiatives, setLoadingJoinedInitiatives] = useState<boolean>(true);
  const [allInitiatives, setAllInitiatives] = useState<Initiative[]>([]);
  const [joinedInitiatives, setJoinedInitiatives] = useState<Initiative[]>([]);
  const [processingInitiativeIds, setProcessingInitiativeIds] = useState<string[]>([]);

  // Fetch all initiatives and joined initiatives
  useEffect(() => {
    if (!user || !user.email) {
      setLoadingAllInitiatives(false);
      setLoadingJoinedInitiatives(false);
      return;
    }

    // Fetch all initiatives
    const fetchAllInitiatives = async () => {
      setLoadingAllInitiatives(true);
      try {
        const response = await getAllInitiativesAPI(user.email);
        const mappedInitiatives = Array.isArray(response)
          ? response.map(i => mapBackendInitiativeToInitiative(i))
          : [];
        setAllInitiatives(mappedInitiatives);
      } catch (error) {
        console.error("Error fetching initiatives:", error);
        toast.error("Failed to load initiatives. Please try again.");
        setAllInitiatives([]);
      } finally {
        setLoadingAllInitiatives(false);
      }
    };

    // Fetch joined initiatives
    const fetchJoinedInitiatives = async () => {
      setLoadingJoinedInitiatives(true);
      try {
        const response = await getDonorJoinedInitiativesAPI(user.email);
        const mappedInitiatives = Array.isArray(response)
          ? response.map(i => mapBackendInitiativeToInitiative(i))
          : [];
        setJoinedInitiatives(mappedInitiatives);
      } catch (error) {
        console.error("Error fetching joined initiatives:", error);
        toast.error("Failed to load your joined initiatives. Please try again.");
        setJoinedInitiatives([]);
      } finally {
        setLoadingJoinedInitiatives(false);
      }
    };

    fetchAllInitiatives();
    fetchJoinedInitiatives();
  }, [user]);

  // Filter allInitiatives to exclude those already joined
  const notJoinedInitiatives = allInitiatives.filter(
    initiative => !joinedInitiatives.some(joined => joined.id === initiative.id)
  );

  const handleJoinInitiative = async (initiative: Initiative) => {
    if (!user || !user.email) {
      toast.error("Please log in to join an initiative");
      return;
    }

    // Add initiative to processingInitiativeIds
    setProcessingInitiativeIds(prev => [...prev, initiative.id]);

    try {
      await linkDonorToInitiativeAPI(user.email, initiative.id);
      
      // Add initiative to joinedInitiatives
      setJoinedInitiatives(prev => [...prev, initiative]);
      
      toast.success(`Successfully joined: ${initiative.initiativeName}`);
    } catch (error) {
      console.error("Error joining initiative:", error);
      toast.error(`Failed to join initiative: ${(error as Error).message}`);
    } finally {
      // Remove initiative from processingInitiativeIds
      setProcessingInitiativeIds(prev => prev.filter(id => id !== initiative.id));
    }
  };

  const handleLeaveInitiative = async (initiative: Initiative) => {
    if (!user || !user.email || !user.id) {
      toast.error("Please log in to leave an initiative");
      return;
    }

    // Add initiative to processingInitiativeIds
    setProcessingInitiativeIds(prev => [...prev, initiative.id]);

    try {
      await unlinkDonorFromInitiativeAPI(user.email, user.id, initiative.id);
      
      // Remove initiative from joinedInitiatives
      setJoinedInitiatives(prev => prev.filter(i => i.id !== initiative.id));
      
      toast.success(`Successfully left: ${initiative.initiativeName}`);
    } catch (error) {
      console.error("Error leaving initiative:", error);
      toast.error(`Failed to leave initiative: ${(error as Error).message}`);
    } finally {
      // Remove initiative from processingInitiativeIds
      setProcessingInitiativeIds(prev => prev.filter(id => id !== initiative.id));
    }
  };

  const handleCreateCampaign = (initiative: Initiative) => {
    // Navigate to create campaign page with initiative pre-selected
    navigate('/create-campaign', { 
      state: { 
        initiativeId: initiative.id,
        initiativeName: initiative.initiativeName,
        seedQuestions: initiative.seedQuestions
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* My Joined Initiatives */}
      <InitiativeSection 
        title="My Joined Initiatives" 
        initiatives={joinedInitiatives}
        loading={loadingJoinedInitiatives}
        joined={true}
        onLeaveInitiative={handleLeaveInitiative}
        onCreateCampaign={handleCreateCampaign}
        processingInitiativeIds={processingInitiativeIds}
      />

      {/* Explore Initiatives */}
      <InitiativeSection 
        title="Explore Initiatives" 
        initiatives={notJoinedInitiatives}
        loading={loadingAllInitiatives}
        onJoinInitiative={handleJoinInitiative}
        processingInitiativeIds={processingInitiativeIds}
      />
    </div>
  );
};

export default InitiativesTab;
