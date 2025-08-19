'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { autoLoginAction } from './actions';

export default function SignupCompletePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleMyPageClick = async () => {
    setError(null);
    
    startTransition(async () => {
      try {
        const result = await autoLoginAction();
        
        if (!result.success) {
          setError(result.error || 'ログインに失敗しました');
          // エラーの場合は手動でマイページに遷移
          router.push('/candidate/mypage');
        }
        // 成功の場合はautoLoginAction内でリダイレクトされる
      } catch (error) {
        console.error('Auto-login error:', error);
        // エラーの場合は手動でマイページに遷移
        router.push('/candidate/mypage');
      }
    });
  };

  return (
    <>
      {/* PC Version */}
      <main
        className="hidden lg:flex relative py-20 flex-col items-center justify-start"
        style={{
          backgroundImage: "url('/background-pc.svg')",
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {/* Container */}
        <div className="bg-white rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20 w-[1000px] flex flex-col gap-10 items-center">
          {/* Title and Content */}
          <div className="flex flex-col gap-6 items-center w-full">
            <h1 className="text-[#0f9058] text-[32px] font-bold tracking-[3.2px] text-center">
              ご登録ありがとうございます
            </h1>

            {/* Illustration */}
            <div className="bg-white flex items-center justify-center w-60 h-60">
              <img
                src="/back.svg"
                alt="完了イラスト"
                width="240"
                height="240"
              />
            </div>

            <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
              <p>
                あなたのご経歴に関心を持った企業から、順次スカウトが届きます。
              </p>
              <p>
                ご自身のキャリアの可能性を広げる第一歩として、まずはマイページで情報を整理しておきましょう。
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-center text-sm">
              {error}
            </div>
          )}

          {/* Button */}
          <Button
            onClick={handleMyPageClick}
            disabled={isPending}
            variant="green-gradient"
            size="figma-default"
            className="min-w-[160px] text-[16px] tracking-[1.6px] disabled:opacity-50"
          >
            {isPending ? 'ログイン中...' : 'マイページへ'}
          </Button>
        </div>
      </main>

      {/* SP (Mobile) Version */}
      <main
        className="lg:hidden flex relative pt-6 pb-20 flex-col items-center px-4"
        style={{
          backgroundImage: "url('/background-sp.svg')",
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {/* Container */}
        <div className="bg-white rounded-3xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 py-10 w-full flex flex-col gap-10 items-center">
          {/* Progress Indicator */}
          <div className="flex flex-row gap-4 items-center w-full pb-4 border-b border-[#efefef]">
            <div className="relative w-[72px] h-[72px]">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle
                  cx="36"
                  cy="36"
                  r="28.8"
                  stroke="#e0e0e0"
                  strokeWidth="7.2"
                  fill="none"
                  strokeLinecap="round"
                  transform="rotate(-90 36 36)"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="28.8"
                  stroke="#0f9058"
                  strokeWidth="7.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="181 181"
                  transform="rotate(-90 36 36)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-[#0f9058] text-[24px] font-medium tracking-[2.4px]">
                    4
                  </span>
                  <span className="text-[#999999] text-[17px] font-medium tracking-[1.7px]">
                    /4
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-[#999999] text-[16px] font-bold tracking-[1.6px]">
                会員情報
              </p>
              <p className="text-[#0f9058] text-[20px] font-bold tracking-[2px]">
                完了
              </p>
            </div>
          </div>

          {/* Title and Content */}
          <div className="flex flex-col gap-6 items-center w-full">
            <h1 className="text-[#0f9058] text-[24px] font-bold tracking-[2.4px] text-center">
              ご登録ありがとうございます
            </h1>

            {/* Illustration */}
            <div className="bg-white flex items-center justify-center w-60 h-60"></div>

            <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
              <p>あなたのご経歴に関心を持った企業から、</p>
              <p>順次スカウトが届きます。</p>
              <p>ご自身のキャリアの可能性を広げる第一歩として、</p>
              <p>まずはマイページで情報を整理しておきましょう。</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-center text-sm">
              {error}
            </div>
          )}

          {/* Button */}
          <Button
            onClick={handleMyPageClick}
            disabled={isPending}
            variant="green-gradient"
            size="figma-default"
            className="w-full text-[16px] tracking-[1.6px] disabled:opacity-50"
          >
            {isPending ? 'ログイン中...' : 'マイページへ'}
          </Button>
        </div>
      </main>
    </>
  );
}