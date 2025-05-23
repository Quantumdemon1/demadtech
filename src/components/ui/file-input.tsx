
import * as React from "react";
import { Image, UploadIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/useFileUpload";

interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  onFileChange?: (file: File | null, base64Data?: string) => void;
  value?: File | null;
  buttonText?: string;
  buttonClassName?: string;
  accept?: string;
  selectedFileName?: string;
  previewUrl?: string;
  showPreview?: boolean;
  onRemove?: () => void;
  previewClassName?: string;
  maxSizeMB?: number;
}

/**
 * Enhanced FileInput component for selecting files with optional preview
 */
const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      id,
      className,
      buttonText = "Select File",
      buttonClassName,
      onFileChange,
      selectedFileName,
      value,
      accept,
      previewUrl: externalPreviewUrl,
      showPreview = false,
      onRemove,
      previewClassName,
      maxSizeMB = 5,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if none is provided
    const inputId = id || React.useId();
    
    // Convert accept string to array for validation
    const acceptedTypes = accept?.split(',').map(type => type.trim()) || [];
    
    // Use our custom hook for file handling
    const {
      previewUrl: hookPreviewUrl,
      file: hookFile,
      isLoading,
      handleFileChange: internalHandleFileChange,
      resetFile
    } = useFileUpload({
      maxSizeMB,
      acceptedFileTypes: acceptedTypes.length > 0 ? acceptedTypes : undefined,
      onSuccess: (base64Data, file) => {
        if (onFileChange) onFileChange(file, base64Data);
      }
    });
    
    // Use controlled value if provided, otherwise use hook's internal state
    const displayFile = value || hookFile;
    
    // Use external preview URL if provided, otherwise use hook's internal preview
    const displayPreviewUrl = externalPreviewUrl || hookPreviewUrl;
    
    // Handle file change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      internalHandleFileChange(e);
    };

    // Handle file removal
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      resetFile();
      if (onFileChange) onFileChange(null);
      if (onRemove) onRemove();
    };
    
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <input
          type="file"
          id={inputId}
          ref={ref}
          onChange={handleChange}
          className="hidden"
          accept={accept}
          {...props}
        />
        
        {showPreview && displayPreviewUrl ? (
          <div className="relative">
            <div className={cn("relative rounded-md overflow-hidden border bg-muted", previewClassName)}>
              <img 
                src={displayPreviewUrl} 
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {(onRemove || onFileChange) && (
                <Button 
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(inputId)?.click()}
            className={cn("flex items-center gap-2", buttonClassName)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : displayPreviewUrl ? (
              <Image className="h-4 w-4 mr-2" />
            ) : (
              <UploadIcon className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Uploading..." : buttonText}
          </Button>
        )}
        
        {(selectedFileName || displayFile?.name) && !showPreview && (
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span className="truncate">Selected: {selectedFileName || displayFile?.name}</span>
            {(onRemove || onFileChange) && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-destructive" 
                onClick={handleRemove}
                disabled={isLoading}
              >
                Remove
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };
