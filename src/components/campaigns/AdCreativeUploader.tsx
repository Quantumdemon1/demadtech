
import React, { useState } from 'react';
import { toast } from 'sonner';
import { FileInput } from '@/components/ui/file-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { upsertAdCreativeAPI } from '@/services/api';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [fileData, setFileData] = useState<{file: File | null, base64Data: string | null}>({
    file: null,
    base64Data: null
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (file: File | null, base64Data?: string) => {
    setFileData({
      file,
      base64Data: base64Data || null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Authentication check
    const loginUsername = user?.email || user?.loginUsername || '';
    if (!loginUsername) {
      toast.error("You must be logged in to upload creatives");
      navigate('/login');
      return;
    }
    
    // Check for password cookie
    if (!document.cookie.includes('loginPw=')) {
      toast.error("Authentication expired. Please log in again.");
      navigate('/login');
      return;
    }
    
    if (!fileData.file || !fileData.base64Data) {
      toast.error("Please select an image to upload");
      return;
    }
    
    if (!name.trim()) {
      toast.error("Please provide a name for this creative");
      return;
    }

    setIsUploading(true);
    
    try {
      await upsertAdCreativeAPI(loginUsername, {
        adCampaignGuid: campaignId,
        name,
        caption,
        adCreativePayload: fileData.base64Data,
      });
      
      toast.success("Creative uploaded successfully!");
      setName('');
      setCaption('');
      setFileData({ file: null, base64Data: null });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error uploading creative:", error);
      
      if (error?.status === 401) {
        toast.error("Authentication expired. Please log in again.");
        navigate('/login');
      } else {
        toast.error("Failed to upload creative. Please try again.");
      }
    } finally {
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
              value={fileData.file}
              buttonText="Select Image"
              selectedFileName={fileData.file?.name}
              showPreview={!!fileData.file}
              onRemove={() => setFileData({file: null, base64Data: null})}
              previewClassName="h-40 w-full"
              maxSizeMB={5}
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
            disabled={isUploading || !fileData.file || !name.trim()} 
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
