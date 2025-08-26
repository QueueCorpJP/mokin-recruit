import { getCachedCandidateUser } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import { CandidateMessageLayout } from './CandidateMessageLayout';
import { CandidateRoom } from '@/types/candidate-message';

async function getRoomsForCandidate(candidateId: string): Promise<CandidateRoom[]> {
  const supabase = await createClient();
  
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select(`
      *,
      messages:messages(
        content,
        sent_at,
        sender_type,
        status
      ),
      job_posting:job_postings!rooms_related_job_posting_id_fkey(
        title
      ),
      company_group:company_groups!rooms_company_group_id_fkey(
        group_name,
        company_account:company_accounts!company_groups_company_account_id_fkey(
          company_name
        )
      )
    `)
    .eq('candidate_id', candidateId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }

  const candidateRooms: CandidateRoom[] = [];
  
  rooms?.forEach((room: any) => {
    const roomMessages = room.messages || [];
    const lastMessage = roomMessages
      .sort((a: any, b: any) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())[0];
    
    const unreadCount = roomMessages.filter((msg: any) => 
      msg.sender_type === 'COMPANY_USER' && msg.status === 'SENT'
    ).length;
    
    candidateRooms.push({
      id: room.id,
      companyGroupId: room.company_group_id || '',
      companyName: room.company_group?.company_account?.company_name || '企業名未設定',
      groupName: room.company_group?.group_name || 'グループ未設定',
      jobTitle: room.job_posting?.title || '求人情報なし',
      jobPostingId: room.related_job_posting_id || '',
      lastMessage: lastMessage?.content || '',
      lastMessageTime: lastMessage ? new Date(lastMessage.sent_at).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '/') : '',
      unreadCount: unreadCount,
      isUnread: unreadCount > 0,
    });
  });

  return candidateRooms;
}

export default async function CandidateMessageLayoutServer() {
  // レイアウトで認証済みのため、キャッシュされた結果を使用
  const user = await getCachedCandidateUser();

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        ログインが必要です
      </div>
    );
  }

  const rooms = await getRoomsForCandidate(user.id);

  return <CandidateMessageLayout rooms={rooms} candidateId={user.id} />;
}