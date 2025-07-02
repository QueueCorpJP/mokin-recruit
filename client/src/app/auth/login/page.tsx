import { Metadata } from 'next';
import { Suspense } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'ログイン | CuePoint',
  description: 'CuePointにログインしてダイレクトリクルーティングを開始',
};

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex flex-col'>
      {/* ナビゲーション */}
      <Navigation />

      {/* メインコンテンツ */}
      <main className='flex-1 flex items-center justify-center px-4 py-12 lg:px-20'>
        {/* 背景装飾 */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -left-56 top-[395px] w-[1889.89px] h-[335px] bg-gradient-to-b from-[#198D76] to-[#1CA74F] rounded-full opacity-30'></div>
        </div>

        {/* カードコンテナ */}
        <div className='relative w-full max-w-[800px] bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-8 md:p-12 lg:p-20'>
          <Suspense fallback={<div className='text-center'>読み込み中...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>

      {/* フッター */}
      <Footer variant='login-before' />
    </div>
  );
}
