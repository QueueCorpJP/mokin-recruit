'use client';

import React from 'react';

interface SelectableTagProps {
  id: string | number;
  name: string;
  onRemove: (id: string | number) => void;
}

export const SelectableTag: React.FC<SelectableTagProps> = ({ id, name, onRemove }) => {
  return (
    <div
      className="inline-flex bg-[#d2f1da] gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
      onClick={() => onRemove(id)}
    >
      <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
        {name}
      </span>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
        <path
          d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
          fill="#0F9058"
        />
      </svg>
    </div>
  );
};