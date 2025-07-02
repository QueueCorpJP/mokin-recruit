'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from './logo';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
  variant?: 'default' | 'transparent';
}

export function Navigation({
  className,
  variant = 'default',
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ナビゲーション項目を削除（ログインと資料請求のみ表示）
  const navItems: { href: string; label: string }[] = [];

  return (
    <header
      className={cn(
        'w-full border-b border-gray-200 navigation-header',
        variant === 'default' ? 'bg-white' : 'bg-transparent',
        className
      )}
      style={{ height: '80px' }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div
          className='flex justify-between items-center navigation-container'
          style={{ height: '80px' }}
        >
          {/* Logo */}
          <div className='flex-shrink-0 flex items-center h-full'>
            <Logo width={180} height={38} />
          </div>

          {/* Desktop Auth Buttons */}
          <div className='hidden lg:flex items-center'>
            <Button
              variant='green-gradient'
              size='lg'
              className='rounded-[32px] px-8 font-bold tracking-[0.1em] h-[60px] max-h-[60px] transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02]'
              asChild
            >
              <Link href='/signup'>資料請求</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className='lg:hidden'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label='メニューを開く'
            >
              {isMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='lg:hidden border-t border-gray-200'>
            <div className='px-3 pt-2 pb-3'>
              <Button
                variant='green-gradient'
                size='lg'
                className='w-full rounded-[32px] px-8 font-bold tracking-[0.1em] h-[60px] max-h-[60px] transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02]'
                asChild
              >
                <Link href='/signup' onClick={() => setIsMenuOpen(false)}>
                  資料請求
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
