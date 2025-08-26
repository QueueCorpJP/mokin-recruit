import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { MessageBubble } from '@/components/admin/ui/MessageBubble';
import { ApplicationStatusSelect } from '@/components/admin/message/ApplicationStatusSelect';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { Button } from '@/components/ui/button';
import ApproveButton from './ApproveButton';

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
      logo_url?: string;
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
      logo_url?: string;
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

async function fetchNGKeywords(): Promise<string[]> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('ng_keywords')
    .select('keyword')
    .eq('is_active', true);
    
  if (error) {
    console.error('Error fetching NG keywords:', error);
    return [];
  }
  
  return data?.map(item => item.keyword) || [];
}

function containsNGWord(text: string, ngKeywords: string[]): { hasNG: boolean; ngWords: string[] } {
  if (!text || !ngKeywords.length) return { hasNG: false, ngWords: [] };
  
  const foundWords: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const keyword of ngKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      foundWords.push(keyword);
    }
  }
  
  return { hasNG: foundWords.length > 0, ngWords: foundWords };
}

function highlightNGWords(text: string, ngWords: string[]): React.ReactNode {
  if (!text || ngWords.length === 0) return text;
  
  let result = text;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  ngWords.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    const matches = [...text.matchAll(regex)];
    
    matches.forEach(match => {
      if (match.index !== undefined) {
        parts.push(text.slice(lastIndex, match.index));
        parts.push(<strong key={match.index}>{match[0]}</strong>);
        lastIndex = match.index + match[0].length;
      }
    });
  });
  
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

async function fetchMessageDetail(messageId: string): Promise<MessageDetail | null> {
  // UUIDの形式をチェック
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuidRegex.test(messageId)) {
    console.error('Invalid UUID format for message ID:', messageId);
    return null;
  }

  const supabase = getSupabaseAdminClient();
  
  try {
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
      console.error('No message data found for ID:', messageId);
      return null;
    }

    const { data: roomData } = await supabase
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

    // 企業グループ情報を取得（企業からのメッセージの場合のみ）
    let companyGroupData = null;
    if (messageData.sender_type === 'COMPANY_USER' && messageData.sender_company_group_id) {
      const result = await supabase
        .from('company_groups')
        .select(`
          group_name,
          company_account_id,
          company_accounts:company_account_id (
            id,
            company_name,
            logo_url
          )
        `)
        .eq('id', messageData.sender_company_group_id)
        .single();
      
      companyGroupData = result.data;
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

  } catch (error) {
    console.error('Exception in fetchMessageDetail:', error);
    return null;
  }
}

async function fetchRoomMessagesAroundNG(roomId: string): Promise<{ messages: RoomMessage[], ngMessageIndex: number }> {
  const supabase = getSupabaseAdminClient();
  
  // NGキーワードを取得
  const ngKeywords = await fetchNGKeywords();
  
  const { data: allMessages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('sent_at', { ascending: false });

  if (error || !allMessages) {
    return { messages: [], ngMessageIndex: -1 };
  }

  let ngMessageIndex = -1;
  let ngMessageFound = false;

  for (let i = 0; i < allMessages.length; i++) {
    const message = allMessages[i];
    const contentCheck = containsNGWord(message.content, ngKeywords);
    const subjectCheck = containsNGWord(message.subject, ngKeywords);
    
    if (contentCheck.hasNG || subjectCheck.hasNG) {
      ngMessageIndex = i;
      ngMessageFound = true;
      break;
    }
  }

  if (!ngMessageFound) {
    return { messages: [], ngMessageIndex: -1 };
  }

  const startIndex = Math.max(0, ngMessageIndex - 4);
  const endIndex = ngMessageIndex + 1;
  const relevantMessages = allMessages.slice(startIndex, endIndex);

  const messagesWithGroups = await Promise.all(
    relevantMessages.map(async (message) => {
      let processedCompanyGroupData = null;
      
      // 企業からのメッセージの場合のみ企業グループ情報を取得
      if (message.sender_type === 'COMPANY_USER' && message.sender_company_group_id) {
        const { data: companyGroupData } = await supabase
          .from('company_groups')
          .select(`
            group_name,
            company_account_id,
            company_accounts:company_account_id (
              id,
              company_name,
              logo_url
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

  return { 
    messages: messagesWithGroups.reverse(), 
    ngMessageIndex: messagesWithGroups.length - 1 - (ngMessageIndex - startIndex)
  };
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

  if (error || !data) {
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

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0] as CareerStatusEntry;
}

interface NGMessageBubbleProps {
  children: React.ReactNode;
  direction: 'left' | 'right';
  className?: string;
  isNGMessage?: boolean;
}

const NGMessageBubble: React.FC<NGMessageBubbleProps> = ({ 
  children, 
  direction, 
  className = '', 
  isNGMessage = false 
}) => {
  const baseClasses = `relative inline-block max-w-[80%] px-6 py-4 rounded-lg ${className}`;
  
  if (isNGMessage) {
    return (
      <div className={`${baseClasses} bg-gray-600 text-white`}>
        <div
          className={`absolute top-4 ${
            direction === 'left' ? '-left-2' : '-right-2'
          } w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ${
            direction === 'left'
              ? 'border-r-[10px] border-r-gray-600'
              : 'border-l-[10px] border-l-gray-600'
          }`}
        />
        {children}
      </div>
    );
  }
  
  return (
    <MessageBubble direction={direction} className={className}>
      {children}
    </MessageBubble>
  );
};

export default async function MessageDetailPage({ params }: MessageDetailPageProps) {
  const resolvedParams = await params;
  const { message_id } = resolvedParams;
  
  // NGキーワードを取得
  const ngKeywords = await fetchNGKeywords();
  
  const messageDetail = await fetchMessageDetail(message_id);

  if (!messageDetail) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mt-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">メッセージが見つかりません</h1>
            <Link href="/admin/message/pending">
              <AdminButton text="NGメッセージ一覧に戻る" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { messages: roomMessages, ngMessageIndex } = await fetchRoomMessagesAroundNG(messageDetail.room_id);

  const applicationDetail = messageDetail.rooms?.candidate_id && messageDetail.rooms?.related_job_posting_id
    ? await fetchApplicationDetail(messageDetail.rooms.candidate_id, messageDetail.rooms.related_job_posting_id)
    : null;

  const careerStatusEntry = messageDetail.rooms?.candidate_id
    ? await fetchCareerStatusEntry(messageDetail.rooms.candidate_id)
    : null;

  const validMessages = roomMessages.filter((message) => {
    const hasContent = message.content && message.content.trim().length > 0;
    const hasSubject = message.subject && message.subject.trim().length > 0;
    return hasContent || hasSubject;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl">
        
        <div className="bg-white rounded-lg mb-6">
          <h2 className="text-[24px] font-bold text-[#323232] mb-6 pb-3 border-b-3 border-[#323232]">NGワード検出メッセージ詳細</h2>
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

        <div className="bg-white rounded-lg">
          <h2 className="text-[24px] font-bold text-[#323232] mb-6 pb-3 border-b-3 border-[#323232]">NGワード検出箇所と前後のメッセージ</h2>
          <div className="space-y-6">
            {validMessages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">NGワードを含むメッセージが見つかりません</p>
              </div>
            ) : (
              validMessages.map((message, index) => {
                const hasContent = message.content && message.content.trim().length > 0;
                const hasSubject = message.subject && message.subject.trim().length > 0;
                
                if (!hasContent && !hasSubject) {
                  return null;
                }

                const contentCheck = containsNGWord(message.content || '', ngKeywords);
                const subjectCheck = containsNGWord(message.subject || '', ngKeywords);
                const isNGMessage = contentCheck.hasNG || subjectCheck.hasNG;
                const allNGWords = [...contentCheck.ngWords, ...subjectCheck.ngWords];

                const isCompany = message.sender_type === 'COMPANY_USER';
                const companyName = message.company_groups?.company_accounts?.company_name || '企業';
                const companyLogo = message.company_groups?.company_accounts?.logo_url;
                const candidateName = '候補者';

                return (
                  <div key={message.id} className={`flex gap-4 ${isCompany ? 'flex-row' : 'flex-row-reverse'} items-start`}>
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
                    
                    <div className={`flex-1 ${isCompany ? 'text-left' : 'text-right'}`}>
                      <div className="mb-1">
                        <span className="text-xs text-gray-500">
                          {new Date(message.sent_at).toLocaleString('ja-JP')}
                        </span>
                       
                      </div>
                      <NGMessageBubble 
                        className={isCompany ? '' : 'ml-auto'} 
                        direction={isCompany ? 'left' : 'right'}
                        isNGMessage={isNGMessage}
                      >
                        {hasSubject && (
                          <div className="mb-4">
                            <h4 className={`font-bold text-lg mb-2 ${isNGMessage ? 'text-white' : 'text-gray-900'}`}>件名</h4>
                            <p className={`font-['Noto_Sans_JP'] font-medium text-[16px] leading-[1.8] ${isNGMessage ? 'text-white' : 'text-[#323232]'}`}>
                              {subjectCheck.hasNG 
                                ? highlightNGWords(message.subject?.trim() || '', subjectCheck.ngWords)
                                : message.subject?.trim() || ''}
                            </p>
                          </div>
                        )}
                        {hasContent && (
                          <div>
                            <div className={`font-['Noto_Sans_JP'] font-medium text-[16px] leading-[1.8] whitespace-pre-wrap ${isNGMessage ? 'text-white' : 'text-[#323232]'}`}>
                              {contentCheck.hasNG 
                                ? highlightNGWords(message.content.trim(), contentCheck.ngWords)
                                : message.content.trim()}
                            </div>
                          </div>
                        )}
                      </NGMessageBubble>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
       <div className="flex justify-center mt-8">
         <ApproveButton messageId={message_id} />
       </div>
      </div>
    </div>
  );
}