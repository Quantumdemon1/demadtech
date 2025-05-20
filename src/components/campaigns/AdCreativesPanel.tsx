
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { getAdCreativesAPI, getInitiativeAssetsAPI } from '@/services/api';
import { InitiativeAsset } from '@/types';
import AdCreativeUploader from './AdCreativeUploader';
import { Skeleton } from '@/components/ui/skeleton';

interface AdCreative {
  adCreativeGuid: string;
  name: string;
  caption: string;
  adCreativeUrl: string;
  adCreativePresignedUrl: string;
}

interface AdCreativesPanelProps {
  campaignId: string;
  initiativeId?: string;
}

const AdCreativesPanel: React.FC<AdCreativesPanelProps> = ({ 
  campaignId,
  initiativeId 
}) => {
  const { user } = useAuth();
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [assets, setAssets] = useState<InitiativeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  const fetchData = async () => {
    if (!user?.email || !campaignId) return;
    
    setLoading(true);
    try {
      // Fetch ad creatives for this campaign
      const creativesData = await getAdCreativesAPI(user.email, campaignId);
      setCreatives(Array.isArray(creativesData) ? creativesData : []);
      
      // If we have an initiative ID, fetch its assets too
      if (initiativeId) {
        const assetsData = await getInitiativeAssetsAPI(user.email, initiativeId);
        setAssets(Array.isArray(assetsData) ? assetsData : []);
      }
    } catch (error) {
      console.error("Error fetching ad creatives:", error);
      toast.error("Failed to load ad creatives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, campaignId, initiativeId]);

  const handleCreativeUploaded = () => {
    fetchData();
    setShowUploader(false);
  };

  // Extract display URL (using presigned URL if available)
  const getDisplayUrl = (creative: AdCreative) => {
    return creative.adCreativePresignedUrl || creative.adCreativeUrl;
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ad Creatives</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={fetchData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setShowUploader(!showUploader)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showUploader ? "Cancel" : "Add Creative"}
          </Button>
        </div>
      </div>

      {showUploader && (
        <div className="mb-6">
          <AdCreativeUploader 
            campaignId={campaignId} 
            onSuccess={handleCreativeUploaded} 
          />
        </div>
      )}
      
      <Tabs defaultValue="creatives">
        <TabsList>
          <TabsTrigger value="creatives">
            Campaign Creatives ({creatives.length})
          </TabsTrigger>
          {initiativeId && (
            <TabsTrigger value="assets">
              Initiative Assets ({assets.length})
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="creatives">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-3">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : creatives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creatives.map((creative) => (
                <Card key={creative.adCreativeGuid}>
                  <CardContent className="p-0">
                    <div className="h-48 bg-muted relative overflow-hidden">
                      <img 
                        src={getDisplayUrl(creative)} 
                        alt={creative.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{creative.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {creative.caption || "No caption"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg border-dashed">
              <p className="text-muted-foreground mb-4">No creatives added to this campaign yet</p>
              <Button onClick={() => setShowUploader(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Creative
              </Button>
            </div>
          )}
        </TabsContent>
        
        {initiativeId && (
          <TabsContent value="assets">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-0">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-3">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : assets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset) => (
                  <Card key={asset.assetGuid}>
                    <CardContent className="p-0">
                      <div className="h-48 bg-muted relative overflow-hidden">
                        <img 
                          src={asset.assetPresignedUrl || asset.assetUrl} 
                          alt={asset.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {asset.description || "No description"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg border-dashed">
                <p className="text-muted-foreground">
                  No assets available for this initiative
                </p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdCreativesPanel;
