import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
  href?: string;
  variant?: 'default' | 'white';
}

export function Logo({
  className,
  width = 180,
  height = 38,
  showText = false,
  href = '/',
  variant = 'default',
}: LogoProps) {
  const logoSrc = variant === 'white' ? '/images/logo-white.png' : '/images/logo.png';
  const logoContent = (
    <div
      className={cn('flex items-center justify-center gap-3 h-full', className)}
    >
      <Image
        src={logoSrc}
        alt='Mokin Recruit'
        width={width}
        height={height}
        priority
        className='object-contain block'
        style={{ verticalAlign: 'middle' }}
      />
      {showText && (
        <span className='text-xl font-bold text-gray-900'>Mokin Recruit</span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className='inline-flex items-center h-full'>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}