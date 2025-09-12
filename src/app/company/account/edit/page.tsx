import { redirect } from 'next/navigation';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import EditClient from './EditClient';

// NOTE: サーバーコンポーネント（ユーザー情報取得のため）
export default async function CompanyAccountEditPage() {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return (
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <EditClient />
    </>
  );
}
