'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';

export function AuthAwareNavigation() {
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
    return <div className="h-[80px] bg-white border-b border-gray-200" />;
  }

  // サーバーコンポーネント認証に移行したため、クライアントサイドでは
  // 認証状態を取得せずにナビゲーションを表示
  // 各ページで必要に応じてサーバーサイドで認証情報を渡す
  
  return (
    <Navigation
      variant={variant}
      isLoggedIn={false} // Server-side auth migration: Will be handled per page
      userInfo={undefined}
    />
  );
}