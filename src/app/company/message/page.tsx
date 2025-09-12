import { Suspense } from 'react';
import { MessageLayoutWrapper } from '@/components/message/MessageLayoutWrapper';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { getRooms } from '@/lib/rooms';
import { getJobOptions } from '@/lib/server/candidate/recruitment-queries';

interface MessagePageProps {
  searchParams: Promise<{ room?: string }>;
}

// データ取得を行うサーバーコンポーネント
async function MessageServerComponent({
  searchParams
}: {
  searchParams: Promise<{ room?: string }>
}) {
  const auth = await requireCompanyAuthForAction();
  const params = await searchParams;

  if (!auth.success) {
    return (
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }

  const companyUserId = auth.data.companyUserId;
  const fullName = '';
  console.log('🔍 [STEP 1] Auth success:', { 
    companyUserId, 
    fullName,
    roomId: params.room,
    userType: 'company'
  });
  
  const [rooms, jobOptions] = await Promise.all([
    getRooms(companyUserId, 'company'),
    getJobOptions()
  ]);
  
  console.log('🔍 [STEP 2] Rooms returned:', { 
    roomsCount: rooms.length,
    initialRoomId: params.room,
    rooms: rooms.map(r => ({
      id: r.id,
      candidateName: r.candidateName,
      companyName: r.companyName,
      groupName: r.groupName,
      jobTitle: r.jobTitle
    }))
  });

  return (
    <div className='flex flex-col bg-white'>
      <div style={{ flex: '0 0 85vh', height: '85vh' }}>
        <MessageLayoutWrapper 
          rooms={rooms} 
          userId={companyUserId}
          userType="company"
          companyUserName={fullName}
          initialRoomId={params.room}
          jobOptions={jobOptions}
        />
      </div>
    </div>
  );
}

// ローディング中の表示
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-[#0f9058] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-[#323232] text-lg font-medium">メッセージを読み込み中...</p>
      </div>
    </div>
  );
}

export default function CompanyMessagePage({ searchParams }: MessagePageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MessageServerComponent searchParams={searchParams} />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
