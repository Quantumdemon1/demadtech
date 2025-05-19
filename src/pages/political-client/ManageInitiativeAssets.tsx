
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import PoliticalClientLayout from '@/components/layout/PoliticalClientLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/useAuth';
import { getInitiativeAssetsAPI, upsertInitiativeAssetAPI, getPoliticalClientInitiativesAPI } from '@/services/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Initiative, InitiativeAsset } from '@/types';

// Form schema
const assetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  assetPayload: z.string().min(1, 'Image is required'),
});

type AssetFormValues = z.infer<typeof assetSchema>;

const ManageInitiativeAssets: React.FC = () => {
  const { id: initiativeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const loginUsername = user?.loginUsername || '';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assetPreview, setAssetPreview] = useState<string | null>(null);

  // Form setup
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: '',
      description: '',
      assetPayload: '',
    },
  });

  // Reset form when dialog is opened/closed
  const resetForm = () => {
    form.reset();
    setAssetPreview(null);
  };

  // Fetch initiative details
  const { data: initiatives } = useQuery({
    queryKey: ['politicalClientInitiatives', loginUsername],
    queryFn: () => getPoliticalClientInitiativesAPI(loginUsername),
    enabled: !!loginUsername && !!initiativeId,
  });

  const currentInitiative = initiatives?.find((init: Initiative) => init.id === initiativeId);

  // Fetch assets
  const {
    data: assets,
    isLoading: isLoadingAssets,
    isError: isAssetsError,
    error: assetsError
  } = useQuery({
    queryKey: ['initiativeAssets', initiativeId, loginUsername],
    queryFn: () => getInitiativeAssetsAPI(loginUsername, initiativeId || ''),
    enabled: !!loginUsername && !!initiativeId
  });

  // Create/update asset mutation
  const createAssetMutation = useMutation({
    mutationFn: (data: {
      assetGuid?: string;
      name: string;
      description: string;
      assetFilename: string;
      assetPayload: string;
      initiativeGuid: string;
    }) => upsertInitiativeAssetAPI(loginUsername, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiativeAssets', initiativeId] });
      toast.success('Asset saved successfully');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to save asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1]; // Remove the data:image/jpeg;base64, part
      form.setValue('assetPayload', base64Data);
      setAssetPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const onSubmit = (values: AssetFormValues) => {
    if (!initiativeId) {
      toast.error('Initiative ID is missing');
      return;
    }

    createAssetMutation.mutate({
      name: values.name,
      description: values.description,
      assetFilename: 'asset.jpg',
      assetPayload: values.assetPayload,
      initiativeGuid: initiativeId,
    });
  };

  if (isAssetsError) {
    toast.error(`Error loading assets: ${assetsError instanceof Error ? assetsError.message : 'Unknown error'}`);
  }

  return (
    <PoliticalClientLayout title="Manage Initiative Assets">
      <div className="space-y-6">
        {currentInitiative && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h2 className="font-medium text-lg">{currentInitiative.initiativeName}</h2>
            <p className="text-muted-foreground">{currentInitiative.objective}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Assets</h3>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>
                  Upload images and other assets for this initiative.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter asset name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter asset description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label htmlFor="assetFile">Upload File</Label>
                      <div className="flex flex-col space-y-2">
                        {assetPreview && (
                          <div className="w-full h-40 bg-muted rounded-md overflow-hidden">
                            <img
                              src={assetPreview}
                              alt="Asset Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <Input
                          id="assetFile"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </div>
                      {form.formState.errors.assetPayload && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.assetPayload.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Max file size: 5MB. Supported formats: JPEG, PNG, GIF.
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createAssetMutation.isPending}>
                      {createAssetMutation.isPending ? 'Uploading...' : 'Upload Asset'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoadingAssets ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : assets && assets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset: InitiativeAsset) => (
              <Card key={asset.assetGuid}>
                <CardHeader>
                  <CardTitle className="text-lg">{asset.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-48 bg-muted rounded-md overflow-hidden">
                    <img
                      src={asset.assetPresignedUrl || asset.assetUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{asset.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(asset.assetGuid);
                      toast.success('Asset ID copied to clipboard');
                    }}
                  >
                    Copy ID
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium mb-2">No Assets Found</h3>
            <p className="text-muted-foreground mb-4">
              Upload assets to enhance your initiative.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add First Asset
            </Button>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => navigate('/political-client/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </PoliticalClientLayout>
  );
};

export default ManageInitiativeAssets;
