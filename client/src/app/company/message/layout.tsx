import { redirect } from 'next/navigation';
import { getServerAuth } from '@/lib/auth/server';
import { AccessRestricted } from '@/components/AccessRestricted';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';

export default async function CompanyMessageLayout({
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

  // 認証されていない場合
  if (!auth.isAuthenticated) {
    return <AccessRestricted userType="company" />;
  }

  // 企業ユーザーでない場合は候補者ページへリダイレクト
  if (auth.userType !== 'company_user') {
    redirect('/candidate');
  }

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