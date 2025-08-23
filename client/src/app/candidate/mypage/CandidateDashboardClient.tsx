'use client';

import { useRouter } from 'next/navigation';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FaqBox } from '@/components/ui/FaqBox';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/button';
import { MessageListCard } from '@/components/ui/MessageListCard';
import { JobPostCard } from '@/components/ui/JobPostCard';
import { useState, useTransition } from 'react';
import { addToFavoritesServer, removeFromFavoritesServer } from '../search/setting/actions';

interface User {
  id: string;
  email: string;
  userType: 'candidate' | 'company_user' | 'admin';
  name?: string;
  emailConfirmed: boolean;
  lastSignIn?: string;
}

// JobPosting型を定義（必要に応じて拡張）
interface JobPosting {
  id: string;
  title: string;
  image_urls?: string[];
  appeal_points?: string[];
  company_name?: string;
  work_location?: string[];
  salary_min?: number;
  salary_max?: number;
  job_type?: string[];
  industry?: string[];
  starred?: boolean;
  [key: string]: any;
}

interface Task {
  id: string;
  title: string;
  description: string;
}

interface Message {
  id: string;
  sender: string;
  body: string;
  date: string;
}

interface CandidateDashboardClientProps {
  user: User;
  tasks: Task[];
  messages: Message[];
  jobs: JobPosting[];
}

export function CandidateDashboardClient({
  user,
  tasks,
  messages,
  jobs,
}: CandidateDashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [jobList, setJobList] = useState<JobPosting[]>(jobs);
  const [favoriteLoading, setFavoriteLoading] = useState<Record<string, boolean>>({});

  // スター切り替え（サーバーアクション使用）
  const handleStarClick = async (jobId: string) => {
    const job = jobList.find(j => j.id === jobId);
    if (!job) return;
    
    const isCurrentlyStarred = job.starred || false;

    // ローディング状態を設定
    setFavoriteLoading(prev => ({ ...prev, [jobId]: true }));

    try {
      startTransition(async () => {
        let response;
        if (isCurrentlyStarred) {
          response = await removeFromFavoritesServer(jobId);
        } else {
          response = await addToFavoritesServer(jobId);
        }

        if (response.success) {
          // 表示データを更新
          setJobList(jobs =>
            jobs.map((job) =>
              job.id === jobId ? { ...job, starred: !isCurrentlyStarred } : job
            )
          );
        } else {
          console.error('お気に入り操作エラー:', response.error);
          alert(response.error || 'お気に入り操作に失敗しました');
        }
        
        // ローディング状態を解除
        setFavoriteLoading(prev => ({ ...prev, [jobId]: false }));
      });
    } catch (error) {
      console.error('お気に入り操作エラー:', error);
      alert('ネットワークエラーが発生しました。インターネット接続を確認してください。');
      setFavoriteLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[1280px] mx-auto'>
        {/* --- ここからやることリスト＋FAQ/バナーの2カラムレイアウト --- */}
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start'>
          {/* 左カラム（やることリスト2セット） */}
          <div className='w-full max-w-[880px] flex-1 box-border md:px-6 px-0'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
              {/* やることリスト */}
              <div>
                <div
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <SectionHeading
                    iconSrc='/images/list.svg'
                    iconAlt='やることリストアイコン'
                    style={{ width: '100%' }}
                  >
                    やることリスト
                  </SectionHeading>
                </div>
                {/* やることリストを格納するラッパー */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {tasks.length === 0 ? (
                    <div
                      style={{
                        padding: 24,
                        textAlign: 'center',
                        color: '#999',
                      }}
                    >
                      現在やることはありません。
                    </div>
                  ) : (
                    tasks.map(task => (
                      <div
                        key={task.id}
                        style={{
                          background: '#FFFFFF',
                          padding: '16px 24px',
                          boxSizing: 'border-box',
                          borderRadius: '8px',
                          boxShadow: '0 0 20px rgba(0,0,0,0.05)',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '16px',
                          }}
                        >
                          <img
                            src={'/images/check.svg'}
                            alt={'タスクアイコン'}
                            width={48}
                            height={48}
                            style={{ display: 'block' }}
                          />
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                              minWidth: 0,
                              flex: 1,
                            }}
                          >
                            <span
                              style={{
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#0F9058',
                                lineHeight: '200%',
                                margin: 0,
                                whiteSpace: 'normal',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                wordBreak: 'break-word',
                              }}
                            >
                              {task.title}
                            </span>
                            <p
                              style={{
                                fontSize: '10px',
                                lineHeight: '160%',
                                color: '#999999',
                                margin: 0,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {task.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {/* ページネーション（ダミー） */}
                  {tasks.length > 0 && (
                    <div>
                      <div className="flex justify-center items-center py-4">
                        <span className="text-sm text-gray-500">
                          {tasks.length}件のタスクがあります
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {/* やることリスト一覧ボタン（緑アウトライン・ピル型） */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 24,
                  }}
                >
                  <Button
                    variant='green-outline'
                    size='lg'
                    style={{
                      paddingLeft: 40,
                      paddingRight: 40,
                      height: 60,
                      borderRadius: '999px',
                    }}
                  >
                    やることリスト一覧
                  </Button>
                </div>
              </div>
              {/* 新着メッセージ */}
              <div>
                <div style={{ marginBottom: 8 }}>
                  <SectionHeading
                    iconSrc='/images/mail.svg'
                    iconAlt='メッセージリストアイコン'
                  >
                    新着メッセージ
                  </SectionHeading>
                </div>
                {messages.length === 0 ? (
                  <div
                    style={{ padding: 24, textAlign: 'center', color: '#999' }}
                  >
                    現在新着メッセージはありません。
                  </div>
                ) : (
                  <MessageListCard messages={messages} />
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 24,
                  }}
                >
                  <Button
                    variant='green-outline'
                    size='lg'
                    style={{
                      paddingLeft: 40,
                      paddingRight: 40,
                      height: 60,
                      borderRadius: '999px',
                    }}
                  >
                    メッセージ一覧
                  </Button>
                </div>
              </div>
              {/* おすすめの求人 */}
              <div>
                <div style={{ marginBottom: 8 }}>
                  <SectionHeading
                    iconSrc='/images/boad02.svg'
                    iconAlt='求人カードアイコン'
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        width: '100%',
                      }}
                    >
                      <span style={{ flex: 1 }}>おすすめの求人</span>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 25'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M21.75 12.9141C21.75 10.3282 20.7228 7.84825 18.8943 6.01977C17.0658 4.19129 14.5859 3.16406 12 3.16406C9.41414 3.16406 6.93419 4.19129 5.10571 6.01977C3.27723 7.84825 2.25 10.3282 2.25 12.9141C2.25 15.4999 3.27723 17.9799 5.10571 19.8084C6.93419 21.6368 9.41414 22.6641 12 22.6641C14.5859 22.6641 17.0658 21.6368 18.8943 19.8084C20.7228 17.9799 21.75 15.4999 21.75 12.9141ZM0 12.9141C0 9.73146 1.26428 6.67922 3.51472 4.42878C5.76516 2.17834 8.8174 0.914063 12 0.914062C15.1826 0.914063 18.2348 2.17834 20.4853 4.42878C22.7357 6.67922 24 9.73146 24 12.9141C24 16.0967 22.7357 19.1489 20.4853 21.3993C18.2348 23.6498 15.1826 24.9141 12 24.9141C8.8174 24.9141 5.76516 23.6498 3.51472 21.3993C1.26428 19.1489 0 16.0967 0 12.9141ZM7.95938 8.6625C8.32969 7.61719 9.32344 6.91406 10.4344 6.91406H13.1672C14.8031 6.91406 16.125 8.24063 16.125 9.87188C16.125 10.9313 15.5578 11.9109 14.6391 12.4406L13.125 13.3078C13.1156 13.9172 12.6141 14.4141 12 14.4141C11.3766 14.4141 10.875 13.9125 10.875 13.2891V12.6562C10.875 12.2531 11.0906 11.8828 11.4422 11.6812L13.5187 10.4906C13.7391 10.3641 13.875 10.1297 13.875 9.87656C13.875 9.48281 13.5562 9.16875 13.1672 9.16875H10.4344C10.275 9.16875 10.1344 9.26719 10.0828 9.41719L10.0641 9.47344C9.85781 10.0594 9.21094 10.3641 8.62969 10.1578C8.04844 9.95156 7.73906 9.30469 7.94531 8.72344L7.96406 8.66719L7.95938 8.6625ZM10.5 17.4141C10.5 17.0162 10.658 16.6347 10.9393 16.3534C11.2206 16.0721 11.6022 15.9141 12 15.9141C12.3978 15.9141 12.7794 16.0721 13.0607 16.3534C13.342 16.6347 13.5 17.0162 13.5 17.4141C13.5 17.8119 13.342 18.1934 13.0607 18.4747C12.7794 18.756 12.3978 18.9141 12 18.9141C11.6022 18.9141 11.2206 18.756 10.9393 18.4747C10.658 18.1934 10.5 17.8119 10.5 17.4141Z'
                          fill='#999999'
                        />
                      </svg>
                    </div>
                  </SectionHeading>
                </div>
                {jobs.length === 0 ? (
                  <div
                    style={{ padding: 24, textAlign: 'center', color: '#999' }}
                  >
                    現在オススメの求人はありません。
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                    }}
                  >
                    {/* 求人カード */}
                    <div className='flex flex-col gap-4'>
                      {jobList.map(job => (
                        <JobPostCard
                          key={job.id}
                          imageUrl={
                            job.image_urls?.[0] ||
                            'https://placehold.jp/300x200.png'
                          }
                          imageAlt='求人画像'
                          title={job.title}
                          tags={job.appeal_points || []}
                          companyName={job.company_name || ''}
                          location={Array.isArray(job.work_location) ? job.work_location.join('、') : job.work_location || ''}
                          salary={job.salary_min && job.salary_max ? `${job.salary_min}万円〜${job.salary_max}万円` : '給与応相談'}
                          starred={job.starred || false}
                          apell={[]}
                          variant="mypage-simple"
                          showStar={true}
                          showCompanyName={true}
                          showLocation={false}
                          showSalary={false}
                          showApell={false}
                          imageWidth={103.5}
                          imageHeight={69}
                          isFavoriteLoading={favoriteLoading[job.id]}
                          onStarClick={() => handleStarClick(job.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {/* もっと見るボタン（Figma仕様） */}
                <button
                  onClick={() => router.push('/candidate/search/setting')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 15,
                    padding: '15px 24px',
                    borderRadius: 10,
                    background:
                      'linear-gradient(90deg, #198D76 0%, #1CA74F 100%)',
                    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{
                      color: '#FFF',
                      fontFamily:
                        'Noto Sans JP, Noto Sans JP Fallback, system-ui, sans-serif',
                      fontWeight: 700,
                      fontSize: 16,
                      lineHeight: '2em',
                      letterSpacing: '0.1em',
                      textAlign: 'left',
                      flex: 1,
                    }}
                  >
                    もっと見る
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 12,
                      height: 12,
                    }}
                  >
                    <svg
                      width='12'
                      height='12'
                      viewBox='0 0 12 12'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M4 2L8 6L4 10'
                        stroke='#FFF'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* 右カラム（FAQ/バナー） */}
          <div className='w-full md:max-w-[320px] md:flex-none'>
            {/* 3セクションをflex縦並びでラップ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
              {/* お知らせ一覧セクション */}
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <SectionHeading
                  iconSrc='/images/oshirase.svg'
                  iconAlt='お知らせアイコン'
                >
                  お知らせ一覧
                </SectionHeading>
                {/* お知らせ1 */}
                <div
                  style={{
                    background: '#fff',
                    padding: '15px 24px',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    width: '100%',
                    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      lineHeight: '160%',
                      color: '#999999',
                      fontFamily:
                        'Noto Sans JP, Noto Sans JP Fallback, system-ui, sans-serif',
                      display: 'block',
                      marginBottom: 4,
                    }}
                  >
                    2025/4/19
                  </span>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#323232',
                      lineHeight: '200%',
                      fontFamily:
                        'Noto Sans JP, Noto Sans JP Fallback, system-ui, sans-serif',
                    }}
                  >
                    システムメンテナンスのお知らせ
                  </div>
                </div>
                {/* お知らせ2 */}
                <div
                  style={{
                    background: '#fff',
                    padding: '15px 24px',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    width: '100%',
                    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      lineHeight: '160%',
                      color: '#999999',
                      fontFamily:
                        'Noto Sans JP, Noto Sans JP Fallback, system-ui, sans-serif',
                      display: 'block',
                      marginBottom: 4,
                    }}
                  >
                    2025/4/19
                  </span>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#323232',
                      lineHeight: '200%',
                      fontFamily:
                        'Noto Sans JP, Noto Sans JP Fallback, system-ui, sans-serif',
                    }}
                  >
                    新機能リリースのお知らせ
                  </div>
                </div>
                {/* お知らせ一覧を見るリンクボックス */}
                <div
                  style={{
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
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#0F9058',
                      lineHeight: '200%',
                      fontFamily:
                        'Noto Sans JP, Noto Sans JP Fallback, system-ui, sans-serif',
                      whiteSpace: 'normal',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      wordBreak: 'break-word',
                    }}
                  >
                    お知らせ一覧を見る
                  </span>
                  <img
                    src='/images/arrow.svg'
                    alt='arrow'
                    width={12}
                    height={12}
                    style={{ display: 'block' }}
                  />
                </div>
              </div>
              {/* バナー画像を表示 */}
              <img
                src='/images/banner01.png'
                alt='バナー画像01'
                className='w-full h-auto block rounded-lg'
              />
              {/* FAQ/QAセクション */}
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <SectionHeading
                  iconSrc='/images/question.svg'
                  iconAlt='よくある質問アイコン'
                >
                  よくある質問
                </SectionHeading>
                {/* FAQボックス（ダミー） */}
                <FaqBox
                  title='退会したい場合はどうすればいいですか？'
                  body='マイページの「アカウント設定」から「退会」ボタンを押し、画面の案内に従って手続きを進めてください。'
                />
                <FaqBox
                  title='パスワードを忘れた場合はどうすればいいですか？'
                  body='ログイン画面の「パスワードをお忘れですか？」リンクから再設定手続きを行ってください。'
                />
                {/* QA一覧を見るリンクボックス（ダミー） */}
                <div
                  style={{
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
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#0F9058',
                      lineHeight: '200%',
                      fontFamily:
                        'Noto Sans JP, Noto Sans JP Fallback, system-ui, sans-serif',
                      whiteSpace: 'normal',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      wordBreak: 'break-word',
                    }}
                  >
                    Q&A一覧を見る
                  </span>
                  <img
                    src='/images/arrow.svg'
                    alt='arrow'
                    width={12}
                    height={12}
                    style={{ display: 'block' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* --- ここまでやることリスト＋FAQ/バナー --- */}
      </main>
    </div>
  );
}
