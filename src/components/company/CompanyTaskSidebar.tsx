'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NoticeData, formatNoticeDate } from '@/lib/utils/noticeHelpers';

// TaskDataインターフェース（TaskListと同じ）
interface TaskData {
  hasNoJobPostings: boolean;
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

interface CompanyTaskSidebarProps {
  className?: string;
  showTodoAndNews?: boolean;
  taskData?: TaskData;
  notices?: NoticeData[];
}

export function CompanyTaskSidebar({ className, showTodoAndNews = false, taskData, notices = [] }: CompanyTaskSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // デフォルトの空のタスクデータ
  const defaultTaskData: TaskData = {
    hasNoJobPostings: false,
    hasNewApplication: false,
    hasUnreadApplication: false, 
    hasNewMessage: false,
    hasUnreadMessage: false,
    hasUnregisteredInterviewResult: false,
  };

  const userState = taskData || defaultTaskData;

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
    {
      id: '1',
      title: 'まずは求人を登録しましょう。',
      description: '求人を登録すると、スカウト送信が可能になります。',
      triggerFunction: checkNoJobPostings,
      navigateTo: '/company/job/new',
    },
    {
      id: '2',
      title: '確認していない応募があります。早めに対応しましょう。',
      description: generateSubText(userState.newApplications || [], 'application'),
      triggerFunction: checkNewApplication,
      navigateTo: `/company/message`,
    },
    {
      id: '3', 
      title: '確認していない応募があります。早めに対応しましょう。',
      description: generateSubText(userState.unreadApplications || [], 'application'),
      triggerFunction: checkUnreadApplication,
      navigateTo: `/company/message`,
    },
    {
      id: '4',
      title: '求職者からメッセージが届きました！内容を確認しましょう。',
      description: generateSubText(userState.newMessages || [], 'message'),
      triggerFunction: checkNewMessage,
      navigateTo: `/company/message`,
    },
    {
      id: '5',
      title: '未読のメッセージがあります。早めに確認しましょう。',
      description: generateSubText(userState.unreadMessages || [], 'message'),
      triggerFunction: checkUnreadMessage,
      navigateTo: `/company/message`,
    },
    {
      id: '6',
      title: '面談はいかがでしたか？選考結果を登録しましょう。',
      description: generateSubText(userState.unregisteredInterviews || [], 'interview'),
      triggerFunction: checkUnregisteredInterviewResult,
      navigateTo: `/company/message`,
    },
  ];

  const visibleItems = taskItems.filter(item => item.triggerFunction());

  const handleTaskItemClick = (item: TaskItem) => {
    if (item.navigateTo) {
      router.push(item.navigateTo);
    }
  };

  // Figmaデザインに基づくスタイル定義
  // Upper block (Plan Information) styles
  const upperBlockStyle: React.CSSProperties = {
    background: 'white',
    padding: '24px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    alignItems: 'center',
  };

  const planTitleStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '18px',
    color: '#0F9058',
    textAlign: 'center',
    letterSpacing: '1.8px',
    lineHeight: '1.6',
  };

  const planInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    width: '100%',
  };

  const remainingTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 400,
    fontSize: '16px',
    color: '#323232',
    letterSpacing: '1.6px',
    lineHeight: '2',
  };

  const remainingNumberStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '32px',
    color: '#323232',
    letterSpacing: '3.2px',
    lineHeight: '1.6',
  };

  const nextUpdateStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    color: '#323232',
    letterSpacing: '1.4px',
    lineHeight: '1.6',
  };

  const planButtonStyle: React.CSSProperties = {
    background: 'white',
    border: '1px solid #0F9058',
    borderRadius: '32px',
    padding: '10px 24px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const planButtonTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '12px',
    color: '#0F9058',
    letterSpacing: '1.2px',
    lineHeight: '1.6',
    textAlign: 'center',
  };

  const faqLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  };

  const faqTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '14px',
    color: '#999999',
    letterSpacing: '1.4px',
    lineHeight: '1.6',
    textDecoration: 'underline',
  };

  // Lower block (Help Section) styles
  const lowerBlockStyle: React.CSSProperties = {
    background: 'white',
    padding: '24px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    alignItems: 'center',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    color: '#323232',
    textAlign: 'center',
    letterSpacing: '1.6px',
    lineHeight: '2',
    width: '100%',
  };

  const helpButtonStyle: React.CSSProperties = {
    background: 'white',
    border: '1px solid #0F9058',
    borderRadius: '32px',
    padding: '14px 40px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const helpButtonTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    color: '#0F9058',
    letterSpacing: '1.6px',
    lineHeight: '2',
  };

  const contactTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 600,
    fontSize: '14px',
    color: '#323232',
    textAlign: 'center',
    letterSpacing: '1.4px',
    lineHeight: '1.6',
  };

  const contactLinkStyle: React.CSSProperties = {
    color: '#0F9058',
    textDecoration: 'underline',
    cursor: 'pointer',
  };

  const dividerStyle: React.CSSProperties = {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #E5E5E5, transparent)',
  };

  const supportBannerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #FFE082 0%, #FFD54F 100%)',
    borderRadius: '10px',
    padding: '15px 24px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  };

  const freeTagStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '37px',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const freeTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '18px',
    color: '#FF9D00',
    letterSpacing: '1.8px',
    lineHeight: '1.6',
  };

  const supportTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    color: '#323232',
    letterSpacing: '1.6px',
    lineHeight: '1.6',
  };

  const headingListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  return (
    <div className={cn("w-full max-w-[320px]", className)}>
      {/* プラン情報セクション */}
      <div style={{ ...headingListStyle, marginBottom: '20px' }}>
        <SectionHeading
          iconSrc='/images/ticket.svg'
          iconAlt='スカウトチケットアイコン'
        >
          スカウトチケット
        </SectionHeading>
        
        {/* Upper Block - Plan Information (Figma design) */}
        <div style={upperBlockStyle}>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <div style={planTitleStyle}>スタンダードプラン</div>
            <div style={planInfoStyle}>
              <div>
                <span style={remainingTextStyle}>残数：</span>
                <span style={remainingNumberStyle}>100</span>
              </div>
              <div style={nextUpdateStyle}>残り期間：2024/12/31</div>
            </div>
          </div>
          
          <button 
            style={planButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0F9FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <div style={planButtonTextStyle}>
              チケットの追加購入／<br />プラン変更
            </div>
          </button>
          
          <div style={faqLinkStyle}>
            <img src="/images/question.svg" 
            className='font-[#999] w-4 h-4'
            style={{
                    display: 'block',
                    maxWidth: 'none',
                    filter: 'brightness(0) saturate(100%) invert(87%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(70%) contrast(95%)',
                  }}/>
            <span style={faqTextStyle}>プランごとの違いはこちら</span>
          </div>
        </div>
      </div>

      {/* 対応リストセクション - mypageでのみ表示 */}
      {showTodoAndNews && (
      <div style={{ ...headingListStyle, marginBottom: '20px' }}>
        <SectionHeading
          iconSrc='/images/list.svg'
          iconAlt='対応リストアイコン'
        >
          対応リスト
        </SectionHeading>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visibleItems.length > 0 ? (
            <>
              {/* 最初の1件のみ表示 */}
              {visibleItems.slice(0, 1).map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'white',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleTaskItemClick(item)}
                >
                  {/* グラデーションタグ */}
                  <div style={{
                    background: 'linear-gradient(to left, #86c36a, #65bdac)',
                    borderRadius: '8px',
                    padding: '0 20px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '100%',
                  }}>
                    <span style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'white',
                      letterSpacing: '1.4px',
                      lineHeight: '1.6',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      グループ名テキスト
                    </span>
                  </div>
                  
                  {/* メインテキスト */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#323232',
                      letterSpacing: '1.6px',
                      lineHeight: '2',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: '10px',
                      fontWeight: 500,
                      color: '#999999',
                      letterSpacing: '1px',
                      lineHeight: '1.6',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                    }}>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* もっと見るボタン */}
              <button 
                style={{
                  background: 'linear-gradient(135deg, #0F9058, #65bdac)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '15px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
                  width: 'full',
                }}
                onClick={() => router.push('/company/task')}
              >
                <span style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '1.6px',
                  lineHeight: '2',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  textAlign: 'center',
                }}>
                  すべての対応リストを見る
                </span>
                <svg width="12" height="12" viewBox="0 0 256 448" fill="none">
                  <path d="M17.9 193.2L193.2 17.9C205.8 5.3 226.2 5.3 238.8 17.9L238.9 18C251.5 30.6 251.5 51 238.9 63.6L99.5 203L238.9 342.4C251.5 355 251.5 375.4 238.9 388L238.8 388.1C226.2 400.7 205.8 400.7 193.2 388.1L17.9 212.8C5.3 200.2 5.3 179.8 17.9 167.2L17.9 193.2Z" fill="white" transform="scale(-1,1) translate(-256,0)"/>
                </svg>
              </button>
            </>
          ) : (
            /* 対応リストが0件の場合の表示 */
            <div style={{
              background: 'white',
              padding: '40px 24px',
              borderRadius: '8px',
              boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <span style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                color: '#323232',
                letterSpacing: '1.6px',
                lineHeight: '2',
              }}>
                現在対応すべきことはありません。
              </span>
            </div>
          )}
        </div>
      </div>

      )}

      {/* お知らせセクション - mypageでのみ表示 */}
      {showTodoAndNews && (
      <div style={{ ...headingListStyle, marginBottom: '20px' }}>
        <SectionHeading
          iconSrc='/images/new.svg'
          iconAlt='お知らせアイコン'
        >
          お知らせ
        </SectionHeading>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* お知らせカード - 最新3件まで表示 */}
          {notices.length > 0 ? (
            notices.slice(0, 3).map((notice) => (
              <div 
                key={notice.id}
                style={{
                  background: 'white',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => router.push(`/candidate/news/${notice.id}`)}
              >
                {/* 日付 */}
                <div style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: '10px',
                  fontWeight: 500,
                  color: '#999999',
                  letterSpacing: '1px',
                  lineHeight: '1.6',
                }}>
                  {formatNoticeDate(notice.published_at || notice.created_at)}
                </div>
                
                {/* タイトル */}
                <div style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#323232',
                  letterSpacing: '1.6px',
                  lineHeight: '2',
                  height: '63px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}>
                  {notice.title}
                </div>
              </div>
            ))
          ) : (
            <div style={{
              background: 'white',
              padding: '40px 24px',
              borderRadius: '8px',
              boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <span style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                color: '#999999',
                letterSpacing: '1.6px',
                lineHeight: '2',
              }}>
                お知らせはありません
              </span>
            </div>
          )}
          
          {/* もっと見るボタン */}
          <button 
            style={{
              background: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
              width: "full",
            }}
            onClick={() => router.push('/candidate/news')}
          >
            <span style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: '#0F9058',
              letterSpacing: '1.6px',
              lineHeight: '2',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              textAlign: 'center',
            }}>
              お知らせ一覧を見る
            </span>
            <svg width="12" height="12" viewBox="0 0 256 448" fill="none">
              <path d="M17.9 193.2L193.2 17.9C205.8 5.3 226.2 5.3 238.8 17.9L238.9 18C251.5 30.6 251.5 51 238.9 63.6L99.5 203L238.9 342.4C251.5 355 251.5 375.4 238.9 388L238.8 388.1C226.2 400.7 205.8 400.7 193.2 388.1L17.9 212.8C5.3 200.2 5.3 179.8 17.9 167.2L17.9 193.2Z" fill="#0F9058" transform="scale(-1,1) translate(-256,0)"/>
            </svg>
          </button>
        </div>
      </div>
      )}

      {/* ヘルプセクション */}
      <div style={headingListStyle}>
        <SectionHeading
          iconSrc='/images/operation.svg'
          iconAlt='ヘルプアイコン'
        >
          お困りですか？
        </SectionHeading>
        
        {/* Lower Block - Help Section (Figma design) */}
        <div style={lowerBlockStyle}>
          <div style={sectionTitleStyle}>サービスの使い方を知りたい</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <button 
              style={helpButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F9FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
              onClick={() => router.push('/company/guide')}
            >
             
             <img src="/images/book.svg" 
             style={
              {
                    display: 'block',
                    maxWidth: 'none',
                    width: '24px',
                    height: '24px',
                    filter: 'brightness(0) saturate(100%) invert(36%) sepia(75%) saturate(1045%) hue-rotate(114deg) brightness(91%) contrast(92%)',
                  }
             }
             />
              <span style={helpButtonTextStyle}>ご利用ガイド</span>
            </button>
            
            <button 
              style={helpButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F9FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
              onClick={() => router.push('/company/faq')}
            >
             <img src="/images/question.svg" 
             style={
              {
                    display: 'block',
                    maxWidth: 'none',
                    width: '24px',
                    height: '24px',
                    filter: 'brightness(0) saturate(100%) invert(36%) sepia(75%) saturate(1045%) hue-rotate(114deg) brightness(91%) contrast(92%)',
                  }
             }
             />

              <span style={helpButtonTextStyle}>よくある質問</span>
            </button>
          </div>
          
          <div style={contactTextStyle}>
            解決しない場合は、<br />
            お気軽に<span style={contactLinkStyle} onClick={() => router.push('/company/contact')}>お問い合わせ</span>ください。
          </div>
          
          <div style={dividerStyle} />
          
          <div style={sectionTitleStyle}>スカウトがうまくいかない</div>
          
          <div 
            // style={supportBannerStyle}
           
            onClick={() => router.push('/company/support')}
          >
           <img src="/images/consult.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}