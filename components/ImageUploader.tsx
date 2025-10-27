
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  currentImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        1. Upload a Photo
      </label>
      <div
        className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-700/50 transition"
        onClick={handleClick}
      >
        <div className="space-y-1 text-center h-48 flex flex-col justify-center items-center">
          {currentImage ? (
            <img src={currentImage} alt="Preview" className="max-h-48 rounded-lg object-contain" />
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-400">
                <p className="pl-1">Click to upload a file</p>
                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} />
              </div>
              <p className="text-xs text-gray-500">PNG or JPG up to 10MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
