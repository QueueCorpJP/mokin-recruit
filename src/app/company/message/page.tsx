import { Suspense } from 'react';
import { MessageLayoutWrapper } from '@/components/message/MessageLayoutWrapper';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { getRooms } from '@/lib/rooms';

// データ取得を行うサーバーコンポーネント
async function MessageServerComponent() {
  // 親レイアウト（CompanyLayoutClient）で認証処理が統一されているため、
  // ここでは認証チェックを削除
  const user = await getCachedCompanyUser();
  if (!user) {
    return (
      <div className='flex flex-col bg-white min-h-screen items-center justify-center'>
        <p>認証が必要です。</p>
      </div>
    );
  }

  const companyUserId = user.id;
  const fullName = user.name || '';
  console.log('🔍 [STEP 1] Auth success:', { 
    companyUserId, 
    fullName,
    userType: 'company'
  });
  
  const rooms = await getRooms(companyUserId, 'company');
  console.log('🔍 [STEP 2] Rooms returned:', { 
    roomsCount: rooms.length,
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

export default function CompanyMessagePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MessageServerComponent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
