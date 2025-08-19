'use client';

import React from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PasswordCompletePage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: 'パスワード変更', href: '/candidate/setting/password' },
          { label: '完了' }
        ]}
        title="パスワード変更"
        icon={<Image src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />
      
      <div className="px-4 md:px-20 py-10">
        <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-10">
          <div className="text-center py-20">
            <h2 className="text-[32px] font-bold text-[#0f9058] tracking-[3.2px] mb-6">
              パスワードの変更が完了しました。
            </h2>
            <p className="text-base font-bold text-[#323232] tracking-[1.6px] leading-8">
              セキュリティ向上のため、定期的な変更をおすすめします。
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-10">
          <Button
            asChild
            variant="green-gradient"
            size="figma-default"
            className="min-w-[160px] text-base tracking-[1.6px]"
          >
            <Link href="/candidate/setting">
              各種設定ページへ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}