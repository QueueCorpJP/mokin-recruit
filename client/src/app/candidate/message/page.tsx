import { requireCandidateAuth } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import { MessageLayout } from '@/components/message/MessageLayout';
import { type Message } from '@/components/message/MessageList';

async function getRoomsForCandidate(candidateId: string): Promise<Message[]> {
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
      job_posting:job_postings!related_job_posting_id(
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

  const messages: Message[] = [];
  
  rooms?.forEach((room: any) => {
    const roomMessages = room.messages || [];
    const lastMessage = roomMessages
      .sort((a: any, b: any) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())[0];
    
    const unreadCount = roomMessages.filter((msg: any) => 
      msg.sender_type === 'COMPANY_USER' && msg.status === 'SENT'
    ).length;
    
    messages.push({
      id: room.id,
      timestamp: room.created_at ? new Date(room.created_at).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '/') : '',
      isUnread: unreadCount > 0,
      companyName: room.company_group?.company_account?.company_name || '企業名未設定',
      candidateName: '', // 候補者側では不要
      messagePreview: lastMessage?.content || '',
      groupName: room.company_group?.group_name || 'グループ未設定',
      jobTitle: room.job_posting?.title || '求人情報なし',
    });
  });

  return messages;
}

export default async function MessagePage() {
  const user = await requireCandidateAuth();

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        ログインが必要です
      </div>
    );
  }

  const messages = await getRoomsForCandidate(user.id);
  
  // 候補者の名前を取得
  const candidateName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '候補者';

  return (
    <div className='flex flex-col bg-white'>
      <div style={{ flex: '0 0 85vh', height: '85vh' }}>
        <MessageLayout 
          messages={messages}
          isCandidatePage={true}
          candidateId={user.id}
          candidateName={candidateName}
        />
      </div>
    </div>
  );
}
