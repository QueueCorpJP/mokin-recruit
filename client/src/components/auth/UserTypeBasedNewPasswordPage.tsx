'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { NewPasswordContent } from '@/components/auth/NewPasswordContent';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';

// ローディング画面コンポーネント（候補者用）
function CandidateLoadingScreen({ message = '読み込み中...' }: { message?: string }) {
  return (
    <CandidateAuthBackground>
      <Navigation />
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 flex justify-center items-start relative w-full'>
        <div className='relative w-full max-w-[480px] md:max-w-[800px] mx-auto bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 md:px-[80px] py-10 md:py-[80px]'>
          <div className='text-center space-y-6'>
            <h1 className='text-[#0F9058] font-bold text-[24px] md:text-[32px] leading-[1.6] tracking-[2.4px] md:tracking-[3.2px]'>
              パスワードの再設定
            </h1>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9058] mx-auto'></div>
            <p className='text-[#323232] font-medium text-[14px] md:text-[16px]'>{message}</p>
          </div>
        </div>
      </main>
      <Footer variant='login-before' />
    </CandidateAuthBackground>
  );
}

// ローディング画面コンポーネント（企業用）
function CompanyLoadingScreen({ message = '読み込み中...' }: { message?: string }) {
  return (
    <div className='min-h-screen bg-gradient-to-t from-[#17856f] to-[#229a4e] flex flex-col'>
      <Navigation />
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

        <div className='relative w-full max-w-[800px] bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-[80px]'>
          <div className='text-center space-y-6'>
            <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] tracking-[0.1em]'>
              パスワードの再設
            </h1>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9058] mx-auto'></div>
            <p className='text-[#323232] font-medium'>{message}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export function UserTypeBasedNewPasswordPage() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('userType');
  
  console.log('🔍 UserTypeBasedNewPasswordPage rendered - userType:', userType);
  
  if (userType === 'candidate') {
    console.log('📱 Rendering candidate view');
    return (
      <CandidateAuthBackground>
        <Navigation />
        <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 flex justify-center items-start relative w-full'>
          <div className='flex justify-center w-full max-w-[480px] md:max-w-[800px] mx-auto'>
            <Suspense fallback={<CandidateLoadingScreen />}>
              <NewPasswordContent />
            </Suspense>
          </div>
        </main>
        <Footer variant='login-before' />
      </CandidateAuthBackground>
    );
  }

  console.log('🏢 Rendering company view');
  // デフォルト（company）または不明なユーザータイプの場合は企業デザインを使用
  return (
    <div className='min-h-screen bg-gradient-to-t from-[#17856f] to-[#229a4e] flex flex-col'>
      <Navigation />
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

        <div className='flex justify-center w-full max-w-[800px]'>
          <Suspense fallback={<CompanyLoadingScreen />}>
            <NewPasswordContent />
          </Suspense>
        </div>
      </main>
      <Footer variant='login-before' />
    </div>
  );
} 