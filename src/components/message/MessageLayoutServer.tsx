'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EmptyMessageState } from './EmptyMessageState';
import { MessageSearchFilter } from './MessageSearchFilter';
import { MessageSearchFilterCandidate } from './MessageSearchFilterCandidate';
import { MessageDetailHeader } from './MessageDetailHeader';
import { MessageDetailContent } from './MessageDetailContent';
import { MessageInputBox } from './MessageInputBox';
import { RoomList } from './RoomList';
import { type Room } from '@/lib/rooms';
import { getRoomMessages, sendCompanyMessage } from '@/lib/actions/messages';
import { sendMessage } from '@/lib/actions';
import { useLoadRoomMessages } from '@/components/message/hooks/useLoadRoomMessages';
import { ChatMessage } from '@/types/message';
import { useToast } from '@/components/ui/toast';
import { CandidateSlideMenu } from '@/app/company/recruitment/detail/CandidateSlideMenu';
import { useMessageFilters } from '@/components/message/hooks/useMessageFilters';

export interface MessageLayoutServerProps {
  className?: string;
  rooms: Room[];
  userId?: string;
  userType?: 'candidate' | 'company';
  companyUserName?: string;
  initialRoomId?: string;
  jobOptions?: Array<{ value: string; label: string; groupId?: string }>;
}

export function MessageLayoutServer({
  className,
  rooms: initialRooms,
  userId,
  userType = 'company',
  companyUserName: _companyUserName,
  initialRoomId,
  jobOptions: propsJobOptions = [],
}: MessageLayoutServerProps) {
  const { showToast } = useToast();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    initialRoomId || null
  );
  const [rooms, setRooms] = useState<Room[]>(initialRooms); // roomsを状態管理
  const isCandidatePage = userType === 'candidate';
  const {
    filteredRooms,
    availableGroups,
    handleSearch,
    companyFilter,
    setCompanyFilter,
    jobFilter,
    setJobFilter,
    searchTarget,
    setSearchTarget,
    keyword,
    setKeyword,
    statusFilter,
    setStatusFilter,
    groupFilter,
    setGroupFilter,
  } = useMessageFilters(rooms, isCandidatePage);
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);

  // モバイル判定 - 初期ルーム設定より前に定義
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileDetailMode, setIsMobileDetailMode] = useState(false);

  // 候補者詳細サイドバー用の状態
  const [isCandidateDetailOpen, setIsCandidateDetailOpen] = useState(false);
  const [jobOptions] =
    useState<Array<{ value: string; label: string; groupId?: string }>>(
      propsJobOptions
    );

  const handleSearchTargetChange = (target: 'company' | 'job') => {
    setSearchTarget(target);
  };

  // URLパラメータから初期ルームIDを設定
  useEffect(() => {
    if (initialRoomId && rooms.some(room => room.id === initialRoomId)) {
      setSelectedRoomId(initialRoomId);
      // モバイルの場合は詳細モードに切り替え
      if (isMobile) {
        setIsMobileDetailMode(true);
      }
    }
  }, [initialRoomId, rooms, isMobile]);

  // 選択されたルームのメッセージ取得＋既読処理をフックへ委譲
  useLoadRoomMessages({
    selectedRoomId,
    isCandidatePage,
    setRoomMessages,
    setRooms,
  });

  // モバイル判定のuseEffect
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

  // 候補者詳細ボタンのクリックハンドラー
  const handleCandidateDetailClick = () => {
    setIsCandidateDetailOpen(true);
  };

  // 候補者詳細サイドバーを閉じる
  const handleCandidateDetailClose = () => {
    setIsCandidateDetailOpen(false);
  };

  // 求人変更ハンドラー（サイドバー用）
  const handleJobChange = (candidateId: string, jobId: string) => {
    // TODO: 実装が必要な場合は後で追加
    console.log('Job change:', { candidateId, jobId });
  };

  // 利用可能なグループリストを生成
  // フィルタ・ソート・検索は useMessageFilters に委譲

  const selectedRoom = filteredRooms.find(room => room.id === selectedRoomId);

  // メッセージ送信処理
  const handleSendMessage = async (content: string, fileUrls?: string[]) => {
    console.log('🔍 [MESSAGE SEND] Starting send process:', {
      selectedRoomId,
      userType,
      isCandidatePage,
      contentLength: content.length,
      fileUrlsLength: fileUrls?.length || 0,
      hasContent: content.trim().length > 0,
      hasFiles: (fileUrls?.length || 0) > 0,
      userTypeCheck: userType === 'candidate',
      companyCheck: userType === 'company',
    });

    if (!selectedRoomId) {
      console.error('🔍 [MESSAGE SEND] No room selected');
      return;
    }

    // メッセージまたはファイルのいずれかが必要
    if (!content.trim() && (!fileUrls || fileUrls.length === 0)) {
      console.error('🔍 [MESSAGE SEND] No content or files to send');
      return;
    }

    try {
      let result;

      if (userType === 'candidate') {
        console.log(
          '🔍 [MESSAGE SEND] Using candidate sendMessage with data:',
          {
            room_id: selectedRoomId,
            content,
            message_type: 'GENERAL',
            file_urls: fileUrls || [],
            fileCount: (fileUrls || []).length,
          }
        );
        // 候補者用の送信関数を使用
        result = await sendMessage(
          selectedRoomId,
          content,
          'candidate',
          userId || '',
          undefined,
          fileUrls || []
        );
      } else {
        console.log(
          '🔍 [MESSAGE SEND] Using company sendCompanyMessage with data:',
          {
            room_id: selectedRoomId,
            content,
            message_type: 'GENERAL',
            file_urls: fileUrls || [],
            fileCount: (fileUrls || []).length,
            userType,
            userId,
          }
        );
        console.log(
          '🔍 [MESSAGE SEND] Calling sendCompanyMessage from company interface'
        );
        // 企業用の送信関数を使用
        result = await sendCompanyMessage({
          room_id: selectedRoomId,
          content,
          message_type: 'GENERAL',
          file_urls: fileUrls || [],
        });
        console.log('🔍 [MESSAGE SEND] sendCompanyMessage result:', result);
      }

      console.log('🔍 [MESSAGE SEND] Send result:', result);

      if (result.error) {
        console.error('Failed to send message:', result.error);
        showToast(
          'メッセージの送信に失敗しました。しばらく時間をおいてから再度お試しください。',
          'error'
        );
        return;
      }

      // メッセージ送信成功後、メッセージリストを再読み込み
      console.log('🔍 [MESSAGE SEND] Reloading messages');
      const updatedMessages = await getRoomMessages(selectedRoomId);
      setRoomMessages(updatedMessages);
      console.log(
        '🔍 [MESSAGE SEND] Messages reloaded:',
        updatedMessages.length
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast(
        'メッセージの送信中にエラーが発生しました。ネットワーク接続を確認してから再度お試しください。',
        'error'
      );
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
            onDetailClick={handleCandidateDetailClick}
            onBackClick={handleBack}
            isCandidatePage={isCandidatePage}
          />
          <div className='flex-1 overflow-y-auto scrollbar-hide'>
            <MessageDetailContent
              messages={roomMessages}
              isCandidatePage={isCandidatePage}
              candidateId={userId || ''}
              candidateName={selectedRoom?.candidateName}
              companyName={selectedRoom?.companyName}
              isMobile={true}
            />
          </div>
          <MessageInputBox
            isCandidatePage={isCandidatePage}
            onSendMessage={handleSendMessage}
            candidateId={userId || ''}
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
        className='w-[445px] flex-shrink-0 border-r border-[#efefef] hidden md:flex md:flex-col'
        style={{ background: '#fff', height: '100%' }}
      >
        {/* フィルターUIを最上部に配置 */}
        {isCandidatePage ? (
          <MessageSearchFilterCandidate
            companyValue={companyFilter}
            jobValue={jobFilter}
            keywordValue={keyword}
            searchTarget={searchTarget}
            messages={rooms.map(room => ({
              id: room.id,
              companyName: room.companyName,
              jobTitle: room.jobTitle,
            }))}
            onCompanyChange={setCompanyFilter}
            onJobChange={setJobFilter}
            onKeywordChange={setKeyword}
            onSearchTargetChange={handleSearchTargetChange}
            onSearch={handleSearch}
          />
        ) : (
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
        )}
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
          {isCandidatePage ? (
            <MessageSearchFilterCandidate
              companyValue={companyFilter}
              jobValue={jobFilter}
              keywordValue={keyword}
              searchTarget={searchTarget}
              messages={rooms.map(room => ({
                id: room.id,
                companyName: room.companyName,
                jobTitle: room.jobTitle,
              }))}
              onCompanyChange={setCompanyFilter}
              onJobChange={setJobFilter}
              onKeywordChange={setKeyword}
              onSearchTargetChange={handleSearchTargetChange}
              onSearch={handleSearch}
            />
          ) : (
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
          )}
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
      <div className='flex-1 min-w-0 hidden md:flex md:flex-col h-full'>
        {selectedRoomId ? (
          <>
            <MessageDetailHeader
              candidateName={selectedRoom?.candidateName || ''}
              companyName={selectedRoom?.companyName || ''}
              jobTitle={selectedRoom?.jobTitle || ''}
              onDetailClick={handleCandidateDetailClick}
              onBackClick={handleBack}
              isCandidatePage={isCandidatePage}
            />
            <div className='flex-1 overflow-y-auto scrollbar-hide'>
              <MessageDetailContent
                messages={roomMessages}
                isCandidatePage={isCandidatePage}
                candidateId={userId || ''}
                candidateName={selectedRoom?.candidateName}
                companyName={selectedRoom?.companyName}
                isMobile={false}
              />
            </div>
            <MessageInputBox
              isCandidatePage={isCandidatePage}
              onSendMessage={handleSendMessage}
              candidateId={userId || ''}
              userType={userType}
            />
          </>
        ) : (
          <EmptyMessageState />
        )}
      </div>

      {/* 候補者詳細サイドバー */}
      {!isCandidatePage && selectedRoom && (
        <CandidateSlideMenu
          isOpen={isCandidateDetailOpen}
          onClose={handleCandidateDetailClose}
          candidateId={selectedRoom.candidateId || ''}
          companyGroupId={selectedRoom.companyGroupId || ''}
          jobOptions={jobOptions}
          onJobChange={handleJobChange}
        />
      )}
    </div>
  );
}
