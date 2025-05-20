
import React, { useState } from 'react';
import { toast } from 'sonner';
import { FileInput } from '@/components/ui/file-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { upsertAdCreativeAPI } from '@/services/api';
import useAuth from '@/hooks/useAuth';

interface AdCreativeUploaderProps {
  campaignId: string;
  onSuccess?: () => void;
  className?: string;
}

const AdCreativeUploader: React.FC<AdCreativeUploaderProps> = ({ 
  campaignId, 
  onSuccess,
  className 
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select an image to upload");
      return;
    }
    
    if (!name.trim()) {
      toast.error("Please provide a name for this creative");
      return;
    }
    
    if (!user?.email) {
      toast.error("You must be logged in to upload creatives");
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        // Remove the data:image/jpeg;base64, part
        const base64Content = base64String.split(',')[1];
        
        await upsertAdCreativeAPI(user.email, {
          adCampaignGuid: campaignId,
          name,
          caption,
          adCreativePayload: base64Content,
        });
        
        toast.success("Creative uploaded successfully!");
        setName('');
        setCaption('');
        setFile(null);
        
        if (onSuccess) {
          onSuccess();
        }
        
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        toast.error("Error reading file");
        setIsUploading(false);
      };
    } catch (error) {
      console.error("Error uploading creative:", error);
      toast.error("Failed to upload creative. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <Card className={className}>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Upload New Creative</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <FileInput
              accept="image/*"
              onFileChange={handleFileChange}
              value={file}
              buttonText="Select Image"
              selectedFileName={file?.name}
              showPreview={!!file}
              onRemove={() => setFile(null)}
              previewClassName="h-40 w-full"
            />
          </div>
          <div>
            <Input
              placeholder="Creative Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2"
            />
            <Textarea
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isUploading || !file || !name.trim()} 
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload Creative"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdCreativeUploader;
