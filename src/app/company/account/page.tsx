import React from 'react';
import AccountClient from './AccountClient';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';

export default function AccountPage() {
  const testUserInfo = {
    name: 'テストユーザー',
    email: 'test@example.com',
    userType: 'company_user' as const,
    companyName: '株式会社CuePoint',
  };

  return (
    <>
      <AuthAwareNavigationServer
        variant="company"
        isLoggedIn={true}
        userInfo={testUserInfo}
      />
      <AccountClient />
      <AuthAwareFooterServer
        variant="company"
        isLoggedIn={true}
        userInfo={testUserInfo}
      />
    </>
  );
}
