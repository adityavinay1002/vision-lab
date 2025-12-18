import { Upload } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ImageUploadProps {
  onImageUpload: (image: HTMLImageElement) => void;
  disabled: boolean;
}

export function ImageUpload({ onImageUpload, disabled }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [blink, setBlink] = useState(false);

  // Blinking effect when dragging
  useEffect(() => {
    if (dragActive) {
      const interval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setBlink(false);
    }
  }, [dragActive]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => onImageUpload(img);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className={`flex flex-col items-center gap-4 p-6 border-2 rounded-lg transition-colors ${
        dragActive ? 'border-blue-600 bg-blue-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600'
      } ${blink ? 'animate-pulse' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragOver={handleDragOver}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <label
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          disabled
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
        }`}
      >
        <Upload size={20} />
        <span>Upload Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </label>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Or drag and drop your image here</p>
    </div>
  );
}
