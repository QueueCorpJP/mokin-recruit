'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

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

interface RoomListClientProps {
  initialRooms: Room[];
  candidateId: string;
}

export function RoomListClient({ initialRooms, candidateId }: RoomListClientProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCompany, setSearchCompany] = useState('');

  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase.channel('room-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `room_id=in.(${rooms.map(r => r.id).join(',')})`,
        },
        async () => {
          const { data: updatedRooms } = await supabase
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

          if (updatedRooms) {
            const roomsWithDetails = updatedRooms.map((room: any) => {
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
            });

            setRooms(roomsWithDetails);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [candidateId, rooms]);

  const filteredRooms = rooms.filter((room) => {
    const companyName = room.companyGroup?.company_account?.company_name || '';
    const jobTitle = room.jobPosting?.title || '';
    const messageContent = room.lastMessage?.content || '';
    
    const matchesCompany = searchCompany ? 
      companyName.toLowerCase().includes(searchCompany.toLowerCase()) : true;
    const matchesKeyword = searchKeyword ? 
      (jobTitle.toLowerCase().includes(searchKeyword.toLowerCase()) ||
       messageContent.toLowerCase().includes(searchKeyword.toLowerCase())) : true;
    
    return matchesCompany && matchesKeyword;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return '昨日';
    } else if (diffDays < 7) {
      return `${diffDays}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="企業名で検索"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="キーワードで検索"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoomId(room.id)}
            className={cn(
              'px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors',
              selectedRoomId === room.id && 'bg-blue-50'
            )}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {room.companyGroup?.company_account?.company_name || '企業名未設定'}
                  </h3>
                  {room.unreadCount && room.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {room.companyGroup?.group_name || 'グループ未設定'}
                </p>
              </div>
              <span className="text-xs text-gray-400 ml-2">
                {room.lastMessage ? formatDate(room.lastMessage.sent_at) : ''}
              </span>
            </div>
            
            <div className="mt-1">
              <p className="text-xs text-blue-600 font-medium truncate">
                {room.jobPosting?.title || '求人情報なし'}
              </p>
              {room.lastMessage && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {room.lastMessage.content}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}