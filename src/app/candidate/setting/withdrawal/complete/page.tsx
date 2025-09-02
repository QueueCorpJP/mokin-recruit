'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SettingsHeader } from '@/components/settings/SettingsHeader';

export default function WithdrawalCompletePage() {
  const router = useRouter();

  const handleGoToTop = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: '退会', href: '/candidate/setting/withdrawal' },
          { label: '退会理由の選択', href: '/candidate/setting/withdrawal/reason' },
          { label: '退会完了' }
        ]}
        title="退会完了"
        icon={<img src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />
      <div
        className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-20 relative w-full"
      >
        <div
          className="bg-[#ffffff] box-border content-stretch flex flex-col gap-10 md:gap-20 items-center justify-start p-4 md:p-[40px] relative rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 w-full"
        >
          <div
            className="box-border content-stretch flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] gap-4 md:gap-6 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-center w-full"
          >
            <div
              className="relative shrink-0 text-[#0f9058] text-xl md:text-[32px] tracking-[1.6px] md:tracking-[3.2px] w-full font-bold"
            >
              <p className="block leading-[1.6] font-bold">退会完了</p>
            </div>
            <div
              className="leading-[2] relative shrink-0 text-[#323232] text-sm md:text-[16px] tracking-[1.2px] md:tracking-[1.6px] font-bold w-full"
            >
              <p className="block mb-0 font-bold">ご利用いただきありがとうございました。</p>
              <p className="block font-bold">退会が完了しました。</p>
            </div>
          </div>
        </div>
        <Button
          variant="green-gradient"
          size="figma-default"
          className="min-w-40 w-full md:w-auto font-bold py-[17px]"
          onClick={handleGoToTop}
        >
          トップページへ
        </Button>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
