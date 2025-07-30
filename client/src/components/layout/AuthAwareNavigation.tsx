'use client';

import { useEffect, useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';

import { Navigation } from '@/components/ui/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function AuthAwareNavigation() {
  const { user, userType, isAuthenticated } = useAuth();
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

  // デバッグ情報を追加
  useEffect(() => {
    if (mounted) {
      // eslint-disable-next-line no-console
      console.log('🔍 AuthAwareNavigation - Auth State:', {
        isAuthenticated,
        userType,
        userId: user?.id,
        userName: user?.name,
        pathname,
        variant,
        timestamp: new Date().toISOString()
      });
      
      // ヘッダーの表示内容を明確に記録
      if (isAuthenticated) {
        // eslint-disable-next-line no-console
        console.log('✅ Header will show: AUTHENTICATED navigation');
      } else {
        // eslint-disable-next-line no-console
        console.log('❌ Header will show: UNAUTHENTICATED navigation');
      }
    }
  }, [mounted, isAuthenticated, userType, user, pathname, variant]);

  // ユーザー情報を整形（メモ化）
  const userInfo = useMemo(() => {
    return user ? {
      companyName: userType === 'company_user' ? user.name : undefined,
      userName: userType === 'candidate' ? user.name : undefined,
    } : undefined;
  }, [user, userType]);

  // サーバーサイドレンダリング中はプレースホルダーを表示
  if (!mounted) {
    return <div className="h-[80px] bg-white border-b border-gray-200" />;
  }

  // ヘッダーを表示しないページの制限を解除
  // 常にヘッダーを表示（未認証でもアクセス制限なし）
  
  // ローディング中でもヘッダーを表示（認証状態に関係なく）
  // ローディング状態はヘッダー内容で判断
  
  return (
    <Navigation
      variant={variant}
      isLoggedIn={isAuthenticated}  
      userInfo={userInfo}
    />
  );
}