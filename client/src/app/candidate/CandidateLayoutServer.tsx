import { getServerAuth } from '@/lib/auth/server';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import { UserProvider } from '@/contexts/UserContext';

export default async function CandidateLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで認証状態を確認（一度だけ）
  const auth = await getServerAuth();

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
    role: 'candidate' as const,
    profile: auth.user
  } : null;

  return (
    <UserProvider user={contextUser}>
      <AuthAwareNavigationServer 
        variant="candidate" 
        isLoggedIn={auth.isAuthenticated}
        userInfo={userInfo}
      />
      {children}
      <AuthAwareFooterServer 
        variant="candidate" 
        isLoggedIn={auth.isAuthenticated}
        userInfo={userInfo}
      />
    </UserProvider>
  );
}