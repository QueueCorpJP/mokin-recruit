'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthAwareNavigation } from '@/components/layout/AuthAwareNavigation';
import { AuthAwareFooter } from '@/components/layout/AuthAwareFooter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ScoutSuccessModal } from '@/components/scout/ScoutSuccessModal';

const RightArrowIcon = () => (
  <svg
    width='8'
    height='8'
    viewBox='0 0 8 8'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M6.11804 3.59656C6.34118 3.8197 6.34118 4.18208 6.11804 4.40522L2.69061 7.83264C2.46747 8.05579 2.10509 8.05579 1.88195 7.83264C1.65881 7.60951 1.65881 7.24713 1.88195 7.02399L4.90594 4L1.88374 0.976012C1.6606 0.752873 1.6606 0.390494 1.88374 0.167355C2.10688 -0.0557849 2.46926 -0.0557849 2.6924 0.167355L6.11982 3.59478L6.11804 3.59656Z'
      fill='white'
    />
  </svg>
);

const MailIcon = () => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M13.4625 6H9H6.7375H6V6.55V9V11.525V17.0875L0.0125 12.6563C0.1125 11.525 0.69375 10.475 1.61875 9.79375L3 8.76875V6C3 4.34375 4.34375 3 6 3H10.7875L13.9063 0.69375C14.5125 0.24375 15.2438 0 16 0C16.7563 0 17.4875 0.24375 18.0938 0.6875L21.2125 3H26C27.6563 3 29 4.34375 29 6V8.76875L30.3813 9.79375C31.3063 10.475 31.8875 11.525 31.9875 12.6563L26 17.0875V11.525V9V6.55V6H25.2625H23H18.5375H13.4563H13.4625ZM0 28V15.1313L13.6 25.2063C14.2938 25.7188 15.1375 26 16 26C16.8625 26 17.7063 25.725 18.4 25.2063L32 15.1313V28C32 30.2063 30.2063 32 28 32H4C1.79375 32 0 30.2063 0 28ZM11 10H21C21.55 10 22 10.45 22 11C22 11.55 21.55 12 21 12H11C10.45 12 10 11.55 10 11C10 10.45 10.45 10 11 10ZM11 14H21C21.55 14 22 14.45 22 15C22 15.55 21.55 16 21 16H11C10.45 16 10 15.55 10 15C10 14.45 10.45 14 11 14Z'
      fill='white'
    />
  </svg>
);

interface FieldRowProps {
  label: string;
  value: string;
  isIdField?: boolean;
}

function FieldRow({ label, value, isIdField = false }: FieldRowProps) {
  return (
    <div className='flex gap-6 items-center justify-start w-full'>
      <div className='bg-[#f9f9f9] rounded-[5px] min-h-[102px] px-6 w-[201px] shrink-0 flex items-center'>
        <div className="font-['Noto_Sans_JP'] font-bold text-[#323232] text-[14px] tracking-[1.2px] leading-[2]">
          {label}
        </div>
      </div>
      <div className='flex-1 flex items-center'>
        {isIdField ? (
          <div className="font-['Noto_Sans_JP'] font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2]">
            {value}
          </div>
        ) : (
          <div className="font-['Noto_Sans_JP'] font-medium text-[#323232] text-[16px] tracking-[1.6px] leading-[2]">
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

interface MultilineFieldRowProps {
  label: string;
  value: string;
}

function MultilineFieldRow({ label, value }: MultilineFieldRowProps) {
  return (
    <div className='flex gap-6 items-strech justify-start w-full'>
      <div className='bg-[#f9f9f9] rounded-[5px] min-h-[102px] px-6 w-[201px] shrink-0 flex items-center'>
        <div className="font-['Noto_Sans_JP'] font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2]">
          {label}
        </div>
      </div>
      <div className='flex-1 py-6'>
        <div className="font-['Noto_Sans_JP'] font-medium text-[#323232] text-[16px] tracking-[1.6px] leading-[2] whitespace-pre-wrap">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function ScoutCompletePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAuthenticated = !!user;
  const userType = user?.user_metadata?.userType || null;

  useEffect(() => {
    setIsLoading(false);
  }, [isAuthenticated, userType, router]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        読み込み中...
      </div>
    );
  }

  return (
    <>
      <AuthAwareNavigation />

      <div
        className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10'
        style={{
          background: 'linear-gradient(to top, #17856f, #229a4e)',
        }}
      >
        <div className='w-full max-w-[1200px] mx-auto'>
          <div className='flex items-center gap-2 mb-4'>
            <Link
              href='/company/search'
              className='text-white text-[14px] font-bold tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              候補者検索
            </Link>
            <RightArrowIcon />
            <Link
              href='/company/search/result'
              className='text-white text-[14px] font-bold tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              検索結果
            </Link>
            <RightArrowIcon />
            <Link
              href='/company/search/scout'
              className='text-white text-[14px] font-bold tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              スカウト送信
            </Link>
            <RightArrowIcon />
            <span
              className='text-white text-[14px] font-bold tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              送信内容の確認
            </span>
          </div>

          <div className='flex items-center gap-4'>
            <MailIcon />
            <h1
              className='text-white text-[24px] font-bold tracking-[2.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              スカウト送信
            </h1>
          </div>
        </div>
      </div>

      <div className='bg-[#f9f9f9] flex-1 px-20 pt-10 pb-20'>
        <div className='max-w-[1200px] mx-auto'>
          <div className='bg-white rounded-[10px] p-10'>
            <div className='flex flex-col gap-2'>
              <FieldRow label='グループ' value='テキストが入ります。' />
              <FieldRow label='添付する求人' value='テキストが入ります。' />
              <FieldRow label='スカウト送信者名' value='テキストが入ります。' />
              <FieldRow
                label='送信先候補者'
                value='候補者IDテキスト'
                isIdField
              />
              <FieldRow
                label='スカウトテンプレート'
                value='テキストが入ります。'
              />
              <FieldRow label='件名' value='テキストが入ります。' />
              <MultilineFieldRow
                label='本文'
                value={`テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。`}
              />
            </div>
          </div>

          <div className='flex justify-center gap-4 mt-10'>
            <Link href='/company/search/scout'>
              <Button
                variant='green-outline'
                size='figma-outline'
                className='min-w-[200px]'
              >
                編集画面に戻る
              </Button>
            </Link>

            <Button
              variant='green-gradient'
              size='figma-default'
              className='min-w-[200px]'
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              この内容で送信
            </Button>
          </div>
        </div>
      </div>

      <AuthAwareFooter />

      <ScoutSuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTicket={() => {
          router.push('/company/tickets/purchase');
        }}
      />
    </>
  );
}
