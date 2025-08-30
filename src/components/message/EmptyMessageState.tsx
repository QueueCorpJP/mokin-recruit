import React from 'react';
import { cn } from '@/lib/utils';
import { MailIcon } from './MailIcon';

export interface EmptyMessageStateProps {
  className?: string;
}

export function EmptyMessageState({ className }: EmptyMessageStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center h-full',
      'bg-[#f9f9f9] px-8 py-12',
      className
    )}>
      <div className="flex flex-col gap-10 items-center justify-start">
        {/* メールアイコン */}
        <div className="relative shrink-0 size-[120px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 120 120"
          >
            <path
              d="M50.4844 22.5H33.75H25.2656H22.5V24.5625V33.75V43.2188V64.0781L0.046875 47.4609C0.421875 43.2188 2.60156 39.2812 6.07031 36.7266L11.25 32.8828V22.5C11.25 16.2891 16.2891 11.25 22.5 11.25H40.4531L52.1484 2.60156C54.4219 0.914062 57.1641 0 60 0C62.8359 0 65.5781 0.914062 67.8516 2.57812L79.5469 11.25H97.5C103.711 11.25 108.75 16.2891 108.75 22.5V32.8828L113.93 36.7266C117.398 39.2812 119.578 43.2188 119.953 47.4609L97.5 64.0781V43.2188V33.75V24.5625V22.5H94.7344H86.25H69.5156H50.4609H50.4844ZM0 105V56.7422L51 94.5234C53.6016 96.4453 56.7656 97.5 60 97.5C63.2344 97.5 66.3984 96.4688 69 94.5234L120 56.7422V105C120 113.273 113.273 120 105 120H15C6.72656 120 0 113.273 0 105ZM41.25 37.5H78.75C80.8125 37.5 82.5 39.1875 82.5 41.25C82.5 43.3125 80.8125 45 78.75 45H41.25C39.1875 45 37.5 43.3125 37.5 41.25C37.5 39.1875 39.1875 37.5 41.25 37.5ZM41.25 52.5H78.75C80.8125 52.5 82.5 54.1875 82.5 56.25C82.5 58.3125 80.8125 60 78.75 60H41.25C39.1875 60 37.5 58.3125 37.5 56.25C37.5 54.1875 39.1875 52.5 41.25 52.5Z"
              fill="#DCDCDC"
            />
          </svg>
        </div>
        
        {/* メッセージ */}
        <div className={cn(
          'font-["Noto_Sans_JP"] font-medium text-[16px] text-[#323232]',
          'tracking-[1.6px] leading-[2] text-center whitespace-nowrap'
        )}>
          詳細を確認するメッセージを選択してください。
        </div>
      </div>
    </div>
  );
} 