import { useState, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const GET_UPLOAD_SIGNATURE = gql`
  query GetUploadSignature($folder: String) {
    getUploadSignature(folder: $folder) {
      signature
      timestamp
      folder
      cloudName
      apiKey
    }
  }
`;

interface FileUploadProps {
    onUploadComplete: (url: string, fileType: string) => void;
    folder?: string;
    accept?: string;
    maxSizeMB?: number;
    className?: string;
    label?: string;
}

export function FileUpload({
    onUploadComplete,
    folder = "codemande-academy",
    accept = "image/*,application/pdf",
    maxSizeMB = 10,
    className,
    label = "Upload File"
}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { refetch: getSignature } = useQuery(GET_UPLOAD_SIGNATURE, {
        variables: { folder },
        skip: true,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (selectedFile: File) => {
        setError(null);

        // Validate size
        if (selectedFile.size > maxSizeMB * 1024 * 1024) {
            setError(`File size exceeds ${maxSizeMB}MB limit`);
            return;
        }

        setFile(selectedFile);

        // Create preview for images
        if (selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            validateAndSetFile(droppedFile);
        }
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            // 1. Get Signature from Backend
            const { data } = await getSignature();
            if (!data?.getUploadSignature) {
                throw new Error("Failed to get upload signature");
            }

            const { signature, timestamp, cloudName, apiKey } = data.getUploadSignature;

            // 2. Prepare Form Data
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", apiKey);
            formData.append("timestamp", timestamp.toString());
            formData.append("signature", signature);
            formData.append("folder", folder);

            // 3. Upload to Cloudinary
            const xhr = new XMLHttpRequest();
            const resourceType = file.type.startsWith("video/") ? "video" : "image"; // 'image' also handles pdfs for some reason in signed uploads mostly, but better auto
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${file.type.startsWith("video/") ? "video" : "image"}/upload`;

            // Note: For raw files (docs not converted), resource_type might need to be 'raw' or 'auto'. 
            // Safe bet for mixed content is 'auto', but signed uploads often require specific types in the URL.
            // Let's rely on 'auto' endpoint if possible, or fallback to image/video logic.
            // Actually standard endpoint is usually /image/upload or /video/upload or /raw/upload

            const endpointType = file.type.startsWith("video/") ? "video" : file.type.includes("pdf") || file.type.includes("document") ? "image" : "auto";

            xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${endpointType}/upload`);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    onUploadComplete(response.secure_url, response.resource_type);
                    toast.success("File uploaded successfully");
                    setFile(null);
                    setPreview(null);
                } else {
                    setError("Upload failed");
                    toast.error("Upload failed");
                }
                setUploading(false);
            };

            xhr.onerror = () => {
                setError("Network error during upload");
                setUploading(false);
                toast.error("Network error");
            };

            xhr.send(formData);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Upload failed");
            setUploading(false);
            toast.error(err.message || "Upload failed");
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        setProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={cn("w-full", className)}>
            {!file ? (
                <div
                    className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{label}</p>
                    <p className="text-xs text-muted-foreground text-center mb-4">
                        Drag & drop or click to browse<br />
                        Max size: {maxSizeMB}MB
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept={accept}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                    }}>
                        Select File
                    </Button>
                </div>
            ) : (
                <div className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
                            ) : (
                                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                    <File className="w-6 h-6 text-muted-foreground" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        {!uploading && (
                            <Button type="button" variant="ghost" size="icon" onClick={clearFile} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-2 rounded mb-3">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {uploading ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Uploading...</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    ) : (
                        <Button type="button" className="w-full bg-accent hover:bg-accent/90" onClick={uploadFile}>
                            Upload Now
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
