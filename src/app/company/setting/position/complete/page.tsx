'use client';

import React from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function PositionCompletePage() {
  return (
    <div className='min-h-screen bg-[#f9f9f9]'>
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/company/setting' },
          { label: '部署・役職変更', href: '/company/setting/position' },
        ]}
        title='部署・役職変更完了'
        icon={
          <Image src='/images/setting.svg' alt='設定' width={32} height={32} />
        }
      />

      <div className='px-4 md:px-20 py-10'>
        <div className='bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-4 py-[24px] md:py-[40px]'>
          <div className='text-center'>
            <h2 className='text-xl md:text-[32px] font-bold text-[#0f9058] tracking-[1.8px] md:tracking-[3.2px] mb-4 md:mb-6'>
              部署・役職の変更が完了しました。
            </h2>
            <p className='text-sm md:text-base font-bold text-[#323232] tracking-[1.2px] md:tracking-[1.6px] leading-6 md:leading-8'>
              候補者には変更後の情報が表示されます。
            </p>
          </div>
        </div>

        <div className='flex justify-center mt-10'>
          <Button
            asChild
            variant='green-gradient'
            size='figma-default'
            className='min-w-[140px] py-[19px] md:min-w-[160px] text-sm md:text-base tracking-[1.2px] md:tracking-[1.6px] w-full md:w-auto'
          >
            <Link href='/company/setting'>各種設定ページへ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
