'use client';

import React from 'react';

interface AdminTableRowProps {
  columns: {
    content: React.ReactNode;
    width?: string;
    className?: string;
  }[];
  actions?: React.ReactNode[];
  onClick?: () => void;
}

export const AdminTableRow: React.FC<AdminTableRowProps> = ({
  columns,
  actions,
  onClick
}) => {

  return (
    <div 
      className={`flex items-center px-5 py-4 border-b border-[#E5E5E5] hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Data Columns */}
      {columns.map((column, index) => (
        <div 
          key={index} 
          className={`${column.width || 'flex-1'} px-3 ${column.className || ''}`}
        >
          {typeof column.content === 'string' ? (
            <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
              {column.content}
            </p>
          ) : (
            column.content
          )}
        </div>
      ))}

      {/* Actions Column */}
      {actions && actions.length > 0 && (
        <div className="w-[200px] flex-shrink-0 flex items-center justify-end gap-3">
          {actions.map((action, index) => (
            <div
              key={index}
              onClick={(e) => e.stopPropagation()}
            >
              {action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};