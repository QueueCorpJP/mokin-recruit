'use client';

import React from 'react';
import { ActionButton } from './ActionButton';

interface MediaTableRowProps {
  date: string;
  time: string;
  status: '公開中' | '下書き' | string;
  content: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MediaTableRow: React.FC<MediaTableRowProps> = ({
  date,
  time,
  status,
  content,
  onEdit,
  onDelete
}) => {
  const getStatusStyles = () => {
    if (status === '公開中') {
      return 'bg-[#D2F1DA] text-[#0F9058]';
    }
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="flex items-center px-5 py-4 border-b border-[#E5E5E5] hover:bg-gray-50 transition-colors">
      {/* Date/Time Column */}
      <div className="w-[180px] flex-shrink-0">
        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
          {date}
        </div>
        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
          {time}
        </div>
      </div>

      {/* Status Column */}
      <div className="w-[120px] flex-shrink-0 px-3">
        <span className={`inline-block px-3 py-1 rounded-[5px] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] ${getStatusStyles()}`}>
          {status}
        </span>
      </div>

      {/* Content Column */}
      <div className="flex-1 px-3">
        <p className="font-['Noto_Sans_JP'] text-[16px] font-medium text-[#323232] leading-[2] tracking-[1.6px] truncate">
          {content}
        </p>
      </div>

      {/* Actions Column */}
      <div className="w-[200px] flex-shrink-0 flex items-center justify-end gap-3">
        <ActionButton
          text="編集"
          variant="edit"
          onClick={onEdit}
        />
        <ActionButton
          text="削除"
          variant="delete"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};