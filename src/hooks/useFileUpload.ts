
import { useState } from 'react';
import { toast } from 'sonner';

interface UseFileUploadOptions {
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  onSuccess?: (base64Data: string, file: File) => void;
}

interface FileUploadResult {
  previewUrl: string | null;
  file: File | null;
  isLoading: boolean;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetFile: () => void;
}

/**
 * A hook to handle file uploads with preview and validation
 */
export const useFileUpload = (options: UseFileUploadOptions = {}): FileUploadResult => {
  const { 
    maxSizeMB = 5, 
    acceptedFileTypes,
    onSuccess 
  } = options;
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    // Validate file type if specified
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      const fileType = selectedFile.type;
      if (!acceptedFileTypes.includes(fileType)) {
        toast.error(`Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`);
        return;
      }
    }
    
    setIsLoading(true);
    
    // Read file as data URL for preview and base64 data
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      setFile(selectedFile);
      
      // Extract pure base64 data (remove data URL prefix)
      const base64Data = base64String.split(',')[1];
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(base64Data, selectedFile);
      }
      
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      toast.error('Error reading file. Please try again.');
      setIsLoading(false);
    };
    
    reader.readAsDataURL(selectedFile);
  };
  
  const resetFile = () => {
    setFile(null);
    setPreviewUrl(null);
    
    // Revoke object URL to prevent memory leaks
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  };
  
  return {
    file,
    previewUrl,
    isLoading,
    handleFileChange,
    resetFile
  };
};
