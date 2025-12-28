
"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Fixed typo from "Porps" to "Props"
interface ImageUploaderProps {
  defaultUrl?: string | null;
  onChange?: (url: string | null) => void;
  endpoint: keyof OurFileRouter;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  defaultUrl,
  onChange,
  endpoint,
}) => {
  const [value, setValue] = useState<string | null>(defaultUrl ?? null);
  const [showDropzone, setShowDropzone] = useState<boolean>(!defaultUrl);

  // Sync state if defaultUrl changes externally
  useEffect(() => {
    if (defaultUrl) {
      setValue(defaultUrl);
      setShowDropzone(false);
    }
  }, [defaultUrl]);

  const handleRemove = () => {
    setValue(null);
    setShowDropzone(true);
    onChange?.(null); // Clears the form field in React Hook Form
  };

  if (!showDropzone && value) {
    return (
      <div className="relative">
        <div className="relative w-full min-w-[300px] md:min-w-[600px] min-h-[200px] shadow-lg overflow-hidden rounded-xl">
          <Image src={value} className="object-cover" fill alt="thumbnail" />
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="absolute rounded-full right-2 top-2 bg-white/80 hover:bg-white shadow-md p-2 cursor-pointer z-10 transition-all"
        >
          <X className="w-5 h-5 text-red-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <UploadDropzone
        endpoint={endpoint}
        content={{
          label: "Drop or click to upload",
          allowedContent: "PNG, JPG, JPEG up to 4MB",
        }}
        appearance={{
          button: "rounded-lg bg-primary",
          container: "rounded-xl border-dashed border-2",
        }}
        onUploadError={(error: Error) => {
          toast.error(`Upload failed: ${error.message}`);
        }}
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.url;
          if (url) {
            setValue(url);
            setShowDropzone(false);
            onChange?.(url);
          }
        }}
      />
    </div>
  );
};

export default ImageUploader;
