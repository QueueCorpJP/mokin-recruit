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
    <div className='min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex flex-col'>
      <Navigation />
      <main className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-[800px] bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20'>
          <div className='text-center space-y-6'>
            <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] tracking-[0.1em]'>
              パスワードの再設定
            </h1>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9058] mx-auto'></div>
            <p className='text-[#323232] font-medium'>{message}</p>
          </div>
        </div>
      </main>
      <Footer variant='login-before' />
    </div>
  );
}

// Server Component (メタデータ、SEO、静的コンテンツ)
export default function NewPasswordPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex flex-col'>
      {/* ナビゲーション */}
      <Navigation />

      {/* メインコンテンツ */}
      <main className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-[800px] bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20'>
          {/* 見出し+説明 */}
          <div className='text-center mb-10 space-y-6'>
            <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] tracking-[0.1em]'>
              パスワードの再設定
            </h1>
            <p className='text-[#323232] font-bold text-base leading-8 tracking-[0.1em]'>
              半角英数字・記号のみ、8文字以上でパスワードを設定してください。
            </p>
          </div>

          {/* Client Component でインタラクティブ機能を処理 */}
          <div className='flex justify-center'>
            <Suspense fallback={<LoadingScreen />}>
              <NewPasswordContent />
            </Suspense>
          </div>
        </div>
      </main>

      {/* フッター */}
      <Footer variant='login-before' />
    </div>
  );
}
