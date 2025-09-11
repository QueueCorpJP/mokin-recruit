'use client';

import { useEffect, useMemo, useState, memo } from 'react';
import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';

interface AuthAwareNavigationProps {
  isLoggedIn?: boolean;
  userInfo?: {
    companyName?: string;
    userName?: string;
  };
}

export const AuthAwareNavigation = memo(function AuthAwareNavigation({ 
  isLoggedIn = false, 
  userInfo 
}: AuthAwareNavigationProps = {}) {
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

  // サーバーサイドレンダリング中は未ログイン状態でナビゲーションを表示
  if (!mounted) {
    return (
      <Navigation
        variant={variant}
        isLoggedIn={false}
        userInfo={undefined}
      />
    );
  }

  // サーバーコンポーネント認証に移行したため、クライアントサイドでは
  // 認証状態を取得せずにナビゲーションを表示
  // 各ページで必要に応じてサーバーサイドで認証情報を渡す
  
  return (
    <Navigation
      variant={variant}
      isLoggedIn={isLoggedIn}
      userInfo={userInfo}
    />
  );
});