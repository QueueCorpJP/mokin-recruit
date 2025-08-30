import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
// ナビゲーションとフッターは親レイアウト（client側）で描画するため、ここでは描画しない
import { UserProvider } from '@/contexts/UserContext';

export default async function CandidateLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで認証状態を確認（一度だけ）
  const auth = await getServerAuth();

  // 候補者で未ログイン（または候補者ではない）ならログインへ
  if (!auth.isAuthenticated || auth.userType !== 'candidate') {
    redirect('/candidate/auth/login');
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
    role: 'candidate' as const,
    profile: auth.user
  } : null;

  return (
    <UserProvider user={contextUser}>
      {children}
    </UserProvider>
  );
}
