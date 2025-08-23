import { redirect } from 'next/navigation';
import { getServerAuth } from '@/lib/auth/server';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';

export default async function CompanyLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  // 企業認証チェック（並列処理で最適化）
  const auth = await getServerAuth();
  
  if (!auth.isAuthenticated || auth.userType !== 'company_user') {
    redirect('/company/auth/login');
  }

  const userInfo = {
    name: auth.user?.name || auth.user?.email || '企業ユーザー',
    email: auth.user?.email || '',
    userType: auth.userType
  };

  return (
    <>
      <AuthAwareNavigationServer 
        variant="company" 
        isLoggedIn={true}
        userInfo={userInfo}
      />
      {children}
      <AuthAwareFooterServer 
        variant="company" 
        isLoggedIn={true}
        userInfo={userInfo}
      />
    </>
  );
}