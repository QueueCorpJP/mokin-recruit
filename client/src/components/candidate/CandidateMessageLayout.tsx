'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CandidateRoomList } from './CandidateRoomList';
import { CandidateRoomMessages } from './CandidateRoomMessages';
import { CandidateMessageInput } from './CandidateMessageInput';
import { CandidateRoom } from '@/types/candidate-message';
import { MessageSearchFilterCandidate } from '@/components/message/MessageSearchFilterCandidate';
import { EmptyMessageState } from '@/components/message/EmptyMessageState';
import { MessageDetailHeader } from '@/components/message/MessageDetailHeader';

interface CandidateMessageLayoutProps {
  className?: string;
  rooms: CandidateRoom[];
  candidateId: string;
}

export function CandidateMessageLayout({
  className,
  rooms,
  candidateId,
}: CandidateMessageLayoutProps) {
  // ルーム選択状態
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  
  // フィルター状態
  const [companyFilter, setCompanyFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  
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

  // フィルタリング（簡易版）
  const filteredRooms = rooms.filter(room => {
    if (companyFilter && !room.companyName.includes(companyFilter)) return false;
    if (keyword && !room.jobTitle.includes(keyword) && !room.lastMessage?.includes(keyword)) return false;
    return true;
  });

  const selectedRoom = filteredRooms.find(r => r.id === selectedRoomId);

  // モバイル: チャット表示モード
  if (isMobile && isMobileDetailMode && selectedRoomId && selectedRoom) {
    return (
      <div className={cn('flex flex-col h-full bg-[#F9F9F9]', className)}>
        <div className='flex-1 min-h-0 flex flex-col h-full'>
          <MessageDetailHeader
            candidateName="" // 候補者側では自分の名前は不要
            jobTitle={selectedRoom.jobTitle}
            onDetailClick={() => {
              // TODO: 詳細ボタンのクリック処理
            }}
            onBackClick={handleBack}
            isCandidatePage={true}
          />
          <div className='flex-1 overflow-y-auto'>
            <CandidateRoomMessages 
              roomId={selectedRoomId} 
              candidateId={candidateId}
              isMobile={isMobile}
            />
          </div>
          {/* 入力欄（下部固定） */}
          <CandidateMessageInput 
            roomId={selectedRoomId}
            candidateId={candidateId}
          />
        </div>
      </div>
    );
  }

  // PCまたはモバイル一覧モード: ルーム一覧とチャット画面
  return (
    <div className={cn('flex h-full bg-white overflow-hidden', className)}>
      {/* 左ペイン: ルーム一覧（固定幅） */}
      <div
        className='w-[445px] flex-shrink-0 border-r border-[#efefef] flex flex-col hidden md:flex'
        style={{ background: '#fff', height: '100%' }}
      >
        {/* フィルターUIを最上部に配置 */}
        <MessageSearchFilterCandidate
          companyValue={companyFilter}
          keywordValue={keyword}
          onCompanyChange={setCompanyFilter}
          onKeywordChange={setKeyword}
          onSearch={() => {}}
        />
        <div className='flex-1 min-h-0'>
          <CandidateRoomList
            rooms={filteredRooms}
            onRoomClick={handleRoomClick}
            selectedRoomId={selectedRoomId}
          />
        </div>
      </div>
      
      {/* モバイル時はルーム一覧のみ表示 */}
      {isMobile && !isMobileDetailMode && (
        <div className='flex-1 min-w-0 flex flex-col h-full md:hidden'>
          <MessageSearchFilterCandidate
            companyValue={companyFilter}
            keywordValue={keyword}
            onCompanyChange={setCompanyFilter}
            onKeywordChange={setKeyword}
            onSearch={() => {}}
          />
          <div className='flex-1 min-h-0'>
            <CandidateRoomList
              rooms={filteredRooms}
              onRoomClick={handleRoomClick}
              selectedRoomId={selectedRoomId}
            />
          </div>
        </div>
      )}
      
      {/* 右ペイン: チャット画面または空の状態 */}
      <div className='flex-1 min-w-0 flex flex-col h-full hidden md:flex'>
        {selectedRoomId && selectedRoom ? (
          <>
            <MessageDetailHeader
              candidateName="" // 候補者側では自分の名前は不要
              jobTitle={selectedRoom.jobTitle}
              onDetailClick={() => {
                // TODO: 詳細ボタンのクリック処理
              }}
              onBackClick={handleBack}
              isCandidatePage={true}
            />
            <div className='flex-1 overflow-y-auto'>
              <CandidateRoomMessages 
                roomId={selectedRoomId} 
                candidateId={candidateId}
                isMobile={isMobile}
              />
            </div>
            {/* 入力欄（下部固定） */}
            <CandidateMessageInput 
              roomId={selectedRoomId}
              candidateId={candidateId}
            />
          </>
        ) : (
          <EmptyMessageState />
        )}
      </div>
    </div>
  );
}