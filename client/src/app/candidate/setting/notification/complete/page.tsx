'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import Image from 'next/image';

export default function NotificationComplePage() {
  const router = useRouter();

  const handleGoToSettings = () => {
    router.push('/candidate/setting');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: '通知メール設定変更', href: '/candidate/setting/notification' }
        ]}
        title="通知メール設定変更"
        icon={<Image src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />
      <div
        className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-20 relative w-full"
      >
        <div
          className="bg-[#ffffff] box-border content-stretch flex flex-col gap-10 md:gap-20 items-center justify-start p-4 md:p-[40px] relative rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 w-full max-w-4xl"
        >
          <div
            className="box-border content-stretch flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] gap-4 md:gap-6 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-center w-full"
          >
            <div
              className="relative shrink-0 text-[#0f9058] text-xl md:text-[32px] tracking-[1.8px] md:tracking-[3.2px] w-full"
            >
              <p className="leading-[1.6] font-bold">
                <span>通知メール配信設定</span>
                <span>の変更が完了しました。</span>
              </p>
            </div>
            <div
              className="relative shrink-0 text-[#323232] text-sm md:text-[16px] tracking-[1.2px] md:tracking-[1.6px] w-full"
            >
              <p className="block leading-[2] font-medium">設定の反映までは時間がかかる場合があります。</p>
            </div>
          </div>
        </div>
        <Button
          variant="green-gradient"
          size="figma-square"
          className="min-w-[140px] md:min-w-40 rounded-full py-[17px] w-full md:w-auto text-sm md:text-base"
          onClick={handleGoToSettings}
        >
          各種設定ページへ
        </Button>
      </div>
    </div>
  );
}