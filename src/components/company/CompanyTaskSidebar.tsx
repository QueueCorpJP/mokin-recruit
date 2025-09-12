 'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NoticeData, formatNoticeDate } from '@/lib/utils/noticeHelpers.client';
import { tr } from 'zod/v4/locales';
import { Button } from '@/components/ui/button';
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client';
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

interface CompanyAccountData {
  plan: string;
  scoutLimit: number;
  remainingTickets?: number;
  nextUpdateDate: string;
}

interface CompanyTaskSidebarProps {
  className?: string;
  showTodoAndNews?: boolean;
  taskData?: TaskData;
  notices?: NoticeData[];
  companyAccountData?: CompanyAccountData | null;
}

export function CompanyTaskSidebar({ className, showTodoAndNews = false, taskData, notices = [], companyAccountData }: CompanyTaskSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  console.log('[CompanyTaskSidebar] Props received:', {
    showTodoAndNews,
    notices: notices?.length || 0,
    companyAccountData
  });

  // クライアント直接取得用のローカルステート（propsが無い場合に使用）
  const [fetchedNotices, setFetchedNotices] = useState<NoticeData[]>([]);
  const [fetchedCompanyAccountData, setFetchedCompanyAccountData] = useState<CompanyAccountData | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = createBrowserSupabaseClient();

    const fetchSidebarData = async () => {
      try {
        // ユーザー情報取得（RLS用に認証ユーザーで実行）
        const { data: { user } } = await supabase.auth.getUser();

        // お知らせ（公開済み）最新3件
        if (!notices || notices.length === 0) {
          const { data: noticeRows } = await supabase
            .from('notices')
            .select('id, title, slug, content, excerpt, published_at, created_at')
            .eq('status', 'PUBLISHED')
            .not('published_at', 'is', null)
            .order('published_at', { ascending: false })
            .limit(3);
          if (mounted) setFetchedNotices(noticeRows || []);
        }

        // プラン情報（company_users 経由で company_accounts を参照）
        if (!companyAccountData && user) {
          const { data: companyAccountRow, error } = await supabase
            .from('company_users')
            .select(`
              company_account_id,
              company_accounts!company_account_id (
                id,
                company_name,
                plan,
                scout_limit,
                created_at
              )
            `)
            .eq('email', user.email as string)
            .single();

          if (!error) {
            const account: any = companyAccountRow?.company_accounts;
            if (account && mounted) {
              // サイクル算出
              const createdAt = new Date(account.created_at);
              const addMonths = (date: Date, months: number) => {
                const d = new Date(date.getTime());
                const targetMonth = d.getMonth() + months;
                d.setMonth(targetMonth);
                return d;
              };
              const now = new Date();
              let cycleStart = new Date(createdAt.getTime());
              if (now >= addMonths(createdAt, 1)) {
                const monthsDiff = (now.getFullYear() - createdAt.getFullYear()) * 12 + (now.getMonth() - createdAt.getMonth());
                cycleStart = addMonths(createdAt, monthsDiff);
                if (cycleStart > now) {
                  cycleStart = addMonths(cycleStart, -1);
                }
              }
              const nextCycleStart = addMonths(cycleStart, 1);

              // 当サイクルの使用数集計
              let usedThisCycle = 0;
              {
                const { count } = await supabase
                  .from('scout_sends')
                  .select('id', { count: 'exact', head: true })
                  .eq('company_account_id', account.id)
                  .gte('sent_at', cycleStart.toISOString())
                  .lt('sent_at', nextCycleStart.toISOString());
                usedThisCycle = typeof count === 'number' ? count : 0;
              }
              const remainingTickets = Math.max(0, (account.scout_limit as number) - usedThisCycle);

              setFetchedCompanyAccountData({
                plan: account.plan,
                scoutLimit: account.scout_limit,
                remainingTickets,
                nextUpdateDate: nextCycleStart.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).replace(/\//g, '/')
              });
            }
          }
        }
      } catch (e) {
        // 取得失敗時は静かに無視（サイドバーは表示継続）
        console.error('[CompanyTaskSidebar] Failed to fetch sidebar data', e);
      }
    };

    fetchSidebarData();
    return () => { mounted = false; };
  }, [companyAccountData, notices]);

  // デフォルトのサンプルタスクデータ
  const defaultTaskData: TaskData = {
    hasNoJobPostings: false,
    hasNewApplication: true,
    newApplications: [
      {
        id: '1',
        candidateName: '田中太郎',
        jobTitle: 'フロントエンドエンジニア',
        appliedAt: new Date('2024-01-15T10:30:00'),
      },
      {
        id: '2', 
        candidateName: '佐藤花子',
        jobTitle: 'バックエンドエンジニア',
        appliedAt: new Date('2024-01-14T14:20:00'),
      }
    ],
    hasUnreadApplication: false,
    hasNewMessage: true,
    newMessages: [
      {
        roomId: 'room_001',
        candidateName: '山田次郎',
        jobTitle: 'UI/UXデザイナー',
        sentAt: new Date('2024-01-15T16:45:00'),
        messagePreview: '面接の件でお聞きしたいことがあります',
      },
      {
        roomId: 'room_002',
        candidateName: '鈴木美咲',
        jobTitle: 'プロダクトマネージャー',
        sentAt: new Date('2024-01-15T12:30:00'),
        messagePreview: 'ご連絡ありがとうございます。来週の面接について...',
      },
      {
        roomId: 'room_003',
        candidateName: '高橋健太',
        jobTitle: 'データサイエンティスト',
        sentAt: new Date('2024-01-14T18:15:00'),
        messagePreview: '技術的な質問がございます',
      }
    ],
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

  // props が優先。なければローカル取得データを使用
  const resolvedCompanyAccountData = companyAccountData ?? fetchedCompanyAccountData;
  const resolvedNotices = (notices && notices.length > 0) ? notices : fetchedNotices;

  return (
    <div className={cn("w-full max-w-[320px]", className)}>
      {/* プラン情報セクション */}
      <div style={{ ...headingListStyle, marginBottom: '80px' }}>
        <SectionHeading
          iconSrc='/images/ticket.svg'
          iconAlt='スカウトチケットアイコン'
        >
          スカウトチケット
        </SectionHeading>
        
        {/* Upper Block - Plan Information (Figma design) */}
        <div style={upperBlockStyle}>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <div style={planTitleStyle}>
              {resolvedCompanyAccountData?.plan === 'standard' ? 'スタンダードプラン' : 'ベーシックプラン'}
            </div>
            <div style={planInfoStyle}>
              <div>
                <span style={remainingTextStyle}>残数：</span>
                <span style={remainingNumberStyle}>{resolvedCompanyAccountData?.scoutLimit ?? 0}</span>
              </div>
              <div style={nextUpdateStyle}>
                次回更新日：{resolvedCompanyAccountData?.nextUpdateDate || '読み込み中...'}
              </div>
            </div>
          </div>
          <Button
                          variant='green-outline'
                          size='lg'
                          onClick={() => router.push('/company/contact')}
                          style={{
                            width: '100%',
                            paddingLeft: 40,
                            paddingRight: 40,
                            height: 60,
                            borderRadius: '999px',
                            fontSize: '12px',
                            lineHeight: '1.4',
                            fontWeight: 700,
                            letterSpacing: '0.05em'
                          }}
                        >
                          チケットの追加購入／<br />プラン変更
                        </Button>
 
          <div style={faqLinkStyle}>
            <img 
              src="/images/question.svg" 
              alt="プラン比較"
              width={16}
              height={16}
              loading="lazy"
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
      <div style={{ ...headingListStyle, marginBottom: '80px' }}>
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
      <div style={{ ...headingListStyle, marginBottom: '80px' }}>
        <SectionHeading
          iconSrc='/images/new.svg'
          iconAlt='お知らせアイコン'
        >
          お知らせ
        </SectionHeading>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* お知らせカード - 最新3件まで表示 */}
          {resolvedNotices.length > 0 ? (
            resolvedNotices.slice(0, 3).map((notice) => (
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
             
             <img 
               src="/images/book.svg"
               alt="ご利用ガイド"
               width={24}
               height={24}
               loading="lazy"
               style={{
                 display: 'block',
                 maxWidth: 'none',
                 filter: 'brightness(0) saturate(100%) invert(36%) sepia(75%) saturate(1045%) hue-rotate(114deg) brightness(91%) contrast(92%)',
               }}
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
             <img 
               src="/images/question.svg"
               alt="よくある質問"
               width={24}
               height={24}
               loading="lazy"
               style={{
                 display: 'block',
                 maxWidth: 'none',
                 filter: 'brightness(0) saturate(100%) invert(36%) sepia(75%) saturate(1045%) hue-rotate(114deg) brightness(91%) contrast(92%)',
               }}
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
           
            onClick={() => router.push('/company/contact')}
          >
           <img 
             src="/images/consult.svg"
             alt="お問い合わせ"
           />
          </div>
        </div>
      </div>
    </div>
  );
}