'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/ui/footer';
import { useAuthUser, useAuthUserType, useAuthIsAuthenticated } from '@/contexts/AuthContext';

export function AuthAwareFooter() {
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

  // ユーザー情報を整形（メモ化）
  const userInfo = useMemo(() => {
    return user ? {
      companyName: userType === 'company_user' ? user.name : undefined,
      userName: userType === 'candidate' ? user.name : undefined,
    } : undefined;
  }, [user?.id, user?.name, userType]);

  // サーバーサイドレンダリング中はプレースホルダーを表示
  if (!mounted) {
    return <div className="min-h-[200px] bg-[#323232]" />;
  }

  // フッターを表示しないページがあれば制限可能（現在は全ページで表示）
  
  return (
    <Footer
      variant={variant}
      isLoggedIn={isAuthenticated}  
      userInfo={userInfo}
    />
  );
}