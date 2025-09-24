'use client';

import React from 'react';

interface AdminTableRowProps {
  columns?: {
    content: React.ReactNode;
    width?: string;
    className?: string;
  }[];
  actions?: React.ReactNode[];
  actionsAlign?: 'left' | 'center' | 'right';
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const AdminTableRow: React.FC<AdminTableRowProps> = ({
  columns,
  actions,
  actionsAlign = 'right',
  onClick,
  children,
  className = '',
}) => {
  // If children are provided, render them as-is (for table row usage)
  if (children) {
    return (
      <tr className={`hover:bg-gray-50 ${className}`} onClick={onClick}>
        {children}
      </tr>
    );
  }

  // If columns are provided, render the flex layout
  if (columns) {
    return (
      <div
        className={`flex items-center px-5 py-4 bg-white hover:bg-gray-50 transition-colors rounded-lg ${onClick ? 'cursor-pointer' : ''}`}
        style={{ boxShadow: '0 2px 20px 0 rgba(0, 0, 0, 0.05)' }}
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
          <div
            className={`w-[200px] flex-shrink-0 flex items-center gap-3 ${
              actionsAlign === 'left'
                ? 'justify-start'
                : actionsAlign === 'center'
                  ? 'justify-center'
                  : 'justify-end'
            }`}
          >
            {actions.map((action, index) => (
              <div key={index} onClick={e => e.stopPropagation()}>
                {action}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback if neither children nor columns are provided
  return null;
};
