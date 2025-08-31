import { redirect } from 'next/navigation';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import TemplateNewClient from './TemplateNewClient';

// NOTE: サーバーコンポーネント（ユーザー情報取得のため）
export default async function TemplateNewPage() {
  const userInfo = {
    companyName: 'テスト企業',
    name: 'テストユーザー',
    email: 'test@example.com',
    userType: 'company_user' as const,
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
      <TemplateNewClient />
      <AuthAwareFooterServer
        variant="company"
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
      />
    </>
  );
}
