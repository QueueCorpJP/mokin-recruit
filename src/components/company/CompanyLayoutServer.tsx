import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { UserProvider } from '@/contexts/UserContext';

export default async function CompanyLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで認証状態を確認（一度だけ）
  const auth = await getServerAuth();

  // 企業で未ログイン（または企業ではない）ならログインへ
  if (!auth.isAuthenticated || auth.userType !== 'company_user') {
    redirect('/company/auth/login');
  }

  // 認証情報を整理
  const userInfo = auth.isAuthenticated && auth.user ? {
    name: auth.user.name || auth.user.email || '',
    email: auth.user.email || '',
    userType: auth.userType
  } : undefined;

  // UserContext用のユーザー情報
  const contextUser = auth.isAuthenticated && auth.user ? {
    id: auth.user.id,
    email: auth.user.email || '',
    role: 'company' as const,
    profile: auth.user
  } : null;

  return (
    <UserProvider user={contextUser}>
      {children}
    </UserProvider>
  );
}