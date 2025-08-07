import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type LoadingVariant = 'primary' | 'white' | 'gray' | 'inline';
export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  className?: string;
  message?: string;
  fullScreen?: boolean;
  inline?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantClasses = {
  primary: 'text-[#17856F]',
  white: 'text-white',
  gray: 'text-gray-500',
  inline: 'text-current',
};

export function Loading({
  variant = 'primary',
  size = 'md',
  className,
  message,
  fullScreen = false,
  inline = false,
}: LoadingProps) {
  const spinner = (
    <Loader2
      className={cn(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );

  if (inline) {
    return (
      <span className="inline-flex items-center gap-2">
        {spinner}
        {message && <span className="text-sm">{message}</span>}
      </span>
    );
  }

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-[#17856F] to-[#229A4E] rounded-full animate-pulse" />
          </div>
          <div className="relative">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white text-xl font-bold mb-2">
              {message || '読み込み中...'}
            </p>
            <p className="text-white/80 text-sm">しばらくお待ちください</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      {spinner}
      {message && (
        <p className={cn('text-sm', variantClasses[variant])}>{message}</p>
      )}
    </div>
  );
}

export function ButtonLoading({
  className,
  size = 'sm',
}: {
  className?: string;
  size?: LoadingSize;
}) {
  return (
    <span
      className={cn(
        'inline-block border-2 border-white border-t-transparent rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
    />
  );
}

export function SpinnerIcon({
  className,
  size = 'md',
  variant = 'primary',
}: {
  className?: string;
  size?: LoadingSize;
  variant?: LoadingVariant;
}) {
  return (
    <div
      className={cn(
        'border-4 rounded-full animate-spin',
        sizeClasses[size],
        {
          'border-[#17856F]/20 border-t-[#17856F]': variant === 'primary',
          'border-white/20 border-t-white': variant === 'white',
          'border-gray-300 border-t-gray-600': variant === 'gray',
          'border-current/20 border-t-current': variant === 'inline',
        },
        className
      )}
    />
  );
}

export function MessageLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-gray-500">メッセージを読み込み中...</div>
    </div>
  );
}