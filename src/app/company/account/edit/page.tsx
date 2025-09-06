import { redirect } from 'next/navigation';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import EditClient from './EditClient';

// NOTE: サーバーコンポーネント（ユーザー情報取得のため）
export default async function CompanyAccountEditPage() {
  const userInfo = {
    companyName: 'テスト企業',
  };

  // 認証チェック
  const isLoggedIn = true;

  if (!isLoggedIn) {
    redirect('/');
  }

  return (
    <>
      <AuthAwareNavigationServer
        variant="company"
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
      />
      <EditClient />
      <AuthAwareFooterServer
        variant="company"
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
      />
    </>
  );
}
