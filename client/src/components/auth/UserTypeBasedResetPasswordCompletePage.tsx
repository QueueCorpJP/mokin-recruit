'use client';

import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { ResetPasswordCompleteContent } from '@/components/auth/ResetPasswordCompleteContent';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';

export function UserTypeBasedResetPasswordCompletePage() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('userType');
  
  if (userType === 'candidate') {
    return (
      <CandidateAuthBackground
        topRightBallPosition={{ top: '8%', right: '-2rem' }}
        bottomRightBallPosition={{ top: '18%', right: '-4rem' }}
      >
        <Navigation />
        <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[300px] flex justify-center items-start relative w-full'>
          <div className='relative w-full max-w-[480px] md:max-w-[800px] mx-auto'>
            <ResetPasswordCompleteContent />
          </div>
        </main>
        <Footer variant='login-before' />
      </CandidateAuthBackground>
    );
  }

  // デフォルト（company）または不明なユーザータイプの場合は企業デザインを使用
  return (
    <div className='min-h-screen bg-gradient-to-t from-[#17856f] to-[#229a4e] flex flex-col'>
      <Navigation />
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[300px] flex justify-center items-start relative w-full'>
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

        <div className='relative w-full max-w-[800px]'>
          <ResetPasswordCompleteContent />
        </div>
      </main>
      <Footer variant='login-before' />
    </div>
  );
} 