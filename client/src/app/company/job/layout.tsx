import { redirect } from 'next/navigation';
import { getServerAuth } from '@/lib/auth/server';
import { AccessRestricted } from '@/components/AccessRestricted';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';

export default async function CompanyJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで認証状態を確認（candidateレイアウトと同じ仕組み）
  const auth = await getServerAuth();
  
  // デバッグ用ログ
  console.log('🔍 company/job/layout - Auth result:', {
    isAuthenticated: auth.isAuthenticated,
    userType: auth.userType,
    userEmail: auth.user?.email
  });

  // 認証済みで企業ユーザーまたは管理者でない場合は候補者ページへリダイレクト
  if (auth.isAuthenticated && auth.userType !== 'company_user' && auth.userType !== 'admin') {
    console.log('🔄 Redirecting to candidate - userType is:', auth.userType);
    redirect('/candidate');
  }

  // 認証情報を整理
  const userInfo = auth.isAuthenticated && auth.user ? {
    name: auth.user.name || auth.user.email,
    email: auth.user.email,
    userType: auth.userType
  } : undefined;
  
  console.log('✅ Access granted to company/job - userType:', auth.userType);

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
