'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Client Component (インタラクティブ機能)
export function ResetPasswordCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<'candidate' | 'company' | null>(null);

  useEffect(() => {
    // URLパラメータからユーザータイプを取得
    const detectedUserType = searchParams.get('userType') as 'candidate' | 'company';
    if (detectedUserType === 'candidate' || detectedUserType === 'company') {
      setUserType(detectedUserType);
    }
  }, [searchParams]);

  const handleLoginRedirect = () => {
    // ユーザータイプに応じてリダイレクト先を決定
    switch (userType) {
      case 'candidate':
        router.push('/candidate/auth/login');
        break;
      case 'company':
        router.push('/company/auth/login');
        break;
      default:
        router.push('/auth/login');
    }
  };

  if (userType === 'candidate') {
    // 候補者用のデザイン（丸みを帯びたデザイン）
    return (
      <div className='flex flex-col items-center relative w-full h-auto bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
        <div className='flex flex-col gap-6 md:gap-10 items-center justify-start relative w-full max-w-[480px] md:max-w-[800px] mx-auto px-6 md:px-20 py-10 md:py-20'>
          {/* 見出し+説明 */}
          <div className='flex flex-col gap-4 md:gap-6 items-center justify-start text-center w-full'>
            <div className='text-[#0f9058] text-[24px] md:text-[32px] tracking-[2.4px] md:tracking-[3.2px] w-full'>
              <p className='block leading-[1.6] font-bold font-[family-name:var(--font-noto-sans-jp)]'>パスワードの再設定</p>
            </div>
            <div className='text-[#323232] text-[14px] md:text-[16px] tracking-[1.4px] md:tracking-[1.6px] w-full font-bold font-[family-name:var(--font-noto-sans-jp)]'>
              <p className='block mb-0 leading-[2]'>パスワードの再設定が完了しました。</p>
              <p className='block leading-[2]'>セキュリティのため、定期的な変更をおすすめします。</p>
            </div>
          </div>
          
          {/* ログインボタン */}
          <div className='box-border content-stretch flex flex-row gap-2.5 items-center justify-center w-full max-w-[280px] sm:max-w-[313px] md:min-w-40 px-6 sm:px-10 py-3 md:py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 bg-[#0F9058] cursor-pointer hover:bg-[#0D7A4A] transition-colors'
               onClick={handleLoginRedirect}>
            <div className='font-[family-name:var(--font-noto-sans-jp)] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[0px] text-center text-nowrap tracking-[1.4px] md:tracking-[1.6px]'>
              <p className='block font-bold leading-[1.6] text-[14px] md:text-[16px] whitespace-pre'>
                ログインページへ
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 企業用または不明なユーザータイプの場合（従来のデザイン）
  return (
    <div className='flex flex-col items-center relative w-full h-auto bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
      <div className='flex flex-col gap-10 items-center justify-start relative w-full max-w-[800px] mx-auto px-20 py-20'>
        {/* 見出し+説明 */}
        <div className='flex flex-col gap-6 items-center justify-start text-center w-full'>
          <div className='text-[#0f9058] text-[32px] tracking-[3.2px] w-full'>
            <p className='block leading-[1.6] font-bold font-[family-name:var(--font-noto-sans-jp)]'>パスワードの再設定</p>
          </div>
          <div className='text-[#323232] text-[16px] tracking-[1.6px] w-full font-bold font-[family-name:var(--font-noto-sans-jp)]'>
            <p className='block mb-0 leading-[2]'>パスワードの再設定が完了しました。</p>
            <p className='block leading-[2]'>セキュリティのため、定期的な変更をおすすめします。</p>
          </div>
        </div>
        
        {/* ログインボタン */}
        <div className='box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-40 px-10 py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 bg-[#0F9058] cursor-pointer hover:bg-[#0D7A4A] transition-colors'
             onClick={handleLoginRedirect}>
          <div className='font-[family-name:var(--font-noto-sans-jp)] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[0px] text-center text-nowrap tracking-[1.6px]'>
            <p className='block font-bold leading-[1.6] text-[16px] whitespace-pre'>
              ログインページへ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
