import React, { useState, useRef, DragEvent, ChangeEvent } from "react";

export interface ImageFile {
  url: string;
  name: string;
  size: number;
  type: string;
  file?: File;
}

interface ImageDropzoneProps {
  maxImages?: number;
  initialImages?: ImageFile[];
  onImagesChange?: (images: ImageFile[]) => void;
  maxSizeInMB?: number;
  className?: string;
  icon?: React.ReactNode;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  maxImages = 5,
  initialImages = [],
  onImagesChange,
  maxSizeInMB = 5,
  className = "",
  icon,
}) => {
  const [images, setImages] = useState<ImageFile[]>(initialImages);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFiles = async (files: FileList): Promise<void> => {
    if (images.length + files.length > maxImages) {
      console.error(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((file) => {
        if (!file.type.startsWith("image/")) {
          return false;
        }

        if (file.size > maxSizeInBytes) {
          console.error(
            `File ${file.name} exceeds the maximum size of ${maxSizeInMB}MB`
          );
          return false;
        }

        return true;
      });
      const imagePromises = validFiles.map((file) => {
        return new Promise<ImageFile>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              resolve({
                url: e.target.result as string,
                name: file.name,
                size: file.size,
                type: file.type,
                file: file,
              });
            }
          };
          reader.readAsDataURL(file);
        });
      });
      const newImages = await Promise.all(imagePromises);

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);

      if (onImagesChange) {
        onImagesChange(updatedImages);
      }
    }
  };

  const removeImage = (index: number): void => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    if (onImagesChange) {
      onImagesChange(updatedImages);
    }
  };

  const openFileDialog = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //   const getFiles = (): File[] => {
  //     return images.filter((img) => img.file).map((img) => img.file as File);
  //   };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors h-[220px] ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        } ${
          images.length >= maxImages ? "opacity-50 pointer-events-none" : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="mb-4 flex justify-center">
          {icon || (
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          )}
        </div>
        <p className="text-lg mb-2 font-medium text-gray-700">
          {images.length >= maxImages
            ? `Maximum ${maxImages} images reached`
            : "Drag and drop images here"}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {images.length >= maxImages
            ? "Remove some images to add more"
            : `or click to browse files (${images.length}/${maxImages})`}
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple={images.length < maxImages - 1}
          className="hidden"
          disabled={images.length >= maxImages}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Uploaded Images
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-32 object-cover transition-all group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
