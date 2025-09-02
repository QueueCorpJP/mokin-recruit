import { getServerAuth } from '@/lib/auth/server';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';

export const dynamic = 'force-dynamic';

export default async function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで認証状態を確認（1回のみ）
  const auth = await getServerAuth();
  
  // 認証情報を整理
  const userInfo = auth.isAuthenticated && auth.user ? {
    name: auth.user.name || auth.user.email,
    email: auth.user.email,
    userType: auth.userType
  } : undefined;

  // 認証状態を確認してvariantを決定
  let variant: 'default' | 'candidate' | 'company' = 'default';
  if (auth.isAuthenticated) {
    if (auth.userType === 'candidate') {
      variant = 'candidate';
    } else if (auth.userType === 'company_user') {
      variant = 'company';
    }
  }

  return (
    <>
      <AuthAwareNavigationServer 
        variant={variant} 
        isLoggedIn={auth.isAuthenticated}
        userInfo={userInfo}
      />
      {children}
      <AuthAwareFooterServer 
        variant={variant} 
        isLoggedIn={auth.isAuthenticated}
        userInfo={userInfo}
      />
    </>
  );
}