'use client';

import Link from 'next/link';
import { AdminButton } from '@/components/admin/ui/AdminButton';

export default function AdminJobNewCompletePage() {
  return (
    <div className='p-8 bg-white min-h-screen'>
      <div className='max-w-5xl mx-auto'>
        <div className='w-full flex flex-col items-center mt-14'>
          <p
            className='mb-10 text-[14px] font-bold'
            style={{
              color: '#323232',
              fontFamily: 'Inter, \"Noto Sans JP\", sans-serif',
            }}
          >
            求人の作成が完了しました。
          </p>

          <div className='flex justify-center gap-6'>
            <Link href='/admin/job'>
              <AdminButton
                text='求人一覧'
                variant='green-outline'
                size='figma-outline'
                className='px-12 py-4 rounded-[32px] min-w-[160px] text-base font-bold'
              />
            </Link>
            <Link href='/admin'>
              <AdminButton
                text='管理画面トップ'
                variant='green-gradient'
                size='figma-default'
                className='px-12 py-4 rounded-[32px] text-base font-bold'
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
