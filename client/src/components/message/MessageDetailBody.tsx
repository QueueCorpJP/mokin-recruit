import React from 'react';
import { cn } from '@/lib/utils';

export interface MessageDetailBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const MessageDetailBody: React.FC<MessageDetailBodyProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 p-4 bg-[#EFEFEF]', // gap-6=24px, p-4=16px, 背景色追加
        className
      )}
    >
      {children}
    </div>
  );
};
