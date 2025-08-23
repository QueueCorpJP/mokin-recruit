import { getServerAuth } from '@/lib/auth/server';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';

export default async function CompanyAuthLayoutServer({
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

  // 認証ページは誰でもアクセス可能
  return (
    <>
      <AuthAwareNavigationServer 
        variant="company" 
        isLoggedIn={auth.isAuthenticated}
        userInfo={userInfo}
      />
      {children}
      <AuthAwareFooterServer 
        variant="company" 
        isLoggedIn={auth.isAuthenticated}
        userInfo={userInfo}
      />
    </>
  );
}