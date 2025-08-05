import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  href?: string;
  variant?: 'default' | 'white';
}

export function Logo({
  className,
  showText = false,
  href = '/',
  variant = 'default',
}: LogoProps) {
  const logoSrc = variant === 'white' ? '/images/logo-white.png' : '/images/logo.png';

  const logoContent = (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative h-[32px] md:h-[38px] aspect-[180/38]">
  <Image
    src={logoSrc}
    alt="Mokin Recruit"
    fill
    sizes="(max-width: 768px) 32px, 180px"
    priority
    className="object-contain block"
    style={{ verticalAlign: 'middle' }}
  />
</div>

    
      {showText && (
        <span className="text-xl font-bold text-gray-900">Mokin Recruit</span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center h-full">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
