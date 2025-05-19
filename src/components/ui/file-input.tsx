
import * as React from "react";
import { UploadIcon } from "lucide-react";
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
}

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
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if none is provided
    const inputId = id || React.useId();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (onFileChange) onFileChange(file);
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
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(inputId)?.click()}
          className={buttonClassName}
        >
          <UploadIcon className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
        {selectedFileName && (
          <p className="text-xs text-muted-foreground mt-1">
            Selected: {selectedFileName}
          </p>
        )}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };
