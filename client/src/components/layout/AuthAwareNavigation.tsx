'use client';

import { useEffect, useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';

import { Navigation } from '@/components/ui/navigation';
import { useAuthUser, useAuthUserType, useAuthIsAuthenticated } from '@/contexts/AuthContext';

export function AuthAwareNavigation() {
  // 🔥 根本修正: 個別フック使用でオブジェクト返却を完全回避
  const user = useAuthUser();
  const userType = useAuthUserType();
  const isAuthenticated = useAuthIsAuthenticated();
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

  // 🔥 FIX: デバッグログを削除 - useEffectでの副作用が無限ループの原因
  // useEffect(() => {
  //   if (mounted) {
  //     console.log('🔍 AuthAwareNavigation - Auth State:', {...});
  //   }
  // }, [mounted, isAuthenticated, userType, user?.id, pathname, variant]);

  // ユーザー情報を整形（メモ化）
  const userInfo = useMemo(() => {
    return user ? {
      companyName: userType === 'company_user' ? user.name : undefined,
      userName: userType === 'candidate' ? user.name : undefined,
    } : undefined;
  }, [user?.id, user?.name, userType]);

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