import { useCallback, useState } from "react";
import { X, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect?: (file: File | null) => void;
  preview?: string | null;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  sublabel?: string;
  className?: string;
  aspectRatio?: string;
}

export default function UploadZone({
  onFileSelect,
  preview,
  onRemove,
  accept = "image/*",
  maxSize = 10,
  label = "Drag & drop your file here",
  sublabel = "or click to browse",
  className,
  aspectRatio = "aspect-[3/4]",
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Max ${maxSize}MB allowed.`);
      return false;
    }
    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        onFileSelect?.(file);
      }
    },
    [onFileSelect, maxSize]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && validateFile(file)) {
      onFileSelect?.(file);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {preview ? (
        <div className={cn("relative rounded-xl overflow-hidden border border-white/10 group mx-auto max-w-[300px]", aspectRatio)}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={onRemove}
              className="w-11 h-11 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors min-h-[44px] min-w-[44px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs">
            Preview
          </div>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 w-full",
            "min-h-[180px] sm:min-h-[200px]",
            aspectRatio,
            isDragOver
              ? "border-gold bg-gold/10"
              : "border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20 active:bg-white/10"
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3 p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/5 flex items-center justify-center">
              <Image className="w-6 h-6 sm:w-7 sm:h-7 text-white/40" />
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium">{label}</p>
              <p className="text-xs text-white/40 mt-1">{sublabel}</p>
            </div>
            <p className="text-[10px] text-white/30">
              Max {maxSize}MB
            </p>
          </div>
        </label>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
