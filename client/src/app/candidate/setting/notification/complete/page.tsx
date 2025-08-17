'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotificationComplePage() {
  const router = useRouter();

  const handleGoToSettings = () => {
    router.push('/candidate/setting');
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
              <p className="leading-[1.6]">
                <span>通知設定を変更しました。</span>
                <span>アプリを再起動して、設定を確認してください。</span>
              </p>
            </div>
            <div 
              className="relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] font-medium w-full"
            >
              <p className="block leading-[2]">通知設定に関わらず、求人への応募は可能です。</p>
            </div>
          </div>
        </div>
        <Button
          variant="green-gradient"
          size="figma-square"
          className="min-w-40"
          onClick={handleGoToSettings}
        >
          各種設定ページへ
        </Button>
      </div>
    </div>
  );
}