import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';
import SignupServerComponent from './SignupServerComponent';

export const metadata: Metadata = {
  title: '新規会員登録 | CuePoint',
  description: '会員登録を行います',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function SignupPage() {
  return (
    <CandidateAuthBackground>
      {/* メインコンテンツ */}
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] pb-20 lg:pb-[460px] mb-0 flex justify-center items-start relative w-full'>
        {/* フォームコンテナ */}
        <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-center justify-start p-6 md:p-[80px] relative rounded-3xl md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 w-full max-w-[480px] md:max-w-[800px] mx-auto">
          <Suspense fallback={<div className='text-center'>読み込み中...</div>}>
            <SignupServerComponent />
          </Suspense>
        </div>
      </main>
    </CandidateAuthBackground>
  );
}
