import React from 'react';
import ScoutTemplateNewClient from './ScoutTemplateNewClient';
import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export default async function ScoutTemplateNewPage() {
  // サーバーサイドで認証状態を確認
  // const auth = await getServerAuth();

  // // 認証されていない場合はログインページへ
  // if (!auth.isAuthenticated) {
  //   redirect('/company/auth/login');
  // }

  // // 企業ユーザーでない場合は候補者ページへ
  // if (auth.userType !== 'company_user') {
  //   redirect('/candidate');
  // }

  return <ScoutTemplateNewClient />;
}
