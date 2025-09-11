import { redirect } from 'next/navigation';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import EditClient from './EditClient';

// NOTE: サーバーコンポーネント（ユーザー情報取得のため）
export default async function CompanyAccountEditPage() {

  return (
    <>
     
      <EditClient />
     
    </>
  );
}
