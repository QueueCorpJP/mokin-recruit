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
import { ChatMessage } from '@/types/message';

export interface MessageLayoutServerProps {
  className?: string;
  rooms: Room[];
  userId?: string;
  userType?: 'candidate' | 'company';
  companyUserName?: string;
}

export function MessageLayoutServer({
  className,
  rooms,
  userId,
  userType = 'company',
  companyUserName,
}: MessageLayoutServerProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

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

  // フィルタリング処理
  const filteredRooms = rooms.filter(room => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'unread' && !room.isUnread) return false;
      if (statusFilter === 'read' && room.isUnread) return false;
    }
    if (groupFilter !== 'all' && room.groupName !== groupFilter) return false;
    if (keyword) {
      const searchText = `${room.companyName} ${room.candidateName} ${room.lastMessage} ${room.jobTitle}`.toLowerCase();
      if (!searchText.includes(keyword.toLowerCase())) return false;
    }
    return true;
  });

  const selectedRoom = filteredRooms.find(room => room.id === selectedRoomId);
  const isCandidatePage = userType === 'candidate';

  // メッセージ送信処理
  const handleSendMessage = async (content: string, fileUrls?: string[]) => {
    if (!selectedRoomId) return;
    
    try {
      const result = await sendCompanyMessage({
        room_id: selectedRoomId,
        content,
        message_type: 'GENERAL',
        file_urls: fileUrls || []
      });

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
              <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">メッセージを読み込み中...</div>
              </div>
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
          onSearch={() => {}}
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
            onSearch={() => {}}
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
                <div className="flex items-center justify-center p-8">
                  <div className="text-gray-500">メッセージを読み込み中...</div>
                </div>
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