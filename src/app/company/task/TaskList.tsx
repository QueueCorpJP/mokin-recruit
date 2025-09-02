'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';

// TaskListで使用するTaskDataインターフェース
interface TaskData {
  // Task 1: 求人作成が0件
  hasNoJobPostings: boolean;
  
  // Task 2 & 3: 応募への対応
  hasNewApplication: boolean;
  newApplications?: Array<{
    id: string;
    candidateName: string;
    jobTitle: string;
    appliedAt: Date;
  }>;
  
  hasUnreadApplication: boolean;
  unreadApplications?: Array<{
    id: string;
    candidateName: string;
    jobTitle: string;
    appliedAt: Date;
  }>;
  
  // Task 4 & 5: メッセージ対応
  hasNewMessage: boolean;
  newMessages?: Array<{
    roomId: string;
    candidateName: string;
    jobTitle: string;
    sentAt: Date;
    messagePreview?: string;
  }>;
  
  hasUnreadMessage: boolean;
  unreadMessages?: Array<{
    roomId: string;
    candidateName: string;
    jobTitle: string;
    sentAt: Date;
    messagePreview?: string;
  }>;
  
  // Task 6: 選考結果未登録
  hasUnregisteredInterviewResult: boolean;
  unregisteredInterviews?: Array<{
    id: string;
    candidateName: string;
    jobTitle: string;
    interviewDate?: Date;
  }>;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  iconSrc?: string;
  completed?: boolean;
  triggerFunction: () => boolean;
  navigateTo?: string;
}

interface TaskListProps {
  initialTaskData: TaskData;
}

export default function TaskList({ initialTaskData }: TaskListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  
  // デバッグ・デザインテスト用の強制表示フラグ（簡単に切り替え可能）
  const FORCE_SHOW_ALL_TASKS = true; // ← これを true/false で切り替え
  
  // デバッグ用ログ
  console.log('🎨 TaskList received data:', initialTaskData);
  console.log('🎨 Force show all tasks:', FORCE_SHOW_ALL_TASKS);
  
  // 仮データ（デザインテスト用）
  const mockTaskData: TaskData = {
    hasNoJobPostings: true,
    hasNewApplication: true,
    hasUnreadApplication: true, 
    hasNewMessage: true,
    hasUnreadMessage: true,
    hasUnregisteredInterviewResult: true,
    newApplications: [{
      id: 'mock-app-1',
      candidateName: '田中 太郎',
      jobTitle: 'フロントエンドエンジニア',
      appliedAt: new Date()
    }],
    unreadApplications: [{
      id: 'mock-app-2', 
      candidateName: '佐藤 花子',
      jobTitle: 'バックエンドエンジニア',
      appliedAt: new Date()
    }],
    newMessages: [{
      roomId: 'mock-room-1',
      candidateName: '山田 一郎',
      jobTitle: 'デザイナー',
      sentAt: new Date(),
      messagePreview: 'ご質問があります'
    }],
    unreadMessages: [{
      roomId: 'mock-room-2',
      candidateName: '鈴木 美香', 
      jobTitle: 'プロダクトマネージャー',
      sentAt: new Date(),
      messagePreview: '面接についてご相談です'
    }],
    unregisteredInterviews: [{
      id: 'mock-interview-1',
      candidateName: '高橋 健太',
      jobTitle: 'データサイエンティスト',
      interviewDate: new Date()
    }]
  };
  
  // 強制表示モードかどうかで使用するデータを切り替え
  const userState = FORCE_SHOW_ALL_TASKS ? mockTaskData : initialTaskData;

  const checkNoJobPostings = () => userState.hasNoJobPostings;
  const checkNewApplication = () => userState.hasNewApplication;
  const checkUnreadApplication = () => userState.hasUnreadApplication;
  const checkNewMessage = () => userState.hasNewMessage;
  const checkUnreadMessage = () => userState.hasUnreadMessage;
  const checkUnregisteredInterviewResult = () => userState.hasUnregisteredInterviewResult;

  const generateSubText = (candidates: any[], type: 'application' | 'message' | 'interview'): string => {
    if (!candidates || candidates.length === 0) {
      return '候補者名 | 求人タイトル';
    }
    
    const candidate = candidates[0]; // 最初の候補者を表示
    const candidateName = candidate.candidateName || '候補者名未設定';
    const jobTitle = candidate.jobTitle || '求人タイトル未設定';
    
    return `${candidateName} | ${jobTitle}`;
  };

  const taskItems: TaskItem[] = [
    // media.mdの一つ目の表示トリガー：求人作成件数が０件の場合
    {
      id: '1',
      title: 'まずは求人を登録しましょう。',
      description: '求人を登録すると、スカウト送信が可能になります。',
      iconSrc: '/images/check.svg',
      triggerFunction: checkNoJobPostings,
      navigateTo: '/company/job/new',
    },
    // Task 2: 新着応募（24時間以内）- 迅速対応が重要
    {
      id: '2',
      title: '確認していない応募があります。早めに対応しましょう。',
      description: generateSubText(userState.newApplications || [], 'application'),
      iconSrc: '/images/check.svg',
      triggerFunction: checkNewApplication,
      navigateTo: `/company/message`,
    },
    // Task 3: 対応遅延応募（48時間以上）- 至急対応が必要
    {
      id: '3', 
      title: '確認していない応募があります。早めに対応しましょう。',
      description: generateSubText(userState.unreadApplications || [], 'application'),
      iconSrc: '/images/check.svg',
      triggerFunction: checkUnreadApplication,
      navigateTo: `/company/message`,
    },
    // Task 4: 新着メッセージ（24時間以内）- 迅速返信が重要
    {
      id: '4',
      title: '求職者からメッセージが届きました！内容を確認しましょう。',
      description: generateSubText(userState.newMessages || [], 'message'),
      iconSrc: '/images/check.svg',
      triggerFunction: checkNewMessage,
      navigateTo: `/company/message`,
    },
    // Task 5: 返信遅延メッセージ（48時間以上）- 候補者をお待たせ
    {
      id: '5',
      title: '未読のメッセージがあります。早めに確認しましょう。',
      description: generateSubText(userState.unreadMessages || [], 'message'),
      iconSrc: '/images/check.svg',
      triggerFunction: checkUnreadMessage,
      navigateTo: `/company/message`,
    },
    // Task 6: 面接結果未登録（72時間以上）- 回答期限
    {
      id: '6',
      title: '面談はいかがでしたか？選考結果を登録しましょう。',
      description: generateSubText(userState.unregisteredInterviews || [], 'interview'),
      iconSrc: '/images/check.svg',
      triggerFunction: checkUnregisteredInterviewResult,
      navigateTo: `/company/message`,
    },
  ];

  const visibleItems = taskItems.filter(item => item.triggerFunction());
  
  // デバッグ用ログ
  console.log('🎨 Visible tasks:', visibleItems.length);
  console.log('🎨 Task triggers:', {
    hasNoJobPostings: checkNoJobPostings(),
    hasNewApplication: checkNewApplication(),
    hasUnreadApplication: checkUnreadApplication(),
    hasNewMessage: checkNewMessage(),
    hasUnreadMessage: checkUnreadMessage(),
    hasUnregisteredInterviewResult: checkUnregisteredInterviewResult()
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(visibleItems.length / itemsPerPage);
  const displayedItems = visibleItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTaskItemClick = (item: TaskItem) => {
    if (item.navigateTo) {
      if (item.id === '2' && userState.newApplications && userState.newApplications.length > 0) {
        router.push(`/company/message`);
      } else if (item.id === '3' && userState.unreadApplications && userState.unreadApplications.length > 0) {
        router.push(`/company/message`);
      } else if (item.id === '4' && userState.newMessages && userState.newMessages.length > 0) {
        const roomId = userState.newMessages[0].roomId;
        router.push(`/company/message/${roomId}`);
      } else if (item.id === '5' && userState.unreadMessages && userState.unreadMessages.length > 0) {
        const roomId = userState.unreadMessages[0].roomId;
        router.push(`/company/message/${roomId}`);
      } else if (item.id === '6' && userState.unregisteredInterviews && userState.unregisteredInterviews.length > 0) {
        router.push(`/company/message`);
      } else {
        router.push(item.navigateTo);
      }
    }
  };

  // Figma完全準拠のスタイル定義（Figmaのデザインそのまま）
  const todoListWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const todoItemStyle: React.CSSProperties = {
    background: 'white',
    padding: '16px 24px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    width: '100%',
  };

  const todoItemRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '24px',
  };

  const gradientTagStyle: React.CSSProperties = {
    background: 'linear-gradient(to left, #86c36a, #65bdac)',
    borderRadius: '8px',
    height: '32px',
    width: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    flexShrink: 0,
  };

  const gradientTagTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '14px',
    color: 'white',
    textAlign: 'center',
    letterSpacing: '1.4px',
    lineHeight: '1.6',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const todoTextsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    minWidth: 0,
  };

  const todoTitleStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    color: '#323232',
    lineHeight: '2',
    margin: 0,
    letterSpacing: '1.6px',
  };

  const todoDescriptionStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 500,
    fontSize: '10px',
    color: '#999999',
    lineHeight: '1.6',
    margin: 0,
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div style={todoListWrapperStyle}>
      {displayedItems.length > 0 ? (
        <>
          {displayedItems.map((item, index) => (
            <div
              key={item.id}
              style={todoItemStyle}
              onClick={() => handleTaskItemClick(item)}
            >
              <div style={todoItemRowStyle}>
                {/* Gradient tag */}
                <div style={gradientTagStyle}>
                  <div style={gradientTagTextStyle}>
                    グループ名テキスト
                  </div>
                </div>
                
                {/* Text content */}
                <div style={todoTextsWrapperStyle}>
                  <div style={todoTitleStyle}>
                    {item.title}
                  </div>
                  <div style={todoDescriptionStyle}>
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '40px' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '80px',
          padding: '0',
          width: '100%',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '80px 0',
            width: '100%',
          }}>
            <div style={{
              position: 'relative',
              width: '120px',
              height: '120px',
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: 'auto',
                aspectRatio: '50.0049/42.1957',
                left: '0',
                right: '0',
                top: 'calc(50% + 0.293px)',
                transform: 'translateY(-50%)',
              }}>
                <img
                  src='/images/list.svg'
                  alt=''
                  width={120}
                  height={101}
                  style={{
                    maxWidth: 'none',
                    width: '100%',
                    height: '100%',
                    filter: 'brightness(0) saturate(100%) invert(87%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)',
                  }}
                  loading="lazy"
                />
              </div>
            </div>
            
            <div style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 500,
              lineHeight: 2,
              fontStyle: 'normal',
              position: 'relative',
              color: '#323232',
              fontSize: '16px',
              textAlign: 'center',
              whiteSpace: 'normal',
              letterSpacing: '1.6px',
            }}>
              <p style={{
                display: 'block',
                margin: 0,
                marginBottom: '0',
              }}>
                候補者からの新しい応募やメッセージがあると、
              </p>
              <p style={{
                display: 'block',
                margin: 0,
              }}>
                こちらに一覧で表示されます。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="blue-gradient"
                onClick={() => router.push('/company/job/new')}
                className="h-auto px-6 py-3.5 rounded-[32px] w-auto"
              >
                求人を作成する
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/company/search')}
                style={{ 
                  borderColor: '#0F9058',
                  color: '#0F9058'
                }}
                className="hover:bg-green-50 h-auto px-6 py-3.5 rounded-[32px] w-auto"
              >
                候補者を探す
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}