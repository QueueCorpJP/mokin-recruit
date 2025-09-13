'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import MessageApprovalModal from './MessageApprovalModal';

// RoomListItemの型定義（page.tsxと同じ）
interface RoomListItem {
  id: string;
  created_at: string;
  updated_at: string;
  candidate_id: string;
  candidates: {
    first_name: string;
    last_name: string;
  } | null;
  related_job_posting_id: string;
  job_postings: {
    title: string;
  } | null;
  company_group_id: string;
  company_groups: {
    group_name: string;
    company_account_id: string;
    company_accounts: {
      id: string;
      company_name: string;
    } | null;
  } | null;
  application: null;
  latest_messages: Array<{
    id: string;
    content: string;
    subject: string;
    sent_at: string;
    sender_type: string;
  }>;
  confirmation_requested_at: string;
}

interface Props {
  messages: RoomListItem[];
}

export default function PendingMessageClient({ messages }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomListItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemsPerPage = 10;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn('');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleApproveClick = (room: RoomListItem) => {
    setSelectedRoom(room);
    setApprovalModalOpen(true);
  };

  const handleStatusChange = async (status: '承認' | '非承認', reason: string, comment: string): Promise<void> => {
    if (!selectedRoom) return;
    
    setIsProcessing(true);
    try {
      // TODO: メッセージステータス変更のAPI呼び出しを実装
      if (process.env.NODE_ENV === 'development') console.log('Changing message status:', selectedRoom.id, status, reason, comment);
      
      // 成功時の処理
      setApprovalModalOpen(false);
      setSelectedRoom(null);
      // ページをリフレッシュ
      router.refresh();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Status change failed:', error);
      alert('ステータス変更に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  // 検索フィルタリング
  const filteredMessages = messages.filter(room => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const candidateName = room.candidates
        ? `${room.candidates.last_name}${room.candidates.first_name}`
        : '';
      const companyName = room.company_groups?.company_accounts?.company_name || '';
      const messageContent = room.latest_messages?.[0]?.content || '';
      
      return candidateName.toLowerCase().includes(searchLower) ||
             companyName.toLowerCase().includes(searchLower) ||
             messageContent.toLowerCase().includes(searchLower);
    }
    return true;
  });

  // ソート処理
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    let aValue: string;
    let bValue: string;
    
    switch (sortColumn) {
      case 'confirmation_requested_at':
        aValue = (a as any).confirmation_requested_at || '';
        bValue = (b as any).confirmation_requested_at || '';
        break;
      case 'company_accounts':
        aValue = a.company_groups?.company_accounts?.company_name || '';
        bValue = b.company_groups?.company_accounts?.company_name || '';
        break;
      case 'candidates':
        aValue = a.candidates 
          ? `${a.candidates.last_name}${a.candidates.first_name}`
          : '';
        bValue = b.candidates 
          ? `${b.candidates.last_name}${b.candidates.first_name}`
          : '';
        break;
      case 'status':
        aValue = '要確認';
        bValue = '要確認';
        break;
      case 'message':
        aValue = a.latest_messages?.[0]?.content || '';
        bValue = b.latest_messages?.[0]?.content || '';
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue, 'ja');
    } else {
      return bValue.localeCompare(aValue, 'ja');
    }
  });

  // ページネーション
  const paginatedMessages = sortedMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedMessages.length / itemsPerPage);

  const columns = [
    { key: 'confirmation_requested_at', label: '対応確認依頼日時', sortable: true, width: 'w-[180px]' },
    {
      key: 'company_accounts',
      label: '企業名',
      sortable: true,
      width: 'w-[200px]',
    },
    {
      key: 'candidates',
      label: '候補者名',
      sortable: true,
      width: 'w-[150px]',
    },
    { key: 'status', label: '選考状況', sortable: true, width: 'w-[120px]' },
    {
      key: 'message',
      label: 'メッセージ',
      sortable: false,
      width: 'w-[400px]',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      {/* ヘッダーと検索 */}
      
    

      {/* テーブル */}
      <div className='bg-white rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <div className='min-w-[1050px]'>
            <MediaTableHeader
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <div className='mt-2 space-y-2'>
              {paginatedMessages.map(room => (
                <AdminTableRow
                  key={room.id}
                  onClick={() => {
                    const messageId = room.latest_messages?.[0]?.id;
                    if (messageId && typeof messageId === 'string' && messageId.length > 0) {
                      router.push(`/admin/message/pending/${messageId}`);
                    } else {
                      if (process.env.NODE_ENV === 'development') console.error('Invalid message ID found for room:', room.id);
                    }
                  }}
                  columns={[
                    {
                      content: (
                        <div>
                          <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                            {(room as any).confirmation_requested_at
                              ? new Date((room as any).confirmation_requested_at).toLocaleDateString('ja-JP')
                              : ''}
                          </div>
                          <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                            {(room as any).confirmation_requested_at
                              ? new Date((room as any).confirmation_requested_at).toLocaleTimeString('ja-JP', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false
                                })
                              : ''}
                          </div>
                        </div>
                      ),
                      width: 'w-[180px]',
                    },
                    {
                      content: room.company_groups?.company_accounts?.company_name || '不明',
                      width: 'w-[200px]',
                    },
                    {
                      content: room.candidates
                        ? `${room.candidates.last_name}${room.candidates.first_name}`
                        : '不明',
                      width: 'w-[150px]',
                    },
                    {
                      content: (
                        <span
                          className={`px-3 py-1 rounded-full text-[14px] font-bold bg-gray-500 text-white`}
                        >
                          {'要確認'}
                        </span>
                      ),
                      width: 'w-[120px]',
                    },
                    {
                      content: (
                        <div className="truncate max-w-[380px]">
                          {room.latest_messages?.[0]?.content || '不明'}
                        </div>
                      ),
                      width: 'w-[400px]',
                    },
                  ]}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* ページネーション */}
        <div className='flex justify-center mt-8'>
          <PaginationButtons
            onPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
            onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            previousDisabled={currentPage === 1}
            nextDisabled={currentPage === totalPages || totalPages === 0}
          />
        </div>
      </div>

      {/* 承認/非承認モーダル */}
      <MessageApprovalModal
        isOpen={approvalModalOpen}
        onClose={(): void => {
          setApprovalModalOpen(false);
          setSelectedRoom(null);
        }}
        onStatusChange={handleStatusChange}
        isProcessing={isProcessing}
        messageContent={selectedRoom?.latest_messages?.[0]?.content || ''}
      />
    </div>
  );
}