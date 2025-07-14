'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from './logo';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
  variant?: 'default' | 'transparent' | 'company' | 'candidate';
}

export function Navigation({
  className,
  variant = 'default',
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ナビゲーション項目を削除（ログインと資料請求のみ表示）
  // const navItems: { href: string; label: string }[] = [];

  // variant に応じたCTAボタンの設定
  // --- ここから拡張 ---
  if (variant === 'candidate') {
    // Figma準拠: 会員登録（filled/gradient）・ログイン（outline/ghost）
    const candidateButtons = [
      {
        href: '/candidate/auth/register',
        label: '会員登録',
        variant: 'green-gradient',
        size: 'lg',
        className:
          'rounded-[32px] px-8 font-bold tracking-[0.1em] h-[60px] max-h-[60px] transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02] mr-4',
      },
      {
        href: '/candidate/auth/login',
        label: 'ログイン',
        variant: 'green-outline',
        size: 'lg',
        className:
          'rounded-[32px] px-8 font-bold tracking-[0.1em] h-[60px] max-h-[60px] border-2 border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] transition-all duration-200 ease-in-out',
      },
    ];
    return (
      <header
        className={cn(
          'w-full border-b border-gray-200 navigation-header',
          (variant as string) === 'transparent' ? 'bg-transparent' : 'bg-white',
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

            {/* Desktop Buttons */}
            <div className='hidden lg:flex items-center'>
              {candidateButtons.map((btn, idx) => (
                <Button
                  key={btn.label}
                  variant={btn.variant as any}
                  size={btn.size as any}
                  className={btn.className + (idx === 1 ? '' : ' mr-4')}
                  asChild
                >
                  <Link href={btn.href}>{btn.label}</Link>
                </Button>
              ))}
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
              <div className='px-3 pt-2 pb-3 flex flex-col gap-3'>
                {candidateButtons.map(btn => (
                  <Button
                    key={btn.label}
                    variant={btn.variant as any}
                    size={btn.size as any}
                    className={btn.className + ' w-full'}
                    asChild
                  >
                    <Link href={btn.href} onClick={() => setIsMenuOpen(false)}>
                      {btn.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }
  // --- ここまで拡張 ---

  // variant に応じたCTAボタンの設定
  const getCTAButton = () => {
    switch (variant as string) {
      case 'company':
        return {
          href: '/company/auth/login',
          label: '企業ログイン',
        };
      case 'candidate':
        return {
          href: '/candidate/auth/login',
          label: '候補者ログイン',
        };
      default:
        return {
          href: '/signup',
          label: '資料請求',
        };
    }
  };

  const ctaButton = getCTAButton();

  return (
    <header
      className={cn(
        'w-full border-b border-gray-200 navigation-header',
        variant === 'transparent' ? 'bg-transparent' : 'bg-white',
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
              <Link href={ctaButton.href}>{ctaButton.label}</Link>
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
                <Link
                  href={ctaButton.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {ctaButton.label}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
