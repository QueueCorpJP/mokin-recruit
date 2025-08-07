'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { NewPasswordContent } from '@/components/auth/NewPasswordContent';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';
import { SpinnerIcon } from '@/components/ui/Loading';

// ローディング画面コンポーネント（候補者用）
function CandidateLoadingScreen({ message = '読み込み中...' }: { message?: string }) {
  return (
    <CandidateAuthBackground>
      <Navigation />
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[460px] flex justify-center items-start relative w-full'>
        <div className='relative w-full max-w-[480px] md:max-w-[800px] mx-auto bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 md:px-[80px] py-10 md:py-[80px]'>
          <div className='text-center space-y-6'>
            <h1 className='text-[#0F9058] font-bold text-[24px] md:text-[32px] leading-[1.6] tracking-[2.4px] md:tracking-[3.2px]'>
              パスワードの再設定
            </h1>
            <SpinnerIcon size="lg" variant="primary" className="mx-auto" />
            <p className='text-[#323232] font-medium text-[14px] md:text-[16px]'>{message}</p>
          </div>
        </div>
      </main>
      <Footer variant='login-before' />
    </CandidateAuthBackground>
  );
}

// ローディング画面コンポーネント（企業用） - CandidateAuthBackgroundを使用
function CompanyLoadingScreen({ message = '読み込み中...' }: { message?: string }) {
  return (
    <CandidateAuthBackground>
      <Navigation />
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[460px] flex justify-center items-start relative w-full'>
        <div className='relative w-full max-w-[480px] md:max-w-[800px] mx-auto bg-white rounded-[20px] md:rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 md:p-[80px]'>
          <div className='text-center space-y-6'>
            <h1 className='text-[#0F9058] font-bold text-[24px] md:text-[32px] leading-[1.6] md:leading-[51.2px] tracking-[2.4px] md:tracking-[0.1em]'>
              パスワードの再設定
            </h1>
            <SpinnerIcon size="lg" variant="primary" className="mx-auto" />
            <p className='text-[#323232] font-medium text-[14px] md:text-[16px]'>{message}</p>
          </div>
        </div>
      </main>
      <Footer variant='login-before' />
    </CandidateAuthBackground>
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
        <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[460px] flex justify-center items-start relative w-full'>
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
  // デフォルト（company）または不明なユーザータイプの場合も CandidateAuthBackground を使用
  return (
    <CandidateAuthBackground>
      <Navigation />
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[460px] flex justify-center items-start relative w-full'>
        <div className='flex justify-center w-full max-w-[480px] md:max-w-[800px]'>
          <Suspense fallback={<CompanyLoadingScreen />}>
            <NewPasswordContent />
          </Suspense>
        </div>
      </main>
      <Footer variant='login-before' />
    </CandidateAuthBackground>
  );
} 