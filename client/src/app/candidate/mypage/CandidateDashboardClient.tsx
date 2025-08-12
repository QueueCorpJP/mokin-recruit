'use client';

import { useRouter } from 'next/navigation';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FaqBox } from '@/components/ui/FaqBox';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  email: string;
  userType: 'candidate' | 'company_user' | 'admin';
  name?: string;
  emailConfirmed: boolean;
  lastSignIn?: string;
}

interface CandidateDashboardClientProps {
  user: User;
}

export function CandidateDashboardClient({
  user,
}: CandidateDashboardClientProps) {
  const router = useRouter();

  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[1280px] mx-auto'>
        {/* --- ここからやることリスト＋FAQ/バナーの2カラムレイアウト --- */}
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start'>
          {/* 左カラム（やることリスト2セット） */}
          <div className='max-w-[880px] w-full flex-1 box-border px-6 md:px-0'>
            {[0, 1].map(idx => (
              <div key={idx} style={idx === 1 ? { marginTop: 80 } : {}}>
                <div style={{ marginBottom: '8px' }}>
                  <SectionHeading
                    iconSrc='/images/list.svg'
                    iconAlt='やることリストアイコン'
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
                  {[1, 2, 3].map(id => (
                    <div
                      key={id}
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
                            ダミータスクタイトル{id}
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
                            ダミータスクの説明文{id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* ページネーション（ダミー） */}
                  <div>
                    <Pagination
                      currentPage={1}
                      totalPages={1}
                      onPageChange={() => {}}
                    />
                  </div>
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
            ))}
          </div>
          {/* 右カラム（FAQ/バナー） */}
          <div className='w-full md:max-w-[320px] md:flex-none'>
            {/* バナー画像を表示 */}
            <img
              src='/images/banner01.png'
              alt='バナー画像01'
              className='w-full h-auto block rounded-lg mb-20'
            />
            {/* 見出しリスト（縦並び・gap8px） */}
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
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#0F9058',
                    lineHeight: '200%',
                    fontFamily:
                      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    wordBreak: 'break-word',
                  }}
                >
                  Q&A一覧を見る
                </span>
                {/* アイコンは省略可 */}
              </div>
            </div>
          </div>
        </div>
        {/* --- ここまでやることリスト＋FAQ/バナー --- */}
      </main>
    </div>
  );
}
