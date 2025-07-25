'use client';

import { useRouter } from 'next/navigation';

// Client Component (インタラクティブ機能)
export function ResetPasswordCompleteContent() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  return (
    <div className='box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-40 px-10 py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 bg-[#0F9058] cursor-pointer hover:bg-[#0D7A4A] transition-colors'
         onClick={handleLoginRedirect}>
      <div className='font-[family-name:var(--font-noto-sans-jp)] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[0px] text-center text-nowrap tracking-[1.6px]'>
        <p className='block font-bold leading-[1.6] text-[16px] whitespace-pre'>
          ログインページへ
        </p>
      </div>
    </div>
  );
}
