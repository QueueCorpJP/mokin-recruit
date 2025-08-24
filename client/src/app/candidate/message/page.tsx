import { requireCandidateAuth } from '@/lib/auth/server';
import { getRooms } from '@/lib/rooms';
import { MessageLayoutWrapper } from '@/components/message/MessageLayoutWrapper';

export default async function MessagePage({
  searchParams
}: {
  searchParams: Promise<{ room?: string }>
}) {
  const user = await requireCandidateAuth();
  const params = await searchParams;

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        ログインが必要です
      </div>
    );
  }

  console.log('🔍 [CANDIDATE PAGE] Auth success:', { 
    candidateId: user.id,
    fullName: user.name,
    userType: 'candidate'
  });

  const rooms = await getRooms(user.id, 'candidate');
  
  console.log('🔍 [CANDIDATE PAGE] Rooms returned:', { 
    roomsCount: rooms.length,
    rooms: rooms.map(r => ({
      id: r.id,
      candidateName: r.candidateName,
      companyName: r.companyName,
      groupName: r.groupName,
      jobTitle: r.jobTitle
    }))
  });
  
  // 候補者の名前を取得
  const candidateName = user.name || '候補者';

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
