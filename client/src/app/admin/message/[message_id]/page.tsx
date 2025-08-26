import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { MessageBubble } from '@/components/admin/ui/MessageBubble';
import { ApplicationStatusSelect } from '@/components/admin/message/ApplicationStatusSelect';
import { AdminButton } from '@/components/admin/ui/AdminButton';

interface MessageDetailPageProps {
  params: {
    message_id: string;
  };
}

interface MessageDetail {
  id: string;
  content: string;
  subject: string | null;
  message_type: string;
  sender_type: string;
  sent_at: string;
  room_id: string;
  company_groups: {
    group_name: string;
    company_account_id: string;
    company_accounts: {
      id: string;
      company_name: string;
    } | null;
  } | null;
  rooms: {
    candidate_id: string;
    related_job_posting_id: string;
    job_postings: {
      id: string;
      title: string;
    } | null;
  } | null;
}

interface RoomMessage {
  id: string;
  content: string;
  subject: string | null;
  message_type: string;
  sender_type: string;
  sent_at: string;
  company_groups: {
    group_name: string;
    company_account_id: string;
    company_accounts: {
      id: string;
      company_name: string;
    } | null;
  } | null;
}

interface ApplicationDetail {
  status: string;
  created_at: string;
  updated_at: string;
  application_message: string | null;
}

interface CareerStatusEntry {
  candidate_id: string;
  company_name: string | null;
  department: string | null;
  position: string | null;
  employment_type: string | null;
  monthly_salary: number | null;
  progress_status: string | null;
  decline_reason: string | null;
  created_at: string;
  updated_at: string;
}

// DisplayValueコンポーネント定義
const DisplayValue: React.FC<{ value: string; className?: string }> = ({
  value,
  className = '',
}) => (
  <div
    className={`font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] ${className}`}
  >
    {value || '不明'}
  </div>
);

async function fetchMessageDetail(messageId: string): Promise<MessageDetail | null> {
  const supabase = getSupabaseAdminClient();
  
  console.log('Fetching message with ID:', messageId);
  
  // まず基本的なメッセージ情報を取得
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single();

  if (messageError) {
    console.error('Error fetching basic message:', JSON.stringify(messageError, null, 2));
    return null;
  }

  if (!messageData) {
    console.error('No message data found');
    return null;
  }

  // 関連するルーム情報を取得
  const { data: roomData, error: roomError } = await supabase
    .from('rooms')
    .select(`
      candidate_id,
      related_job_posting_id,
      job_postings:related_job_posting_id (
        id,
        title
      )
    `)
    .eq('id', messageData.room_id)
    .single();

  if (roomError) {
    console.warn('Warning: Could not fetch room data:', roomError);
  }

  // 企業グループ情報を取得（企業からのメッセージの場合のみ）
  let companyGroupData = null;
  let companyGroupError = null;
  
  if (messageData.sender_type === 'COMPANY_USER' && messageData.sender_company_group_id) {
    const result = await supabase
      .from('company_groups')
      .select(`
        group_name,
        company_account_id,
        company_accounts:company_account_id (
          id,
          company_name
        )
      `)
      .eq('id', messageData.sender_company_group_id)
      .single();
    
    companyGroupData = result.data;
    companyGroupError = result.error;
    
    if (companyGroupError) {
      console.warn('Warning: Could not fetch company group data:', companyGroupError);
    }
  }

  const processedRoomData = roomData ? {
    candidate_id: roomData.candidate_id,
    related_job_posting_id: roomData.related_job_posting_id,
    job_postings: Array.isArray(roomData.job_postings) 
      ? roomData.job_postings[0] || null 
      : roomData.job_postings
  } : null;

  const processedCompanyGroupData = companyGroupData ? {
    group_name: companyGroupData.group_name,
    company_account_id: companyGroupData.company_account_id,
    company_accounts: Array.isArray(companyGroupData.company_accounts)
      ? companyGroupData.company_accounts[0] || null
      : companyGroupData.company_accounts
  } : null;

  return {
    ...messageData,
    rooms: processedRoomData,
    company_groups: processedCompanyGroupData
  } as MessageDetail;
}

async function fetchRoomMessages(roomId: string, limit: number = 5): Promise<RoomMessage[]> {
  const supabase = getSupabaseAdminClient();
  
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('sent_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching room messages:', error);
    return [];
  }

  if (!messages) {
    return [];
  }

  // 各メッセージに対して企業グループ情報を取得（企業からのメッセージのみ）
  const messagesWithGroups = await Promise.all(
    messages.map(async (message) => {
      let processedCompanyGroupData = null;
      
      // 企業からのメッセージで company_group_id がある場合のみ企業グループ情報を取得
      if (message.sender_type === 'COMPANY_USER' && message.sender_company_group_id) {
        const { data: companyGroupData } = await supabase
          .from('company_groups')
          .select(`
            group_name,
            company_account_id,
            company_accounts:company_account_id (
              id,
              company_name
            )
          `)
          .eq('id', message.sender_company_group_id)
          .single();

        processedCompanyGroupData = companyGroupData ? {
          group_name: companyGroupData.group_name,
          company_account_id: companyGroupData.company_account_id,
          company_accounts: Array.isArray(companyGroupData.company_accounts)
            ? companyGroupData.company_accounts[0] || null
            : companyGroupData.company_accounts
        } : null;
      }

      return {
        ...message,
        company_groups: processedCompanyGroupData
      } as RoomMessage;
    })
  );

  return messagesWithGroups;
}

async function fetchApplicationDetail(candidateId: string, jobPostingId: string | null): Promise<ApplicationDetail | null> {
  if (!jobPostingId) {
    return null;
  }
  
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('application')
    .select('status, created_at, updated_at, application_message')
    .eq('candidate_id', candidateId)
    .eq('job_posting_id', jobPostingId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching application detail:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return data as ApplicationDetail;
}

async function fetchCareerStatusEntry(candidateId: string): Promise<CareerStatusEntry | null> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('career_status_entries')
    .select('*')
    .eq('candidate_id', candidateId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching career status entry:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0] as CareerStatusEntry;
}

export default async function MessageDetailPage({ params }: MessageDetailPageProps) {
  const resolvedParams = await params;
  const { message_id } = resolvedParams;
  console.log('Page params:', resolvedParams);
  console.log('Message ID from params:', message_id);
  
  // pendingの場合はリダイレクト
  if (message_id === 'pending') {
    redirect('/admin/message-moderation/ng-keywords');
  }
  
  const messageDetail = await fetchMessageDetail(message_id);

  if (!messageDetail) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mt-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">メッセージが見つかりません</h1>
            <Link href="/admin/message">
              <AdminButton text="メッセージ一覧に戻る" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const roomMessages = await fetchRoomMessages(messageDetail.room_id, 10);

  const applicationDetail = messageDetail.rooms?.candidate_id && messageDetail.rooms?.related_job_posting_id
    ? await fetchApplicationDetail(messageDetail.rooms.candidate_id, messageDetail.rooms.related_job_posting_id)
    : null;

  const careerStatusEntry = messageDetail.rooms?.candidate_id
    ? await fetchCareerStatusEntry(messageDetail.rooms.candidate_id)
    : null;

  const statusMap: Record<string, string> = {
    SENT: '書類提出',
    read: '書類確認済み',
    RESPONDED: '面接調整中',
    REJECTED: '不採用',
  };

  const messageTypeMap: Record<string, string> = {
    SCOUT: 'スカウト',
    APPLICATION: '応募',
    GENERAL: '一般',
  };

  // フィルタリングロジックを追加
  const validMessages = roomMessages.reverse().filter((message) => {
    const hasContent = message.content && message.content.trim().length > 0;
    const hasSubject = message.subject && message.subject.trim().length > 0;
    return hasContent || hasSubject;
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl">
        
        {/* メッセージ詳細情報 */}
        <div className="mb-6">
          <h2 className="text-[24px] font-bold text-[#323232] mb-6 pb-3 border-b-3 border-[#323232]">メッセージ情報</h2>
          <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-2'>
            <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
              <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                企業名
              </div>
            </div>
            <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
              <DisplayValue value={messageDetail.company_groups?.company_accounts?.company_name || '不明'} />
            </div>
          </div>
          {/* 候補者名 */}
          <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-2'>
            <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
              <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                候補者名
              </div>
            </div>
            <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
              <DisplayValue 
                value={`候補者ID: ${messageDetail.rooms?.candidate_id || '不明'}`}
              />
            </div>
          </div>

          {/* 求人タイトル */}
          {messageDetail.rooms?.job_postings && (
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-2'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  求人タイトル
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                <DisplayValue value={messageDetail.rooms.job_postings.title} />
              </div>
            </div>
          )}

          {/* 求人ID */}
          {messageDetail.rooms?.job_postings && (
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-2'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  求人ID
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                <DisplayValue value={messageDetail.rooms.job_postings.id} />
              </div>
            </div>
          )}

          {/* 転職活動状況 */}
          {careerStatusEntry && (
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-2'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  転職活動状況
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                <DisplayValue value={careerStatusEntry.progress_status || '未設定'} />
              </div>
            </div>
          )}

          {/* 会社名（転職先） */}
          {careerStatusEntry && careerStatusEntry.company_name && (
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-2'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  転職先企業
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                <DisplayValue value={careerStatusEntry.company_name} />
              </div>
            </div>
          )}

          {/* 部署 */}
          {careerStatusEntry && careerStatusEntry.department && (
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-2'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  部署
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                <DisplayValue value={careerStatusEntry.department} />
              </div>
            </div>
          )}

          {/* 選考状況変更 */}
          {applicationDetail && messageDetail.rooms && (
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-2'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  選考状況変更
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                <ApplicationStatusSelect 
                  candidateId={messageDetail.rooms.candidate_id}
                  jobPostingId={messageDetail.rooms.related_job_posting_id}
                  currentStatus={applicationDetail.status}
                />
              </div>
            </div>
          )}
        </div>

        {/* メッセージ履歴 */}
        <div>
          <h2 className="text-[24px] font-bold text-[#323232] mb-6 pb-3 border-b-3 border-[#323232]">メッセージ詳細</h2>
          <div className="space-y-6">
            {validMessages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">メッセージが見つかりません</p>
              </div>
            ) : (
              validMessages.map((message) => {
                const hasContent = message.content && message.content.trim().length > 0;
                const hasSubject = message.subject && message.subject.trim().length > 0;
                
                if (!hasContent && !hasSubject) {
                  return null;
                }

                const isCompany = message.sender_type === 'COMPANY_USER';
                const companyName = message.company_groups?.company_accounts?.company_name || '企業';
                const companyLogo = (message.company_groups?.company_accounts as any)?.logo_url;
                const candidateName = '候補者';

                return (
                  <div key={message.id} className={`flex gap-4 ${isCompany ? 'flex-row' : 'flex-row-reverse'} items-start`}>
                    {/* アイコンと名前 */}
                    <div className="flex-shrink-0 flex flex-col items-center mt-2">
                      {isCompany && companyLogo ? (
                        <img 
                          src={companyLogo} 
                          alt={companyName}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                          isCompany 
                            ? 'bg-black text-white' 
                            : 'bg-white text-black border border-black'
                        }`}>
                          {isCompany ? '企' : '求'}
                        </div>
                      )}
                      <span className="text-xs text-gray-600 font-medium mt-1 text-center">
                        {isCompany ? companyName : candidateName}
                      </span>
                    </div>
                    
                    {/* メッセージ */}
                    <div className={`flex-1 ${isCompany ? 'text-left' : 'text-right'}`}>
                      <div className="mb-1">
                        <span className="text-xs text-gray-500">
                          {new Date(message.sent_at).toLocaleString('ja-JP')}
                        </span>
                      </div>
                      <MessageBubble 
                        className={isCompany ? '' : 'ml-auto'} 
                        direction={isCompany ? 'left' : 'right'}
                      >
                        {hasSubject && (
                          <div className="mb-4">
                            <h4 className="font-bold text-lg text-gray-900 mb-2">件名</h4>
                            <p className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[1.8] text-[#323232]">
                              {message.subject?.trim()}
                            </p>
                          </div>
                        )}
                        {hasContent && (
                          <div>
                            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[1.8] text-[#323232] whitespace-pre-wrap">
                              {message.content.trim()}
                            </div>
                          </div>
                        )}
                      </MessageBubble>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
       
      </div>
    </div>
  );
}