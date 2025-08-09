"use client"
import { useEffect, useState } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { FaqBox } from '@/components/ui/FaqBox';
import { Pagination } from '@/components/ui/Pagination';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// タスクアイテムの型定義
interface TaskItem {
  id: string;
  title: string;
  description: string;
  iconSrc?: string;
  completed?: boolean;
  triggerFunction: () => boolean; // 表示条件を判定する関数
  navigateTo?: string;
}

// ユーザー状態の型定義（実際のAPIから取得するデータを想定）
interface UserState {
  // 会員情報関連
  profileIncomplete: boolean; // 会員情報が不完全かどうか
  
  // スカウト関連
  hasNewScout: boolean; // 新着スカウトの有無
  newScoutDate?: Date; // 新着スカウト受信日時
  newScoutCompanyName?: string; // スカウト企業名
  newScoutJobTitle?: string; // 求人タイトル
  newScoutRoomId?: string; // スカウトのメッセージルームID
  
  hasUnreadScout: boolean; // 未読スカウトの有無（72h経過）
  unreadScoutDate?: Date; // 未読スカウト受信日時
  unreadScoutCompanyName?: string; // 未読スカウト企業名
  unreadScoutJobTitle?: string; // 未読求人タイトル
  unreadScoutRoomId?: string; // 未読スカウトのメッセージルームID
  
  // メッセージ関連
  hasNewMessage: boolean; // 新着メッセージの有無
  newMessageDate?: Date; // 新着メッセージ受信日時
  newMessageCompanyName?: string; // メッセージ企業名
  newMessageJobTitle?: string; // メッセージ求人タイトル
  newMessageRoomId?: string; // 新着メッセージのルームID
  
  hasUnreadMessage: boolean; // 未読メッセージの有無（72h経過）
  unreadMessageDate?: Date; // 未読メッセージ受信日時
  unreadMessageCompanyName?: string; // 未読メッセージ企業名
  unreadMessageJobTitle?: string; // 未読メッセージ求人タイトル
  unreadMessageRoomId?: string; // 未読メッセージのルームID
}

export default function CandidateTaskPage() {
  // --- レスポンシブ対応: モバイル判定 ---
  const [isMobile, setIsMobile] = useState(false);
  // --- ページネーション用の状態 ---
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // ユーザー状態（実際はAPIから取得）
  const [userState, setUserState] = useState<UserState>({
    // 会員情報関連（空のトリガー関数で非表示）
    profileIncomplete: false,
    
    // スカウト関連（空のトリガー関数で非表示）
    hasNewScout: false,
    newScoutDate: undefined,
    newScoutCompanyName: undefined,
    newScoutJobTitle: undefined,
    newScoutRoomId: undefined,
    
    hasUnreadScout: false,
    unreadScoutDate: undefined,
    unreadScoutCompanyName: undefined,
    unreadScoutJobTitle: undefined,
    unreadScoutRoomId: undefined,
    
    // メッセージ関連（message.mdの仕様に従って実装）
    hasNewMessage: false,
    newMessageDate: undefined,
    newMessageCompanyName: undefined,
    newMessageJobTitle: undefined,
    newMessageRoomId: undefined,
    
    hasUnreadMessage: false,
    unreadMessageDate: undefined,
    unreadMessageCompanyName: undefined,
    unreadMessageJobTitle: undefined,
    unreadMessageRoomId: undefined,
  });

  // 72時間経過を判定するヘルパー関数（message.mdの仕様）
  const is72HoursPassed = (date?: Date): boolean => {
    if (!date) return false;
    const seventyTwoHoursInMs = 72 * 60 * 60 * 1000;
    return Date.now() - date.getTime() >= seventyTwoHoursInMs;
  };

  // 72時間以内かどうかを判定するヘルパー関数
  const isWithin72Hours = (date?: Date): boolean => {
    if (!date) return false;
    const seventyTwoHoursInMs = 72 * 60 * 60 * 1000;
    return Date.now() - date.getTime() < seventyTwoHoursInMs;
  };

  // 表示条件関数（トリガー関数）- message.mdの仕様に基づく
  const checkProfileIncomplete = () => userState.profileIncomplete;
  
  // スカウト関連（空のトリガー関数で非表示）
  const checkNewScout = () => false;
  const checkUnreadScout = () => false;
  
  // メッセージ関連（message.mdの仕様）
  const checkNewMessage = () => 
    userState.hasNewMessage && isWithin72Hours(userState.newMessageDate);
    
  const checkUnreadMessage = () => 
    userState.hasUnreadMessage && is72HoursPassed(userState.unreadMessageDate);

  // サブテキストを動的に生成する関数
  const generateSubText = (companyName?: string, jobTitle?: string): string => {
    if (companyName && jobTitle) {
      return `${companyName} | ${jobTitle}`;
    }
    return '企業名 | 求人タイトル'; // デフォルト値
  };

  // タスクリストのデータ（message.mdの仕様に基づく）
  const taskItems: TaskItem[] = [
    {
      id: '1',
      title: '会員情報を充実させましょう。スカウトが届きやすくなります。',
      description: '', // サブテキストなし
      iconSrc: '/images/check.svg',
      triggerFunction: checkProfileIncomplete,
      navigateTo: '/candidate/profile', // 会員情報編集ページ
    },
    {
      id: '2',
      title: 'あなたにスカウトが届きました！内容を確認しましょう。',
      description: generateSubText(userState.newScoutCompanyName, userState.newScoutJobTitle),
      iconSrc: '/images/check.svg',
      triggerFunction: checkNewScout,
      navigateTo: `/candidate/message`, // 対象の企業とのメッセージ画面
    },
    {
      id: '3',
      title: '未読のスカウトがあります。早めに確認しましょう。',
      description: generateSubText(userState.unreadScoutCompanyName, userState.unreadScoutJobTitle),
      iconSrc: '/images/check.svg',
      triggerFunction: checkUnreadScout,
      navigateTo: `/candidate/message`, // 対象の企業とのメッセージ画面
    },
    {
      id: '4',
      title: '企業からメッセージが届きました！内容を確認しましょう。',
      description: generateSubText(userState.newMessageCompanyName, userState.newMessageJobTitle),
      iconSrc: '/images/check.svg',
      triggerFunction: checkNewMessage,
      navigateTo: `/candidate/message`, // 対象の企業とのメッセージ画面
    },
    {
      id: '5',
      title: '未読のメッセージがあります。早めに確認しましょう。',
      description: generateSubText(userState.unreadMessageCompanyName, userState.unreadMessageJobTitle),
      iconSrc: '/images/check.svg',
      triggerFunction: checkUnreadMessage,
      navigateTo: `/candidate/message`, // 対象の企業とのメッセージ画面
    },
  ];

  // トリガー関数の条件を満たすアイテムのみをフィルタリング
  const visibleItems = taskItems.filter(item => item.triggerFunction());

  // ページごとに表示するアイテム数
  const itemsPerPage = 5;
  const totalPages = Math.ceil(visibleItems.length / itemsPerPage);
  const displayedItems = visibleItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // タスクアイテムクリックハンドラー（message.mdの仕様に基づく）
  const handleTaskItemClick = (item: TaskItem) => {
    if (item.navigateTo) {
      // メッセージ関連のタスクの場合、特定のチャットルームを開く
      if (item.id === '2' && userState.newScoutRoomId) {
        // 新着スカウトの場合
        router.push(`/candidate/message?room=${userState.newScoutRoomId}`);
      } else if (item.id === '3' && userState.unreadScoutRoomId) {
        // 未読スカウトの場合
        router.push(`/candidate/message?room=${userState.unreadScoutRoomId}`);
      } else if (item.id === '4' && userState.newMessageRoomId) {
        // 新着メッセージの場合
        router.push(`/candidate/message?room=${userState.newMessageRoomId}`);
      } else if (item.id === '5' && userState.unreadMessageRoomId) {
        // 未読メッセージの場合
        router.push(`/candidate/message?room=${userState.unreadMessageRoomId}`);
      } else {
        // その他のタスクの場合は通常の遷移
        router.push(item.navigateTo);
      }
    }
  };

  // --- ページ全体ラッパーのスタイル ---
  const pageWrapperStyle: React.CSSProperties = isMobile
    ? {
        paddingTop: '16px',
        paddingRight: '24px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        minHeight: '60vh',
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#F9F9F9',
      }
    : {
        paddingTop: '40px',
        paddingRight: '80px',
        paddingBottom: '80px',
        paddingLeft: '80px',
        minHeight: '60vh',
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#F9F9F9',
      };

  // --- 中央コンテンツラッパーのスタイル ---
  const contentWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
  };

  // --- 2カラムレイアウトのスタイル ---
  const twoColumnFlexStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '80px',
    width: '100%',
    justifyContent: 'center',
    alignItems: isMobile ? 'stretch' : 'flex-start',
  };
  // --- 左カラム（メイン） ---
  const mainColumnStyle: React.CSSProperties = {
    maxWidth: '880px',
    padding: isMobile ? '0' : '16px 24px',
    flex: 1,
    boxSizing: 'border-box',
    width: isMobile ? '100%' : undefined,
  };
  // --- 右カラム（サイド） ---
  const sideColumnStyle: React.CSSProperties = {
    maxWidth: isMobile ? 'none' : '320px',
    flex: isMobile ? undefined : '0 0 320px',
    boxSizing: 'border-box',
    width: isMobile ? '100%' : undefined,
  };

  // --- 見出しリスト用ラッパー ---
  const headingListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  // --- QAリンクボックス用スタイル ---
  const qaLinkBoxStyle: React.CSSProperties = {
    background: '#fff',
    padding: '15px 24px',
    borderRadius: '8px',
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    fontWeight: 700,
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.05)',

  };
  const qaLinkTextStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    color: '#0F9058',
    lineHeight: '200%',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  };

  // --- やることリスト用ラッパー（縦並び・gap:8px） ---
  const todoListWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  // --- やることリストの各アイテム ---
  const todoItemStyle: React.CSSProperties = {
    background: '#FFFFFF',
    padding: '16px 24px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  };
  const todoItemRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  };
  const todoTextsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };
  const todoBodyTextStyle: React.CSSProperties = {
    fontSize: '10px',
    lineHeight: '160%',
    color: '#999999',
    margin: 0,
  };

  return (
    <div style={pageWrapperStyle}>
      <main style={contentWrapperStyle}>
        {/* 2カラムレイアウト: PCは横並び, モバイルは縦並び */}
        <div style={twoColumnFlexStyle}>
          {/* 左カラム（メインコンテンツ） */}
          <div style={mainColumnStyle}>
            <div style={{ marginBottom: '8px' }}>
              <SectionHeading
                iconSrc='/images/list.svg'
                iconAlt='やることリストアイコン'
              >
                やることリスト
              </SectionHeading>
            </div>
            {/* やることリストを格納するラッパー */}
            <div style={todoListWrapperStyle}>
              {displayedItems.length > 0 ? (
                <>
                  {/* タスクリストのアイテムを動的に生成 */}
                  {displayedItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        ...todoItemStyle,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleTaskItemClick(item)}
                    >
                      <div style={todoItemRowStyle}>
                        <img
                          src={item.iconSrc || '/images/check.svg'}
                          alt={item.completed ? '完了チェック' : 'タスクアイコン'}
                          width={48}
                          height={48}
                          style={{ display: 'block' }}
                        />
                        <div style={todoTextsWrapperStyle}>
                          <span style={qaLinkTextStyle}>{item.title}</span>
                          <p style={todoBodyTextStyle}>{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* ページネーション */}
                  <div style={{ marginTop: '40px' }}>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </>
              ) : (
                /* 空の状態のコンポーネント - Figmaデザイン完全再現 */
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '80px',
                  padding: '0',
                  width: '100%',
                }}>
                  {/* メインコンテンツ */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '80px 0',
                    width: '100%',
                  }}>
                    {/* リストアイコン（大） - 120px 灰色 */}
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
                          style={{
                            display: 'block',
                            maxWidth: 'none',
                            width: '100%',
                            height: '100%',
                            filter: 'brightness(0) saturate(100%) invert(87%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)',
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* 説明文 */}
                    <div style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontWeight: 500,
                      lineHeight: 2,
                      fontStyle: 'normal',
                      position: 'relative',
                      color: '#323232',
                      fontSize: '16px',
                      textAlign: 'center',
                      whiteSpace: isMobile ? 'normal' : 'nowrap',
                      letterSpacing: '1.6px',
                    }}>
                      <p style={{
                        display: 'block',
                        margin: 0,
                        marginBottom: '0',
                      }}>
                        企業からの新しいスカウトやメッセージがあると、
                      </p>
                      <p style={{
                        display: 'block',
                        margin: 0,
                      }}>
                        こちらに一覧で表示されます。
                      </p>
                    </div>

                    {/* 求人を探すボタン */}
                    <Button
                      variant="blue-gradient"
                      size="figma-default"
                      onClick={() => router.push('/candidate/search/setting')}
                      style={{ paddingTop: '16px', paddingBottom: '16px' }}
                    >
                      求人を探す
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* 右カラム（サイドコンテンツ） */}
          <div style={sideColumnStyle}>
            {/* バナー画像を表示 */}
            <img
              src='/images/banner01.png'
              alt='バナー画像01'
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '8px',
                marginBottom: '80px',
              }}
            />
            {/* 見出しリスト（縦並び・gap8px） */}
            <div style={headingListStyle}>
              <SectionHeading
                iconSrc='/images/question.svg'
                iconAlt='よくある質問アイコン'
              >
                よくある質問
              </SectionHeading>
              {/* FAQボックス（共通コンポーネント化） */}
              <FaqBox
                title='退会したい場合はどうすればいいですか？退会手続きの流れを教えてください。'
                body='マイページの「アカウント設定」から「退会」ボタンを押し、画面の案内に従って手続きを進めてください。退会後はすべてのデータが削除されます。'
              />
              <FaqBox
                title='パスワードを忘れた場合はどうすればいいですか？'
                body='ログイン画面の「パスワードをお忘れですか？」リンクから再設定手続きを行ってください。'
              />
              <FaqBox
                title='登録したメールアドレスを変更したいです。'
                body='マイページの「アカウント設定」からメールアドレスの変更が可能です。'
              />
              <FaqBox
                title='求人への応募方法を教えてください。'
                body='求人詳細ページの「応募する」ボタンから応募手続きを進めてください。'
              />
              <FaqBox
                title='企業からのスカウトを受け取るにはどうすればいいですか？'
                body='プロフィールを充実させることで、企業からのスカウトを受けやすくなります。'
              />
              <FaqBox
                title='面接日程の調整はどのように行いますか？'
                body='メッセージ機能を使って企業担当者と直接日程調整が可能です。'
              />
              {/* QA一覧を見るリンクボックス */}
              <div style={qaLinkBoxStyle}>
                <span style={{...qaLinkTextStyle, fontWeight: '700'}}>
                  Q&amp;A一覧を見る
                </span>
                <ChevronRightIcon
                  className="h-[16px] w-auto"
                  style={{ 
                    display: 'block', 
                    marginLeft: '12px',
                    color: '#0F9058'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}