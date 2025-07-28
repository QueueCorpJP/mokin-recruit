import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import CandidateForgotPasswordForm from '@/components/auth/CandidateForgotPasswordForm';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';

export const metadata: Metadata = {
  title: 'パスワードの再設定 | CuePoint',
  description: 'パスワードをリセットするためのメールを送信します',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function CandidateResetPasswordPage() {
  return (
    <CandidateAuthBackground
      bottomRightBallPosition={{ top: '25%', right: '-4rem' }}
    >
      {/* ナビゲーション */}
      <Navigation />

      {/* メインコンテンツ */}
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[460px] flex justify-center items-start relative w-full'>
        {/* フォームコンテナ */}
        <div className='relative w-full max-w-[480px] md:max-w-[800px] mx-auto'>
          <Suspense fallback={<div className='text-center text-white'>読み込み中...</div>}>
            <CandidateForgotPasswordForm />
          </Suspense>
        </div>
      </main>

      {/* フッター */}
      <Footer variant='login-before' />
    </CandidateAuthBackground>
  );
}
