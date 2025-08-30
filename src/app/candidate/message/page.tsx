import { Suspense } from 'react';
import { getCachedCandidateUser } from '@/lib/auth/server';
import { getRooms } from '@/lib/rooms';
import { MessageLayoutWrapper } from '@/components/message/MessageLayoutWrapper';

export const dynamic = 'force-dynamic';

// データ取得を行うサーバーコンポーネント
async function MessageServerComponent({
  searchParams
}: {
  searchParams: Promise<{ room?: string }>
}) {
  const user = await getCachedCandidateUser();
  const params = await searchParams;

  if (!user) {
    // SSRレイアウトで未ログインはリダイレクト済みのため、ここに来た場合は安全にフォールバック
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        ログインが必要です
      </div>
    );
  }

  const rooms = await getRooms(user.id, 'candidate');
  
  return (
    <div className='flex flex-col bg-white'>
      <div style={{ flex: '0 0 85vh', height: '85vh' }}>
        <MessageLayoutWrapper 
          rooms={rooms}
          userId={user.id}
          userType="candidate"
          initialRoomId={params.room}
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

export default function MessagePage({
  searchParams
}: {
  searchParams: Promise<{ room?: string }>
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MessageServerComponent searchParams={searchParams} />
    </Suspense>
  );
}