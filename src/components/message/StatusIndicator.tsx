import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusIndicatorProps {
  isUnread?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusIndicator({ 
  isUnread = false, 
  size = 'md',
  className 
}: StatusIndicatorProps) {
  if (!isUnread) return null;

  return (
    <div
      className={cn(
        'rounded-full bg-[#FF5B5B] shrink-0',
        size === 'sm' && 'size-3',
        size === 'md' && 'size-4',
        className
      )}
      aria-label="未読メッセージ"
      role="img"
    />
  );
} 