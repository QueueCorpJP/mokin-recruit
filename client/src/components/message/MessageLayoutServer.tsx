'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EmptyMessageState } from './EmptyMessageState';
import { MessageSearchFilter } from './MessageSearchFilter';
import { MessageDetailHeader } from './MessageDetailHeader';
import { MessageDetailContent } from './MessageDetailContent';
import { MessageInputBox } from './MessageInputBox';
import { RoomList } from './RoomList';
import { type Room } from '@/lib/rooms';
import { getRoomMessages, sendCompanyMessage } from '@/lib/actions/messages';
import { sendMessage } from '@/lib/actions/message-actions';
import { ChatMessage } from '@/types/message';
import { MessageLoading } from '@/components/ui/Loading';

export interface MessageLayoutServerProps {
  className?: string;
  rooms: Room[];
  userId?: string;
  userType?: 'candidate' | 'company';
  companyUserName?: string;
}

export function MessageLayoutServer({
  className,
  rooms: initialRooms,
  userId,
  userType = 'company',
  companyUserName,
}: MessageLayoutServerProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState(''); // 実際の検索に使用するキーワード
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'company'>('date');
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(initialRooms); // roomsを状態管理

  // 最初のルームを自動選択
  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  // 選択されたルームのメッセージを取得
  useEffect(() => {
    if (selectedRoomId) {
      const loadMessages = async () => {
        setIsLoadingMessages(true);
        try {
          const messages = await getRoomMessages(selectedRoomId);
          setRoomMessages(messages);
          
          // メッセージを読み込んだ後、そのroomの未読数を0にリセット
          setRooms(prevRooms => 
            prevRooms.map(room => 
              room.id === selectedRoomId 
                ? { ...room, unreadCount: 0, isUnread: false }
                : room
            )
          );
        } catch (error) {
          console.error('Failed to load messages:', error);
          setRoomMessages([]);
        } finally {
          setIsLoadingMessages(false);
        }
      };

      loadMessages();
    } else {
      setRoomMessages([]);
    }
  }, [selectedRoomId]);
  
  // モバイル判定
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileDetailMode, setIsMobileDetailMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId);
    if (isMobile) setIsMobileDetailMode(true);
  };

  const handleBack = () => {
    setIsMobileDetailMode(false);
    setSelectedRoomId(null);
  };

  // 利用可能なグループリストを生成
  const availableGroups = React.useMemo(() => {
    const uniqueGroups = Array.from(
      new Set(rooms.map(room => room.companyName).filter(Boolean))
    ).map(groupName => ({
      value: groupName,
      label: groupName
    }));
    return uniqueGroups;
  }, [rooms]);

  // フィルタリング処理
  const filteredRooms = React.useMemo(() => {
    let filtered = rooms.filter(room => {
      // 対応状況フィルター
      if (statusFilter !== 'all') {
        if (statusFilter === 'unread' && !room.isUnread) return false;
        if (statusFilter === 'read' && room.isUnread) return false;
      }
      
      // グループフィルター（企業側では会社名でフィルター）
      if (groupFilter !== 'all' && room.companyName !== groupFilter) return false;
      
      // キーワード検索（候補者名と現在の在籍企業名でフィルター）
      if (searchKeyword) {
        const searchText = `${room.candidateName} ${room.currentCompany || ''}`.toLowerCase();
        if (!searchText.includes(searchKeyword.toLowerCase())) return false;
      }
      
      return true;
    });

    // ソート処理
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.candidateName || '').localeCompare(b.candidateName || '', 'ja');
        case 'company':
          return (a.currentCompany || '').localeCompare(b.currentCompany || '', 'ja');
        case 'date':
        default:
          // 日付順（未読メッセージを優先、その後最新メッセージ順）
          if (a.isUnread !== b.isUnread) {
            return a.isUnread ? -1 : 1; // 未読を上に
          }
          const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
          const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
          return bTime - aTime; // 新しいメッセージを上に
      }
    });
  }, [rooms, statusFilter, groupFilter, searchKeyword, sortBy]);

  // 検索実行
  const handleSearch = React.useCallback(() => {
    setSearchKeyword(keyword);
  }, [keyword]);

  // 初期表示時に検索キーワードを空に設定（リアルタイムフィルタリングのため）
  useEffect(() => {
    setSearchKeyword('');
  }, []);

  const selectedRoom = filteredRooms.find(room => room.id === selectedRoomId);
  const isCandidatePage = userType === 'candidate';

  // メッセージ送信処理
  const handleSendMessage = async (content: string, fileUrls?: string[]) => {
    if (!selectedRoomId) return;
    
    try {
      let result;
      
      if (userType === 'candidate') {
        // 候補者用の送信関数を使用
        result = await sendMessage({
          room_id: selectedRoomId,
          content,
          message_type: 'GENERAL',
          file_urls: fileUrls || []
        });
      } else {
        // 企業用の送信関数を使用
        result = await sendCompanyMessage({
          room_id: selectedRoomId,
          content,
          message_type: 'GENERAL',
          file_urls: fileUrls || []
        });
      }

      if (result.error) {
        console.error('Failed to send message:', result.error);
        return;
      }

      // メッセージ送信成功後、メッセージリストを再読み込み
      const updatedMessages = await getRoomMessages(selectedRoomId);
      setRoomMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // モバイル: 詳細モード
  if (isMobile && isMobileDetailMode && selectedRoomId) {
    return (
      <div className={cn('flex flex-col h-full bg-[#F9F9F9]', className)}>
        <div className='flex-1 min-h-0 flex flex-col h-full'>
          <MessageDetailHeader
            candidateName={selectedRoom?.candidateName || ''}
            companyName={selectedRoom?.companyName || ''}
            jobTitle={selectedRoom?.jobTitle || ''}
            onDetailClick={() => {
              // TODO: 詳細ボタンのクリック処理
            }}
            onBackClick={handleBack}
            isCandidatePage={isCandidatePage}
          />
          <div className='flex-1 overflow-y-auto'>
            {isLoadingMessages ? (
              <MessageLoading />
            ) : (
              <MessageDetailContent
                messages={roomMessages}
                isCandidatePage={isCandidatePage}
                candidateId={userId}
                candidateName={selectedRoom?.candidateName}
                companyName={selectedRoom?.companyName}
                isMobile={true}
              />
            )}
          </div>
          <MessageInputBox 
            isCandidatePage={isCandidatePage} 
            onSendMessage={handleSendMessage}
            candidateId={userId}
            userType={userType}
          />
        </div>
      </div>
    );
  }

  // PCまたはモバイル一覧モード: 従来通り2ペイン
  return (
    <div className={cn('flex h-full bg-white overflow-hidden', className)}>
      {/* 左ペイン: ルーム一覧（固定幅） */}
      <div
        className='w-[445px] flex-shrink-0 border-r border-[#efefef] flex flex-col hidden md:flex'
        style={{ background: '#fff', height: '100%' }}
      >
        {/* フィルターUIを最上部に配置 */}
        <MessageSearchFilter
          statusValue={statusFilter}
          groupValue={groupFilter}
          keywordValue={keyword}
          onStatusChange={setStatusFilter}
          onGroupChange={setGroupFilter}
          onKeywordChange={setKeyword}
          onSearch={handleSearch}
          availableGroups={availableGroups}
        />
        <div className='flex-1 min-h-0'>
          <RoomList
            rooms={filteredRooms}
            onRoomClick={handleRoomClick}
            isCandidatePage={isCandidatePage}
            selectedRoomId={selectedRoomId}
          />
        </div>
      </div>

      {/* モバイル時は一覧のみ表示 */}
      {isMobile && !isMobileDetailMode && (
        <div className='flex-1 min-w-0 flex flex-col h-full md:hidden'>
          <MessageSearchFilter
            statusValue={statusFilter}
            groupValue={groupFilter}
            keywordValue={keyword}
            onStatusChange={setStatusFilter}
            onGroupChange={setGroupFilter}
            onKeywordChange={setKeyword}
            onSearch={handleSearch}
            availableGroups={availableGroups}
          />
          <div className='flex-1 min-h-0'>
            <RoomList
              rooms={filteredRooms}
              onRoomClick={handleRoomClick}
              isCandidatePage={isCandidatePage}
              selectedRoomId={selectedRoomId}
            />
          </div>
        </div>
      )}

      {/* 右ペイン: メッセージ詳細または空の状態（優先幅） */}
      <div className='flex-1 min-w-0 flex flex-col h-full hidden md:flex'>
        {selectedRoomId ? (
          <>
            <MessageDetailHeader
              candidateName={selectedRoom?.candidateName || ''}
              companyName={selectedRoom?.companyName || ''}
              jobTitle={selectedRoom?.jobTitle || ''}
              onDetailClick={() => {
                // TODO: 詳細ボタンのクリック処理
              }}
              onBackClick={handleBack}
              isCandidatePage={isCandidatePage}
            />
            <div className='flex-1 overflow-y-auto'>
              {isLoadingMessages ? (
                <MessageLoading />
              ) : (
                <MessageDetailContent
                  messages={roomMessages}
                  isCandidatePage={isCandidatePage}
                  candidateId={userId}
                  candidateName={selectedRoom?.candidateName}
                  companyName={selectedRoom?.companyName}
                  isMobile={false}
                />
              )}
            </div>
            <MessageInputBox 
              isCandidatePage={isCandidatePage} 
              onSendMessage={handleSendMessage}
              candidateId={userId}
              userType={userType}
            />
          </>
        ) : (
          <EmptyMessageState />
        )}
      </div>
    </div>
  );
}