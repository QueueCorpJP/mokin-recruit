import { Metadata, Viewport } from 'next';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { Suspense } from 'react';
import { NewPasswordContent } from '@/components/auth/NewPasswordContent';

export const metadata: Metadata = {
  title: 'パスワードの再設定 - 新しいパスワード設定 | CuePoint',
  description: 'パスワードリセット用の新しいパスワードを設定します',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// ローディング画面コンポーネント
function LoadingScreen({ message = '読み込み中...' }: { message?: string }) {
  return (
    <div className='h-screen bg-gradient-to-t from-[#17856f] to-[#229a4e] flex flex-col'>
      <Navigation />
      <main className='flex-1 min-h-[730px] flex items-center justify-center relative px-4'>
        {/* 背景装飾（Figmaの曲線） */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute left-[-224px] top-[395px] w-[1889.89px] h-[335px]'>
            <svg
              className='w-full h-full'
              fill='none'
              preserveAspectRatio='none'
              viewBox='0 0 1890 335'
            >
              <path
                d='M944.943 0C1303.11 0 1631.96 125.532 1889.89 335H0C257.931 125.532 586.776 0 944.943 0Z'
                fill='url(#paint0_linear_4387_76076)'
              />
              <defs>
                <linearGradient
                  gradientUnits='userSpaceOnUse'
                  id='paint0_linear_4387_76076'
                  x1='944.943'
                  x2='944.943'
                  y1='335'
                  y2='0'
                >
                  <stop stopColor='#198D76' />
                  <stop offset='1' stopColor='#1CA74F' />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className='relative w-full max-w-[800px] bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20'>
          <div className='text-center space-y-6'>
            <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] tracking-[0.1em]'>
              パスワードの再設定
            </h1>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9058] mx-auto'></div>
            <p className='text-[#323232] font-medium'>{message}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Server Component (メタデータ、SEO、静的コンテンツ)
export default function NewPasswordPage() {
  return (
    <div className='h-screen bg-gradient-to-t from-[#17856f] to-[#229a4e] flex flex-col'>
      {/* ナビゲーション */}
      <Navigation />

      {/* メインコンテンツ */}
      <main className='flex-1 min-h-[730px] flex items-center justify-center relative px-4'>
        {/* 背景装飾（Figmaの曲線） */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute left-[-224px] top-[395px] w-[1889.89px] h-[335px]'>
            <svg
              className='w-full h-full'
              fill='none'
              preserveAspectRatio='none'
              viewBox='0 0 1890 335'
            >
              <path
                d='M944.943 0C1303.11 0 1631.96 125.532 1889.89 335H0C257.931 125.532 586.776 0 944.943 0Z'
                fill='url(#paint0_linear_4387_76076)'
              />
              <defs>
                <linearGradient
                  gradientUnits='userSpaceOnUse'
                  id='paint0_linear_4387_76076'
                  x1='944.943'
                  x2='944.943'
                  y1='335'
                  y2='0'
                >
                  <stop stopColor='#198D76' />
                  <stop offset='1' stopColor='#1CA74F' />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Client Component でインタラクティブ機能を処理 */}
        <div className='flex justify-center w-full max-w-[800px]'>
          <Suspense fallback={<LoadingScreen />}>
            <NewPasswordContent />
          </Suspense>
        </div>
      </main>

      {/* フッター */}
      <Footer variant='login-before' />
    </div>
  );
}
