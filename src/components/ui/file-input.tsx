
import * as React from "react";
import { Image, UploadIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  onFileChange?: (file: File | null) => void;
  value?: File | null;
  buttonText?: string;
  buttonClassName?: string;
  accept?: string;
  selectedFileName?: string;
  previewUrl?: string;
  showPreview?: boolean;
  onRemove?: () => void;
  previewClassName?: string;
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
      previewUrl,
      showPreview = false,
      onRemove,
      previewClassName,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if none is provided
    const inputId = id || React.useId();
    
    // Create internal preview URL for selected file
    const [localPreviewUrl, setLocalPreviewUrl] = React.useState<string | null>(null);
    
    // Update local preview when a new file is selected
    React.useEffect(() => {
      if (value && value instanceof File) {
        const url = URL.createObjectURL(value);
        setLocalPreviewUrl(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      }
    }, [value]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (onFileChange) onFileChange(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onFileChange) onFileChange(null);
      if (onRemove) onRemove();
      setLocalPreviewUrl(null);
    };
    
    // Determine which preview URL to use (external or local)
    const displayPreviewUrl = previewUrl || localPreviewUrl;
    
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
              {onRemove && (
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
          >
            {displayPreviewUrl ? (
              <Image className="h-4 w-4 mr-2" />
            ) : (
              <UploadIcon className="h-4 w-4 mr-2" />
            )}
            {buttonText}
          </Button>
        )}
        
        {selectedFileName && !showPreview && (
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span className="truncate">Selected: {selectedFileName}</span>
            {onRemove && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-destructive" 
                onClick={handleRemove}
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
