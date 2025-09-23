import React from 'react';
import Link from 'next/link';
import { AdminButton } from '@/components/admin/ui/AdminButton';

interface DeleteCompletePageProps {
  searchParams: {
    name?: string;
  };
}

export default function DeleteCompletePage({
  searchParams,
}: DeleteCompletePageProps) {
  const industryName = searchParams.name || 'オリジナル業種';

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg p-8 text-center'>
          <p className="font-['Noto_Sans_JP'] font-medium text-[16px] text-[#323232] tracking-[1.6px] leading-[2] mb-8">
            オリジナル業種の削除が完了しました。
          </p>

          <Link href='/admin/industry'>
            <AdminButton
              text='オリジナル業種一覧に戻る'
              variant='primary'
              size='figma-default'
              className='w-[298px] h-[54px] text-base'
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
