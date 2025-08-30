import { getCachedCandidateUser } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import { RoomListClient } from './RoomListClient';

interface Room {
  id: string;
  type: string;
  related_job_posting_id: string | null;
  company_group_id: string | null;
  created_at: string;
  updated_at: string;
  candidate_id: string | null;
  lastMessage?: {
    content: string;
    sent_at: string;
    sender_type: string;
  };
  jobPosting?: {
    title: string;
  };
  companyGroup?: {
    group_name: string;
    company_account?: {
      company_name: string;
    };
  };
  unreadCount?: number;
}

async function getRoomsForCandidate(candidateId: string) {
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

  const roomsWithDetails = rooms?.map((room: any) => {
    const messages = room.messages || [];
    const lastMessage = messages
      .sort((a: any, b: any) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())[0];
    
    const unreadCount = messages.filter((msg: any) => 
      msg.sender_type === 'COMPANY_USER' && msg.status === 'SENT'
    ).length;

    return {
      id: room.id,
      type: room.type,
      related_job_posting_id: room.related_job_posting_id,
      company_group_id: room.company_group_id,
      created_at: room.created_at,
      updated_at: room.updated_at,
      candidate_id: room.candidate_id,
      lastMessage: lastMessage ? {
        content: lastMessage.content,
        sent_at: lastMessage.sent_at,
        sender_type: lastMessage.sender_type,
      } : undefined,
      jobPosting: room.job_posting ? {
        title: room.job_posting.title,
      } : undefined,
      companyGroup: room.company_group ? {
        group_name: room.company_group.group_name,
        company_account: room.company_group.company_account ? {
          company_name: room.company_group.company_account.company_name,
        } : undefined,
      } : undefined,
      unreadCount,
    };
  }) || [];

  return roomsWithDetails;
}

export async function RoomListServer() {
  // レイアウトで認証済みのため、キャッシュされた結果を使用
  const user = await getCachedCandidateUser();

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        ログインが必要です
      </div>
    );
  }

  const candidateId = user.id;
  const rooms = await getRoomsForCandidate(candidateId);

  if (rooms.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        メッセージはありません
      </div>
    );
  }

  return <RoomListClient initialRooms={rooms} candidateId={candidateId} />;
}