import { Suspense } from 'react';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { getRooms } from '@/lib/rooms';
import { getJobOptions } from '@/lib/server/candidate/recruitment-queries';
import dynamic from 'next/dynamic';

const MessageLayoutWrapper = dynamic(
  () =>
    import('@/components/message/MessageLayoutWrapper').then(mod => ({
      default: mod.MessageLayoutWrapper,
    })),
  {
    loading: () => (
      <div className='flex flex-col bg-white'>
        <div style={{ flex: '0 0 85vh', height: '85vh' }}>
          <div className='h-full flex'>
            <div className='w-80 bg-gray-50 border-r border-gray-50 animate-pulse'>
              <div className='p-4'>
                <div className='h-6 bg-gray-200 rounded mb-4'></div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className='h-16 bg-gray-200 rounded mb-2'></div>
                ))}
              </div>
            </div>
            <div className='flex-1 flex flex-col animate-pulse'>
              <div className='h-16 bg-gray-100 border-b border-gray-50'></div>
              <div className='flex-1 p-4'>
                <div className='space-y-2'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className='h-4 bg-gray-200 rounded w-3/4'
                    ></div>
                  ))}
                </div>
              </div>
              <div className='h-16 bg-gray-100 border-t border-gray-50'></div>
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

interface MessagePageProps {
  searchParams: Promise<{ room?: string }>;
}

// データ取得を行うサーバーコンポーネント
async function MessageServerComponent({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const auth = await requireCompanyAuthForAction();
  const params = await searchParams;

  if (!auth.success) {
    return (
      <div className='flex flex-col bg-white'>
        <div style={{ flex: '0 0 85vh', height: '85vh' }}>
          <div className='h-full flex items-center justify-center'>
            <p>認証が必要です。</p>
          </div>
        </div>
      </div>
    );
  }

  const companyUserId = auth.data.companyUserId;
  const fullName = '';

  const [rooms, jobOptions] = await Promise.all([
    getRooms(companyUserId, 'company'),
    getJobOptions(),
  ]);

  return (
    <div className='flex flex-col bg-white'>
      <div style={{ flex: '0 0 85vh', height: '85vh' }}>
        <MessageLayoutWrapper
          rooms={rooms}
          userId={companyUserId}
          userType='company'
          companyUserName={fullName}
          initialRoomId={params.room}
          jobOptions={jobOptions}
        />
      </div>
    </div>
  );
}

export default function CompanyMessagePage({ searchParams }: MessagePageProps) {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col bg-white'>
          <div style={{ flex: '0 0 85vh', height: '85vh' }}>
            <div className='h-full flex'>
              <div className='w-80 bg-gray-50 border-r border-gray-50 animate-pulse'>
                <div className='p-4'>
                  <div className='h-6 bg-gray-200 rounded mb-4'></div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className='h-16 bg-gray-200 rounded mb-2'
                    ></div>
                  ))}
                </div>
              </div>
              <div className='flex-1 flex flex-col animate-pulse'>
                <div className='h-16 bg-gray-100 border-b border-gray-50'></div>
                <div className='flex-1 p-4'>
                  <div className='space-y-2'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className='h-4 bg-gray-200 rounded w-3/4'
                      ></div>
                    ))}
                  </div>
                </div>
                <div className='h-16 bg-gray-100 border-t border-gray-50'></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <MessageServerComponent searchParams={searchParams} />
    </Suspense>
  );
}
