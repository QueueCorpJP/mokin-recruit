'use client';

import { Navigation } from '@/components/ui/navigation';
import { AuthAwareFooter } from '@/components/layout/AuthAwareFooter';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';
import { useState } from 'react';


export default function SignupVerifyPage() {
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = () => {
    // TODO: Implement verification logic
    console.log('Verification code:', verificationCode);
  };

  const handleResendCode = () => {
    // TODO: Implement resend code logic
    console.log('Resending verification code...');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation variant="candidate" isLoggedIn={false} userInfo={undefined} />
      
      <CandidateAuthBackground>
      {/* メインコンテンツ */}
      <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[80px] flex justify-center items-start relative w-full'>
        {/* フォームコンテナ */}
        <div className='relative w-full max-w-[480px] md:max-w-[800px] mx-auto'>
          <div className="flex flex-col gap-10 items-center justify-start w-full">
            {/* 第1ブロック: 認証フォーム */}
            <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-6 items-center justify-start p-6 md:p-[80px] relative rounded-3xl md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 w-full">
              <div
                className="box-border content-stretch flex flex-col gap-2 md:gap-6 items-center justify-start p-0 relative shrink-0 w-full"
                data-name="見出し+説明"
              >
                <div className="relative shrink-0 text-[#0f9058] text-center w-full">
                  <p className="block leading-[1.6] text-[24px] md:text-[32px] tracking-[2.4px] md:tracking-[3.2px] font-['Noto_Sans_JP:Bold',_sans-serif] font-bold">
                    認証コードの入力
                  </p>
                </div>
                <div className="leading-[2] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full text-center">
                  <p className="block mb-0">
                    認証コードを~~~~~~~~~~~~~~に送りました。
                  </p>
                  <p className="block">
                    メールアドレスに届いた4桁の半角英数字を入力してください。
                  </p>
                </div>
              </div>

              <div className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full">
                <div className="box-border content-stretch flex flex-col md:flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center pb-0 pt-[11px] px-0 relative shrink-0">
                    <div className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#323232] text-[14px] md:text-[16px] text-left text-nowrap tracking-[1.4px] md:tracking-[1.6px]">
                      <p className="block leading-[2] whitespace-pre">認証コード</p>
                    </div>
                  </div>
                  <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full md:w-[400px]">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="4桁の半角英数字"
                      maxLength={4}
                      className="bg-[#ffffff] box-border content-stretch cursor-pointer flex flex-row gap-2.5 items-center justify-start overflow-visible p-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999] border-solid font-['Noto_Sans_JP:Medium',_sans-serif] font-medium text-[14px] md:text-[16px] text-left tracking-[1.4px] md:tracking-[1.6px] focus:outline-none focus:border-[#0f9058]"
                      data-name="入力フォーム"
                    />
                  </div>
                </div>

                <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full">
                  <div className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold relative shrink-0 text-[#323232] text-[14px] text-center tracking-[1.4px] leading-[1.6] w-full">
                    <p className="block leading-[1.6]">
                      認証コードが受け取れなかった場合は、新規のコードを発行してください。
                    </p>
                  </div>
                  <button
                    onClick={handleResendCode}
                    className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full md:w-36"
                    data-name="ミニ"
                  >
                    <div className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#323232] text-[0px] text-left text-nowrap tracking-[1.4px]">
                      <p className="[text-decoration-line:underline] [text-decoration-style:solid] [text-underline-position:from-font] block leading-[1.6] text-[14px] whitespace-pre">
                        新しいコードを発行する
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-40 px-10 py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 bg-gradient-to-r from-[#198d76] to-[#1ca74f] w-full md:w-auto"
                data-name="通常サイズ_グリーン"
              >
                <div className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#ffffff] text-[0px] text-center text-nowrap tracking-[1.6px]">
                  <p className="block font-['Inter:Bold',_'Noto_Sans_JP:Bold',_sans-serif] leading-[1.6] not-italic text-[16px] whitespace-pre">
                    認証する
                  </p>
                </div>
              </button>
            </div>

            {/* 第2ブロック: 情報カード */}
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

      <AuthAwareFooter />
    </div>
  );
}