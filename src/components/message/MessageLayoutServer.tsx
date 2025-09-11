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
import { getRoomMessages, sendCompanyMessage, markRoomMessagesAsRead } from '@/lib/actions/messages';
import { sendMessage, markCandidateRoomMessagesAsRead, uploadMessageFile } from '@/lib/actions';
import { ChatMessage } from '@/types/message';
import { useToast } from '@/components/ui/toast';
import { CandidateSlideMenu } from '@/app/company/recruitment/detail/CandidateSlideMenu';

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
  companyUserName,
  initialRoomId,
  jobOptions: propsJobOptions = [],
}: MessageLayoutServerProps) {
  const { showToast } = useToast();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(initialRoomId || null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  // 候補者用フィルター
  const [companyFilter, setCompanyFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState(''); // 実際の検索に使用するキーワード
  const [searchTarget, setSearchTarget] = useState<'company' | 'job'>('company');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'company'>('date');
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<Room[]>(initialRooms); // roomsを状態管理
  
  // モバイル判定 - 初期ルーム設定より前に定義
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileDetailMode, setIsMobileDetailMode] = useState(false);
  
  // 候補者詳細サイドバー用の状態
  const [isCandidateDetailOpen, setIsCandidateDetailOpen] = useState(false);
  const [jobOptions, setJobOptions] = useState<Array<{ value: string; label: string; groupId?: string }>>(propsJobOptions);
  
  const isCandidatePage = userType === 'candidate';
  
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

  // 選択されたルームのメッセージを取得
  useEffect(() => {
    if (selectedRoomId) {
      const loadMessages = async () => {
        try {
          const messages = await getRoomMessages(selectedRoomId);
          setRoomMessages(messages);
          
          // 専用の関数を使ってメッセージを既読にマーク
          let markAsReadResult;
          if (isCandidatePage) {
            markAsReadResult = await markCandidateRoomMessagesAsRead(selectedRoomId);
          } else {
            markAsReadResult = await markRoomMessagesAsRead(selectedRoomId);
          }
          
          if (markAsReadResult.success) {
            console.log('✅ Messages marked as read successfully');
            // データベース更新が成功した場合のみローカル状態を更新
            setRooms(prevRooms => 
              prevRooms.map(room => 
                room.id === selectedRoomId 
                  ? { ...room, unreadCount: 0, isUnread: false }
                  : room
              )
            );
          } else {
            console.warn('⚠️ Failed to mark messages as read:', markAsReadResult.error);
          }
        } catch (error) {
          console.error('Failed to load messages:', error);
          setRoomMessages([]);
        }
      };

      loadMessages();
    } else {
      setRoomMessages([]);
    }
  }, [selectedRoomId, isCandidatePage]);
  
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
      if (isCandidatePage) {
        // 候補者用フィルタリング
        if (companyFilter !== 'all' && room.companyName !== companyFilter) return false;
        if (jobFilter !== 'all' && room.jobTitle !== jobFilter) return false;
        
        // キーワード検索：選択された検索対象に応じて検索
        if (keyword) {
          const searchText = searchTarget === 'company' 
            ? room.companyName.toLowerCase()
            : room.jobTitle.toLowerCase();
          if (!searchText.includes(keyword.toLowerCase())) {
            return false;
          }
        }
      } else {
        // 企業用フィルタリング
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
      }
      
      return true;
    });

    // ソート処理
    return filtered.sort((a, b) => {
      if (isCandidatePage) {
        // 選択された検索対象に応じてソート
        if (searchTarget === 'company') {
          return (a.companyName || '').localeCompare(b.companyName || '', 'ja');
        } else {
          return (a.jobTitle || '').localeCompare(b.jobTitle || '', 'ja');
        }
      } else {
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
      }
    });
  }, [rooms, statusFilter, groupFilter, searchKeyword, sortBy, isCandidatePage, companyFilter, jobFilter, searchTarget, keyword]);

  // 検索実行
  const handleSearch = React.useCallback(() => {
    setSearchKeyword(keyword);
  }, [keyword]);

  // 初期表示時に検索キーワードを空に設定（リアルタイムフィルタリングのため）
  useEffect(() => {
    setSearchKeyword('');
  }, []);

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
      companyCheck: userType === 'company'
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
        console.log('🔍 [MESSAGE SEND] Using candidate sendMessage with data:', {
          room_id: selectedRoomId,
          content,
          message_type: 'GENERAL',
          file_urls: fileUrls || [],
          fileCount: (fileUrls || []).length
        });
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
        console.log('🔍 [MESSAGE SEND] Using company sendCompanyMessage with data:', {
          room_id: selectedRoomId,
          content,
          message_type: 'GENERAL',
          file_urls: fileUrls || [],
          fileCount: (fileUrls || []).length,
          userType,
          userId
        });
        console.log('🔍 [MESSAGE SEND] Calling sendCompanyMessage from company interface');
        // 企業用の送信関数を使用
        result = await sendCompanyMessage({
          room_id: selectedRoomId,
          content,
          message_type: 'GENERAL',
          file_urls: fileUrls || []
        });
        console.log('🔍 [MESSAGE SEND] sendCompanyMessage result:', result);
      }

      console.log('🔍 [MESSAGE SEND] Send result:', result);

      if (result.error) {
        console.error('Failed to send message:', result.error);
        showToast('メッセージの送信に失敗しました。しばらく時間をおいてから再度お試しください。', 'error');
        return;
      }

      // メッセージ送信成功後、メッセージリストを再読み込み
      console.log('🔍 [MESSAGE SEND] Reloading messages');
      const updatedMessages = await getRoomMessages(selectedRoomId);
      setRoomMessages(updatedMessages);
      console.log('🔍 [MESSAGE SEND] Messages reloaded:', updatedMessages.length);
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast('メッセージの送信中にエラーが発生しました。ネットワーク接続を確認してから再度お試しください。', 'error');
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
              candidateId={userId}
              candidateName={selectedRoom?.candidateName}
              companyName={selectedRoom?.companyName}
              isMobile={true}
            />
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
        {isCandidatePage ? (
          <MessageSearchFilterCandidate
            companyValue={companyFilter}
            jobValue={jobFilter}
            keywordValue={keyword}
            searchTarget={searchTarget}
            messages={rooms.map(room => ({
              id: room.id,
              companyName: room.companyName,
              jobTitle: room.jobTitle
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
                jobTitle: room.jobTitle
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
      <div className='flex-1 min-w-0 flex flex-col h-full hidden md:flex'>
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
                candidateId={userId}
                candidateName={selectedRoom?.candidateName}
                companyName={selectedRoom?.companyName}
                isMobile={false}
              />
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
      
      {/* 候補者詳細サイドバー */}
      {!isCandidatePage && selectedRoom && (
        <CandidateSlideMenu
          isOpen={isCandidateDetailOpen}
          onClose={handleCandidateDetailClose}
          candidateId={selectedRoom.candidateId}
          companyGroupId={selectedRoom.companyGroupId}
          jobOptions={jobOptions}
          onJobChange={handleJobChange}
        />
      )}
    </div>
  );
}