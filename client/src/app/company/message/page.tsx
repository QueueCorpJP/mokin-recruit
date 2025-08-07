import { MessageLayoutWrapper } from '@/components/message/MessageLayoutWrapper';
import { requireCompanyAuthWithSession } from '@/lib/auth/server';
import { getRooms } from '@/lib/rooms';

export default async function CompanyMessagePage() {
  // 統一的な認証チェック
  const authResult = await requireCompanyAuthWithSession();
  if (!authResult.success) {
    return (
      <div className='w-full flex flex-col items-center justify-center p-8'>
        <div className='text-red-600 text-center'>
          <h2 className='text-xl font-bold mb-2'>エラーが発生しました</h2>
          <p>{authResult.error}</p>
        </div>
      </div>
    );
  }

  const { companyUserId, fullName } = authResult.data;
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