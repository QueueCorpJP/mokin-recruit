'use client';

import { useEffect, useMemo, useState, memo } from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/ui/footer';

interface AuthAwareFooterProps {
  isLoggedIn?: boolean;
  userInfo?: {
    companyName?: string;
    userName?: string;
  };
}

export const AuthAwareFooter = memo(function AuthAwareFooter({ 
  isLoggedIn = false, 
  userInfo 
}: AuthAwareFooterProps = {}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setMounted(true);
  }, []);

  // パスに基づいてvariantを決定（メモ化）
  const variant = useMemo(() => {
    if (pathname.startsWith('/candidate')) {
      return 'candidate';
    }
    if (pathname.startsWith('/company')) {
      return 'company';
    }
    return 'default';
  }, [pathname]);

  // サーバーサイドレンダリング中はプレースホルダーを表示
  if (!mounted) {
    return <div className="min-h-[200px] bg-[#323232]" />;
  }

  // サーバーコンポーネント認証に移行したため、クライアントサイドでは
  // 認証状態を取得せずにフッターを表示
  // 各ページで必要に応じてサーバーサイドで認証情報を渡す
  
  return (
    <Footer
      variant={variant}
      isLoggedIn={isLoggedIn}
      userInfo={userInfo}
    />
  );
});