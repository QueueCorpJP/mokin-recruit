import React from 'react';
// import { getServerAuth } from '@/lib/auth/server';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import { ScoutSendForm } from './ScoutSendForm';

export default async function CompanyScoutPage() {
  // サーバーサイドで認証状態を確認
  // const auth = await getServerAuth();

  // 認証済みで企業ユーザーでない場合は候補者ページへリダイレクト
  // テンプレート確認のためコメントアウト
  // if (!auth.isAuthenticated || auth.userType !== 'company_user') {
  //   redirect('/company/auth/login');
  // }

  // const userInfo = auth.user
  //   ? {
  //       name: auth.user.name || auth.user.email,
  //       email: auth.user.email,
  //       userType: auth.userType,
  //     }
  //   : undefined;

  // テンプレート確認用にログイン済み状態を強制
  const testUserInfo = {
    name: 'テストユーザー',
    email: 'test@example.com',
    userType: 'company_user' as const,
    companyName: '株式会社テスト',
  };

  return (
    <>
      <AuthAwareNavigationServer
        variant="company"
        isLoggedIn={true} // テンプレート確認用に強制的にtrue
        userInfo={testUserInfo}
      />
      <ScoutSendForm />
      <AuthAwareFooterServer
        variant="company"
        isLoggedIn={true} // テンプレート確認用に強制的にtrue
        userInfo={testUserInfo}
      />
    </>
  );
}
