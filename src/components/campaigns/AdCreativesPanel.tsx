
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Image } from 'lucide-react';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';
import { getAdCreativesAPI, upsertAdCreativeAPI } from '@/services/api';

interface AdCreative {
  adCreativeGuid: string;
  caption: string;
  adCreativeUrl: string;
  adCreativePresignedUrl: string;
  sourceAssetGuid?: string;
  name?: string;
}

interface AdCreativesPanelProps {
  campaignId: string;
  initiativeId?: string;
}

const AdCreativesPanel: React.FC<AdCreativesPanelProps> = ({ campaignId, initiativeId }) => {
  const { user } = useAuth();
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    caption: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAdCreatives = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const fetchedCreatives = await getAdCreativesAPI(user.email, campaignId);
      setCreatives(Array.isArray(fetchedCreatives) ? fetchedCreatives : []);
    } catch (error) {
      console.error('Error fetching ad creatives:', error);
      toast.error('Failed to load ad creatives. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId && user?.email) {
      fetchAdCreatives();
    }
  }, [campaignId, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size exceeds 5MB limit.');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !formData.name || !formData.caption) {
      toast.error('Please fill all fields and select an image.');
      return;
    }

    if (!user?.email) {
      toast.error('User authentication issue. Please log in again.');
      return;
    }

    setSubmitting(true);

    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      // Extract the base64 data part (remove data:image/jpeg;base64, prefix)
      const base64Data = base64Image.split(',')[1];

      await upsertAdCreativeAPI(user.email, {
        adCampaignGuid: campaignId,
        name: formData.name,
        caption: formData.caption,
        adCreativePayload: base64Data,
        // If we had sourceAssetGuid, we could add it here
      });

      toast.success('Ad creative successfully created!');
      setDialogOpen(false);
      resetForm();
      fetchAdCreatives(); // Refresh the list
    } catch (error) {
      console.error('Error creating ad creative:', error);
      toast.error('Failed to create ad creative. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', caption: '' });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="mb-8 rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ad Creatives</h2>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 bg-campaign-orange hover:bg-campaign-orange-dark"
        >
          <Plus className="h-4 w-4" /> Add New Creative
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : creatives.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold">No ad creatives yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new creative</p>
          <div className="mt-6">
            <Button 
              onClick={() => setDialogOpen(true)}
              variant="outline"
            >
              Add Creative
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {creatives.map(creative => (
            <Card key={creative.adCreativeGuid} className="overflow-hidden">
              <div className="h-48 bg-gray-100 relative">
                {creative.adCreativePresignedUrl ? (
                  <img 
                    src={creative.adCreativePresignedUrl} 
                    alt={creative.caption} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{creative.name || 'Untitled Creative'}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{creative.caption}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Creative Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Ad Creative</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Creative Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter a name for your creative"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                name="caption"
                value={formData.caption}
                onChange={handleFormChange}
                placeholder="Write a caption for your creative"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <div className="mt-1 flex items-center">
                <Input
                  id="image"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="sr-only"
                />
                <Label 
                  htmlFor="image" 
                  className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Choose file
                </Label>
                <span className="ml-3 text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
              
              {previewUrl && (
                <div className="mt-3 relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-48 max-w-full object-contain"
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!selectedFile || !formData.name || !formData.caption || submitting}
                className="bg-campaign-orange hover:bg-campaign-orange-dark"
              >
                {submitting ? 'Uploading...' : 'Create Ad Creative'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdCreativesPanel;
