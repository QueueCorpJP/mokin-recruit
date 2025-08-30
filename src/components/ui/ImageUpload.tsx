import React, { useRef } from 'react';
import { useToast } from './toast';

interface ImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, maxImages = 5 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    // ファイルサイズチェック
    for (const file of newFiles) {
      if (file.size > maxSize) {
        showToast('ファイルサイズが5MBを超えています。5MB以下のファイルを選択してください。', 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }
    
    const merged = [...images, ...newFiles].slice(0, maxImages);
    onChange(merged);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated);
  };

  // ✅ 共通のアップロードボタン（デザインは最初のグレー背景＋白文字）
  const UploadBox = () => (
    <div
      className="flex flex-col items-center justify-center rounded cursor-pointer"
      style={{ width: '200px', height: '133px', backgroundColor: '#999' }}
      onClick={() => fileInputRef.current?.click()}
    >
        <div className="flex justify-center items-center mb-2" style={{ height: '24px', aspectRatio: '1 / 1' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
        <path
          d="M13.8462 2.34615C13.8462 1.325 13.0212 0.5 12 0.5C10.9788 0.5 10.1538 1.325 10.1538 2.34615V10.6538H1.84615C0.825 10.6538 0 11.4788 0 12.5C0 13.5212 0.825 14.3462 1.84615 14.3462H10.1538V22.6538C10.1538 23.675 10.9788 24.5 12 24.5C13.0212 24.5 13.8462 23.675 13.8462 22.6538V14.3462H22.1538C23.175 14.3462 24 13.5212 24 12.5C24 11.4788 23.175 10.6538 22.1538 10.6538H13.8462V2.34615Z"
          fill="white"
        />
      </svg>
    </div>
      <span className="text-white text-base font-bold">画像を追加</span>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );

  // ✅ 画像がないとき
  if (images.length === 0) {
    return <UploadBox />;
  }

  // ✅ 画像があるとき
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row flex-wrap gap-4">
        {images.map((file, idx) => {
          const url = URL.createObjectURL(file);
          return (
            <div
              key={idx}
              className="relative border rounded overflow-visible bg-gray-100 flex items-center justify-center"
              style={{ width: '200px', height: '133px' }}
            >
              <img
                src={url}
                alt={`preview-${idx}`}
                className="object-cover w-full h-full rounded"
              />
              <button
                type="button"
                className="flex w-6 h-6 justify-center items-center gap-2.5 aspect-square absolute -right-2 -top-2 rounded-2xl bg-[#0F9058] text-white hover:bg-opacity-80"
                onClick={() => handleRemove(idx)}
                aria-label="画像を削除"
              >
                ×
              </button>
            </div>
          );
        })}
        {images.length < maxImages && <UploadBox />}
      </div>
      <div className="text-xs text-gray-400">最大{maxImages}枚までアップロードできます。</div>
    </div>
  );
};