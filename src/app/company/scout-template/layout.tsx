import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';

export default async function ScoutTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで認証状態を確認
  // const auth = await getServerAuth();

  // // 認証情報を整理
  // const userInfo =
  //   auth.isAuthenticated && auth.user
  //     ? {
  //         name: auth.user.name || auth.user.email,
  //         email: auth.user.email,
  //         userType: auth.userType,
  //       }
  //     : undefined;

  // // 認証されていない場合
  // if (!auth.isAuthenticated) {
  //   return <AccessRestricted userType="company" />;
  // }

  // // 企業ユーザーでない場合は候補者ページへリダイレクト
  // if (auth.userType !== 'company_user') {
  //   redirect('/candidate');
  // }

  // 認証チェックを一時的に無効化（テンプレート確認用）
  const userInfo = {
    name: 'テストユーザー',
    email: 'test@example.com',
    userType: 'company_user',
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
