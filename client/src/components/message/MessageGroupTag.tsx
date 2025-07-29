import React from 'react';
import { cn } from '@/lib/utils';

export interface MessageGroupTagProps {
  children: React.ReactNode;
  className?: string;
}

export function MessageGroupTag({ children, className }: MessageGroupTagProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-[#65bdac] to-[#86c36a]',
        'text-white font-["Noto_Sans_JP"] font-bold text-[14px] tracking-[1.4px]',
        'px-5 py-0 h-8 rounded-lg',
        'flex items-center justify-center',
        'leading-[1.6] text-center',
        'min-w-[160px] w-40 shrink-0',
        'overflow-hidden text-ellipsis whitespace-nowrap',
        className
      )}
    >
      {children}
    </div>
  );
} 