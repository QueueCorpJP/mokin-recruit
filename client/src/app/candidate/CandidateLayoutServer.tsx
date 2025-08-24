import { getServerAuth } from '@/lib/auth/server';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';

export default async function CandidateLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで認証状態を確認（並列処理で最適化）
  const auth = await getServerAuth();

  // 認証情報を整理
  const userInfo = auth.isAuthenticated && auth.user ? {
    name: auth.user.name || auth.user.email || '',
    email: auth.user.email || '',
    userType: auth.userType
  } : undefined;

  // すべての候補者ページは認証なしでもアクセス可能
  // 個別のページで必要に応じて認証チェックを行う
  return (
    <>
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
    </>
  );
}