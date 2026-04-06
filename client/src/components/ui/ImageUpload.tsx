import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  onError?: (error: string) => void;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  className?: string;
  multiple?: boolean;
}

export function ImageUpload({
  onImageUploaded,
  onError,
  maxSizeBytes = 10 * 1024 * 1024, // Increased to 10MB default
  allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  className = "",
  multiple = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `File type not supported. Allowed types: ${allowedTypes.join(", ")}`;
    }

    // Check file size
    if (file.size > maxSizeBytes) {
      const maxSizeMB = maxSizeBytes / (1024 * 1024);
      return `File size too large. Maximum size: ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      onError?.(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file using base64
    setIsUploading(true);
    try {
      // Convert file to base64
      const base64Reader = new FileReader();
      
      base64Reader.onload = async () => {
        try {
          const base64Data = base64Reader.result as string;
          
          const response = await fetch("/api/admin/upload-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageData: base64Data,
              filename: file.name,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Upload failed");
          }

          const data = await response.json();
          onImageUploaded(data.imageUrl);
        } catch (error: any) {
          const errorMessage = error.message || "Upload failed";
          setUploadError(errorMessage);
          onError?.(errorMessage);
          setPreviewUrl(null);
        } finally {
          setIsUploading(false);
        }
      };
      
      base64Reader.onerror = () => {
        const errorMessage = "Failed to read file";
        setUploadError(errorMessage);
        onError?.(errorMessage);
        setPreviewUrl(null);
        setIsUploading(false);
      };
      
      base64Reader.readAsDataURL(file);
    } catch (error: any) {
      const errorMessage = error.message || "Upload failed";
      setUploadError(errorMessage);
      onError?.(errorMessage);
      setPreviewUrl(null);
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        multiple={multiple}
      />

      {!previewUrl ? (
        <Card className="bg-[#1A1A1A] border-[#DCD7CE]/20 border-dashed">
          <div className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-[#DCD7CE]/10 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-[#DCD7CE]" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-[#FAF9F6] font-medium">Upload Product Image</h3>
                <p className="text-[#DCD7CE] text-sm">
                  Drag and drop or click to select
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-[#DCD7CE]">
                  <Badge variant="outline" className="border-[#DCD7CE]/20 text-[#DCD7CE]">
                    Max: {formatFileSize(maxSizeBytes)}
                  </Badge>
                  <Badge variant="outline" className="border-[#DCD7CE]/20 text-[#DCD7CE]">
                    JPG, PNG, WebP
                  </Badge>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-[#DCD7CE] hover:bg-[#ACA69A] text-black"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Select Image
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-[#1A1A1A] border-[#DCD7CE]/20">
          <div className="p-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 h-auto"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[#FAF9F6] text-sm font-medium">
                Image Preview
              </span>
              {isUploading && (
                <Badge className="bg-blue-900/30 text-blue-300 border-blue-500/30">
                  Uploading...
                </Badge>
              )}
            </div>
          </div>
        </Card>
      )}

      {uploadError && (
        <Card className="bg-red-900/20 border-red-500/30">
          <div className="p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-300 font-medium">Upload Error</h4>
              <p className="text-red-400 text-sm mt-1">{uploadError}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}