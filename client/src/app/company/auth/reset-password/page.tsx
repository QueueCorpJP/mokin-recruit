import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Footer } from '@/components/ui/footer';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'パスワードの再設定 | CuePoint',
  description: 'パスワードをリセットするためのメールを送信します',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function CompanyResetPasswordPage() {
  return (
    <div className='min-h-screen bg-gradient-to-t from-[#17856f] to-[#229a4e] flex flex-col'>
      {/* メインコンテンツ */}
      <main className='min-h-[730px] px-[80px] pt-[80px] pb-[80px] flex justify-center relative'>
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

        {/* フォームコンテナ */}
        <div className='relative w-full max-w-[800px]'>
          <Suspense fallback={<div className='text-center'>読み込み中...</div>}>
            <ForgotPasswordForm userType='company' />
          </Suspense>
        </div>
      </main>

      {/* フッター */}
      <Footer variant='login-before' />
    </div>
  );
}
