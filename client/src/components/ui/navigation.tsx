'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Home, MessageSquare, Search, FileText, List, HelpCircle, User } from 'lucide-react';
import { Logo } from './logo';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
  variant?: 'default' | 'transparent' | 'company' | 'candidate';
  isLoggedIn?: boolean;
  userInfo?: {
    companyName?: string;
    userName?: string;
  };
}

export function Navigation({
  className,
  variant = 'default',
  isLoggedIn = false,
  userInfo,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();

  // ドロップダウンメニューの切り替え
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      // ログアウトAPIを呼び出し
      const token = localStorage.getItem('auth-token') || localStorage.getItem('supabase-auth-token');
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        // ローカルストレージからトークンを削除
        localStorage.removeItem('auth-token');
        localStorage.removeItem('supabase-auth-token');
        localStorage.removeItem('auth_token');
        
        console.log('✅ ログアウトが完了しました');
        
        // ログインページにリダイレクト
        router.push('/company/auth/login');
      } else {
        console.error('❌ ログアウトAPIエラー:', result);
        // APIエラーの場合でもローカルのトークンは削除
        localStorage.removeItem('auth-token');
        localStorage.removeItem('supabase-auth-token');
        localStorage.removeItem('auth_token');
        router.push('/company/auth/login');
      }
    } catch (error) {
      console.error('❌ ログアウト処理でエラーが発生しました:', error);
      // エラーの場合でもローカルのトークンは削除
      localStorage.removeItem('auth-token');
      localStorage.removeItem('supabase-auth-token');
      localStorage.removeItem('auth_token');
      router.push('/company/auth/login');
    }
    
    // ドロップダウンを閉じる
    setOpenDropdown(null);
  };

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

  // Company variant でログイン後のヘッダー
  if (variant === 'company' && isLoggedIn) {
    const navigationItems = [
      {
        label: 'マイページ',
        href: '/company',
        icon: Home,
        hasDropdown: false,
      },
      {
        label: 'メッセージ',
        href: '/company/messages',
        icon: MessageSquare,
        hasDropdown: true,
        dropdownItems: [
          { label: '受信メッセージ', href: '/company/messages/inbox' },
          { label: '送信メッセージ', href: '/company/messages/sent' },
        ],
      },
      {
        label: '候補者を探す',
        href: '/company/candidates',
        icon: Search,
        hasDropdown: true,
        dropdownItems: [
          { label: '候補者検索', href: '/company/candidates/search' },
          { label: 'スカウト履歴', href: '/company/candidates/scout-history' },
        ],
      },
      {
        label: '求人一覧',
        href: '/company/job',
        icon: FileText,
        hasDropdown: false,
        isActive: true, // 現在のページとしてマーク
      },
      {
        label: '対応リスト',
        href: '/company/responses',
        icon: List,
        hasDropdown: false,
      },
      {
        label: 'ヘルプ',
        href: '/company/help',
        icon: HelpCircle,
        hasDropdown: true,
        dropdownItems: [
          { label: 'よくある質問', href: '/company/help/faq' },
          { label: 'お問い合わせ', href: '/company/help/contact' },
        ],
      },
    ];

    return (
      <header className={cn('w-full border-b border-[#E5E5E5] bg-white', className)}>
        <div className='w-full px-[24px]'>
          <div className='flex justify-between items-center h-[64px] max-w-none'>
            {/* Logo */}
            <div className='flex-shrink-0 mr-[60px]'>
              <Logo width={136} height={28} />
            </div>

            {/* Desktop Navigation */}
            <nav className='flex items-center flex-1'>
              <div className='flex items-center space-x-[40px]'>
                {navigationItems.map((item) => (
                  <div key={item.label} className='relative'>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(item.label)}
                          className={cn(
                            'flex items-center space-x-[8px] transition-colors relative',
                            item.isActive 
                              ? 'text-[#0F9058]'
                              : 'text-[#323232] hover:text-[#0F9058]'
                          )}
                          style={{
                            fontFamily: '"Noto Sans JP", sans-serif',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: 700,
                            lineHeight: '200%',
                            letterSpacing: '1.4px'
                          }}
                        >
                          <item.icon className='w-[20px] h-[20px]' />
                          <span>{item.label}</span>
                          <ChevronDown className='w-[12px] h-[12px] ml-[4px]' />
                        </button>
                        {/* Active underline */}
                        {item.isActive && (
                          <div className='absolute bottom-[-20px] left-0 right-0 h-[3px] bg-[#0F9058]' />
                        )}
                        {/* Dropdown */}
                        {openDropdown === item.label && (
                          <div className='absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50'>
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.label}
                                href={dropdownItem.href}
                                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F9058]'
                                onClick={() => setOpenDropdown(null)}
                              >
                                {dropdownItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center space-x-[8px] transition-colors relative',
                          item.isActive 
                            ? 'text-[#0F9058]'
                            : 'text-[#323232] hover:text-[#0F9058]'
                        )}
                        style={{
                          fontFamily: '"Noto Sans JP", sans-serif',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          lineHeight: '200%',
                          letterSpacing: '1.4px'
                        }}
                      >
                        <item.icon className='w-[20px] h-[20px]' />
                        <span>{item.label}</span>
                        {/* Active underline */}
                        {item.isActive && (
                          <div className='absolute bottom-[-20px] left-0 right-0 h-[3px] bg-[#0F9058]' />
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* User Account Menu */}
            <div className='flex items-center ml-[40px]'>
              <div className='relative'>
                <button
                  onClick={() => toggleDropdown('account')}
                  className='flex items-center space-x-[16px] transition-colors'
                  style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '150%',
                    letterSpacing: '0.6px'
                  }}
                >
                  <div className='text-left flex flex-col'>
                    <div 
                      className='text-[#666666] leading-[18px]'
                      style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '12px',
                        fontWeight: 400,
                        letterSpacing: '0.6px'
                      }}
                    >
                      {userInfo?.companyName || '企業アカウント名...'}
                    </div>
                    <div 
                      className='text-[#666666] leading-[18px]'
                      style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: '12px',
                        fontWeight: 400,
                        letterSpacing: '0.6px'
                      }}
                    >
                      {userInfo?.userName || 'ユーザー名デキ...'}
                    </div>
                  </div>
                  <ChevronDown className='w-[12px] h-[12px] text-[#666666]' />
                </button>
                {openDropdown === 'account' && (
                  <div className='absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50'>
                    <Link
                      href='/company/profile'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F9058]'
                      onClick={() => setOpenDropdown(null)}
                    >
                      プロフィール設定
                    </Link>
                    <Link
                      href='/company/settings'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F9058]'
                      onClick={() => setOpenDropdown(null)}
                    >
                      アカウント設定
                    </Link>
                    <hr className='my-1' />
                    <button
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F9058]'
                      onClick={handleLogout}
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
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
              <div className='px-3 pt-2 pb-3 space-y-2'>
                {navigationItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className='flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#0F9058] hover:bg-gray-50 rounded-md'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className='w-4 h-4' />
                      <span>{item.label}</span>
                    </Link>
                  </div>
                ))}
                <hr className='my-2' />
                <div className='px-3 py-2'>
                  <div className='text-xs text-gray-500'>企業アカウント名</div>
                  <div className='text-sm font-medium'>{userInfo?.companyName || '企業名'}</div>
                  <div className='text-xs text-gray-500 mt-1'>ユーザー名</div>
                  <div className='text-sm font-medium'>{userInfo?.userName || 'ユーザー名'}</div>
                  <button
                    className='mt-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F9058] rounded-md'
                    onClick={handleLogout}
                  >
                    ログアウト
                  </button>
                </div>
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
