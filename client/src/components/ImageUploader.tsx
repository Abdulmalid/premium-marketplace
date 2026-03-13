import { useState, useRef } from "react";
import { Upload, X, GripVertical, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ onImagesChange, maxImages = 10 }: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    const newImages: ImageFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const id = `${Date.now()}-${Math.random()}`;
        const newImage: ImageFile = {
          id,
          file,
          preview: event.target?.result as string,
        };

        setImages((prev) => {
          const updated = [...prev, newImage];
          if (updated.length <= maxImages) {
            if (!primaryImageId && updated.length === 1) {
              setPrimaryImageId(id);
            }
            onImagesChange(updated);
            return updated;
          }
          return prev;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    if (primaryImageId === id) {
      setPrimaryImageId(updated.length > 0 ? updated[0].id : null);
    }
    onImagesChange(updated);
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragOverItem = (id: string) => {
    if (!draggedItem || draggedItem === id) return;

    const draggedIndex = images.findIndex((img) => img.id === draggedItem);
    const targetIndex = images.findIndex((img) => img.id === id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newImages = [...images];
    [newImages[draggedIndex], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[draggedIndex],
    ];

    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const setPrimary = (id: string) => {
    setPrimaryImageId(id);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-lg font-medium mb-1">Drag and drop images here</p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to select files (max {maxImages} images, 5MB each)
        </p>
        <Button onClick={handleClick} className="bg-primary text-primary-foreground">
          Select Images
        </Button>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">
            {images.length} of {maxImages} images uploaded
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(image.id)}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragOverItem(image.id)}
                onDragEnd={handleDragEnd}
                className={`relative group cursor-move rounded-lg overflow-hidden border-2 transition-all ${
                  primaryImageId === image.id
                    ? "border-primary ring-2 ring-primary/50"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {/* Image Preview */}
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setPrimary(image.id)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title={primaryImageId === image.id ? "Primary image" : "Set as primary"}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        primaryImageId === image.id
                          ? "fill-amber-500 text-amber-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => removeImage(image.id)}
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Drag Handle */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4 text-white drop-shadow" />
                </div>

                {/* Primary Badge */}
                {primaryImageId === image.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
