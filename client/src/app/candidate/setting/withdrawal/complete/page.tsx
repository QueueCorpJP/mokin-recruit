'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function WithdrawalCompletePage() {
  const router = useRouter();

  const handleGoToTop = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div
        className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-20 relative w-full"
      >
        <div
          className="bg-[#ffffff] box-border content-stretch flex flex-col gap-20 items-center justify-start p-[40px] relative rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 w-full max-w-4xl"
        >
          <div
            className="box-border content-stretch flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] gap-6 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-center w-full"
          >
            <div
              className="relative shrink-0 text-[#0f9058] text-[32px] tracking-[3.2px] w-full"
            >
              <p className="block leading-[1.6]">退会完了</p>
            </div>
            <div
              className="leading-[2] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] font-medium w-full font-medium"
            >
              <p className="block mb-0">ご利用いただきありがとうございました。</p>
              <p className="block">退会が完了しました。</p>
            </div>
          </div>
        </div>
        <Button
          variant="green-gradient"
          size="figma-default"
          className="min-w-40"
          onClick={handleGoToTop}
        >
          トップページへ
        </Button>
      </div>
    </div>
  );
}