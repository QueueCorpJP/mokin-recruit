import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';
import { SignupVerifyServerComponent } from './SignupVerifyServerComponent';

export const metadata: Metadata = {
  title: '認証コード入力 | CuePoint',
  description: '認証コードを入力して会員登録を完了します',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function SignupVerifyPage() {
  return (
    <CandidateAuthBackground>
      {/* メインコンテンツ */}
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[80px] flex justify-center items-start relative w-full'>
        {/* フォームコンテナ */}
        <div className='relative w-full max-w-[480px] md:max-w-[800px] mx-auto'>
          <div className="flex flex-col gap-10 items-center justify-start w-full">
            {/* 認証フォーム */}
            <Suspense fallback={<div className='text-center'>読み込み中...</div>}>
              <SignupVerifyServerComponent />
            </Suspense>

            {/* 情報カード */}
            <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-6 items-center justify-start p-6 md:p-[80px] relative rounded-3xl md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 w-full">
              <div className="box-border content-stretch flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold gap-[18px] items-center justify-start leading-[0] p-0 relative shrink-0 text-center w-full">
                <div className="relative shrink-0 text-[#0f9058] w-full text-[18px] md:text-[20px] tracking-[1.8px] md:tracking-[2px]">
                  <p className="block leading-[1.6]">認証コードが届かない場合</p>
                </div>
                <div className="leading-[1.6] relative shrink-0 text-[#323232] text-[14px] tracking-[1.4px] w-full">
                  <p className="block mb-0">
                    「@example.com」からのメールを受信できる設定になっているか、
                  </p>
                  <p className="block mb-0">
                    メールが迷惑メールボックスに振り分けられていないかをご確認の上、
                  </p>
                  <p className="block">新しい認証コードを再度送信してください。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </CandidateAuthBackground>
  );
}