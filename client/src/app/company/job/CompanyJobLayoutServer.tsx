import { redirect } from 'next/navigation';
import { getServerAuth } from '@/lib/auth/server';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';

export default async function CompanyJobLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで認証状態を確認
  const auth = await getServerAuth();

  // 認証済みで企業ユーザーでない場合は候補者ページへリダイレクト
  if (auth.isAuthenticated && auth.userType !== 'company_user') {
    redirect('/candidate');
  }

  // 認証情報を整理
  const userInfo = auth.isAuthenticated && auth.user ? {
    name: auth.user.name || auth.user.email,
    email: auth.user.email,
    userType: auth.userType
  } : undefined;

  return (
    <>
      <AuthAwareNavigationServer 
        variant="company" 
        isLoggedIn={auth.isAuthenticated}
        userInfo={userInfo}
      />
      <div className='min-h-screen flex flex-col'>
        <main className='flex-1'>{children}</main>
      </div>
      <AuthAwareFooterServer 
        variant="company" 
        isLoggedIn={auth.isAuthenticated}
        userInfo={userInfo}
      />
    </>
  );
}