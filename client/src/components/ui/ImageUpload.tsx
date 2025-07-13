import React, { useRef } from 'react';

interface ImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, maxImages = 5 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const merged = [...images, ...newFiles].slice(0, maxImages);
    onChange(merged);
  };

  const handleRemove = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row flex-wrap gap-4">
        {images.map((file, idx) => {
          const url = URL.createObjectURL(file);
          return (
            <div key={idx} className="relative w-40 h-28 border rounded overflow-hidden bg-gray-100 flex items-center justify-center">
              <img src={url} alt={`preview-${idx}`} className="object-cover w-full h-full" />
              <button
                type="button"
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-80"
                onClick={() => handleRemove(idx)}
                aria-label="画像を削除"
              >
                ×
              </button>
            </div>
          );
        })}
        {images.length < maxImages && (
          <button
            type="button"
            className="w-40 h-28 border rounded flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-3xl font-bold">＋</span>
            <span className="text-xs mt-1">画像を追加</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
          </button>
        )}
      </div>
      <div className="text-xs text-gray-400">最大{maxImages}枚までアップロードできます。</div>
    </div>
  );
}; 