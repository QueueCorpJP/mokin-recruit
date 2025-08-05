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
        'bg-gradient-to-r from-[#86c36a] to-[#65bdac]',
        'text-white font-["Noto_Sans_JP"] font-bold text-[14px] tracking-[1.4px]',
        'h-8 rounded-lg w-[160px]',
        'flex items-center justify-center',
        'leading-[1.6] text-center',
        className
      )}
    >
      <span className='block w-[120px] overflow-hidden text-ellipsis whitespace-nowrap'>
        {children}
      </span>
    </div>
  );
}
