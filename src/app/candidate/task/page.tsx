import { ChevronRightIcon } from 'lucide-react';
import { FaqBox } from '@/components/ui/FaqBox';
import { SectionHeading } from '@/components/ui/SectionHeading';
// import { Button } from '@/components/ui/button';
import { getCachedCandidateUser } from '@/lib/auth/server';
import TaskList from './TaskList';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getCandidateTaskDataResult } from '@/app/candidate/task/_shared/server/getTaskData';
import type { TaskData } from '@/app/candidate/task/_shared/types';

// Room 型は getRooms 側の戻り値型を参照しており、ここでは未使用

async function getTaskData(): Promise<TaskData> {
  // レイアウトでSSR認証済みのため、ここでのリダイレクトは不要
  const result = await getCandidateTaskDataResult();
  if (result.success && result.data) return result.data;
  return { hasNewMessage: false, hasUnreadMessage: false };
}

export default async function CandidateTaskPage() {
  const user = await getCachedCandidateUser();

  if (!user) {
    redirect('/candidate/auth/login');
  }

  const taskData = await getTaskData();

  const headingListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

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
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
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
  };

  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start'>
          <div className='max-w-[880px] md:px-6 flex-1 box-border w-full'>
            <div style={{ marginBottom: '8px' }}>
              <SectionHeading
                iconSrc='/images/list.svg'
                iconAlt='やることリストアイコン'
              >
                やることリスト
              </SectionHeading>
            </div>

            <TaskList initialTaskData={taskData} />
          </div>

          <div className='w-full md:max-w-[320px] md:flex-none'>
            <Image
              src='/images/banner01.png'
              alt='バナー画像1'
              width={320}
              height={200}
              className='w-full h-auto block rounded-lg mb-20'
            />
            <div style={headingListStyle}>
              <SectionHeading
                iconSrc='/images/question.svg'
                iconAlt='よくある質問アイコン'
              >
                よくある質問
              </SectionHeading>
              <FaqBox
                title='退会したい場合はどうすれば良いですか？退会手続きの流れを教えてください'
                body='マイページの「アカウント設定」から「退会」ボタンを押し、画面の案内に従って手続きを進めてください。退会後はすべてのデータが削除されます。'
              />
              <FaqBox
                title='パスワードを忘れた場合はどうすれば良いですか？'
                body='ログイン画面の「パスワードをお忘れですか？」リンクから再設定手続きを行ってください。'
              />
              <FaqBox
                title='登録したメールアドレスを変更したいです'
                body='マイページの「アカウント設定」からメールアドレスの変更が可能です。'
              />
              <FaqBox
                title='求人への応募方法を教えてください'
                body='求人詳細ページの「応募する」ボタンから応募手続きを進めてください。'
              />
              <FaqBox
                title='企業からのスカウトを受け取るにはどうすれば良いですか？'
                body='プロフィールを充実させることで、企業からのスカウトを受けやすくなります。'
              />
              <FaqBox
                title='面接日程の調整はどのように行いますか？'
                body='メッセージ機能を使って企業担当者と直接日程調整が可能です。'
              />
              <div style={qaLinkBoxStyle}>
                <span
                  style={{
                    ...qaLinkTextStyle,
                    fontWeight: 'bold',
                    fontFamily:
                      "'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
                  }}
                >
                  Q&A一覧を見る
                </span>
                <ChevronRightIcon
                  className='h-[16px] w-auto'
                  style={{
                    display: 'block',
                    marginLeft: '12px',
                    color: '#0F9058',
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

export const dynamic = 'force-dynamic';
