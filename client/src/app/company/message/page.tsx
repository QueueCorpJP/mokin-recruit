import { MessageLayoutWrapper } from '@/components/message/MessageLayoutWrapper';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { getRooms } from '@/lib/rooms';

export default async function CompanyMessagePage() {
  // レイアウトで認証済みのため、キャッシュされた結果を使用
  const user = await getCachedCompanyUser();
  if (!user) {
    throw new Error('Authentication required');
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