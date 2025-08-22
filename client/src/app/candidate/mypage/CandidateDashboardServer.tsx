import { SectionHeading } from '@/components/ui/SectionHeading';
import { FaqBox } from '@/components/ui/FaqBox';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/button';
import { MessageListCard } from '@/components/ui/MessageListCard';
import { JobPostCard } from '@/components/ui/JobPostCard';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  userType: 'candidate' | 'company_user' | 'admin';
  name?: string;
  emailConfirmed: boolean;
  lastSignIn?: string;
}

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
  [key: string]: any;
}

interface CandidateDashboardServerProps {
  user: User;
  jobs: JobPosting[];
  tasks: any[];
  messages: any[];
}

export function CandidateDashboardServer({
  user,
  jobs,
  tasks,
  messages,
}: CandidateDashboardServerProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー部分 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            マイページ
          </h1>
          <p className="text-gray-600 mt-2">
            ようこそ、{user.name || user.email}さん
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* タスクセクション */}
        <div className="mb-8">
          <SectionHeading iconSrc="/icons/task.svg" iconAlt="タスク">やることリスト</SectionHeading>
          <div className="bg-white rounded-lg shadow-sm p-6">
            {tasks.length === 0 ? (
              <p className="text-gray-500">現在タスクはありません</p>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task: any, index: number) => (
                  <div key={task.id || index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium">{task.title || 'タスク'}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* メッセージセクション */}
        <div className="mb-8">
          <SectionHeading iconSrc="/icons/message.svg" iconAlt="メッセージ">最新のメッセージ</SectionHeading>
          <div className="bg-white rounded-lg shadow-sm">
            {messages.length === 0 ? (
              <div className="p-6">
                <p className="text-gray-500">メッセージはありません</p>
              </div>
            ) : (
              <MessageListCard
                messages={messages.slice(0, 5).map((message: any) => ({
                  id: message.id || 'msg-' + Math.random(),
                  sender: message.rooms?.company_groups?.company_account?.company_name || '企業名未設定',
                  body: message.content || '',
                  date: message.sent_at ? new Date(message.sent_at).toLocaleString() : ''
                }))}
              />
            )}
            <div className="p-4 border-t">
              <Link href="/candidate/message">
                <Button variant="outline" className="w-full">
                  すべてのメッセージを見る
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* おすすめ求人セクション */}
        <div className="mb-8">
          <SectionHeading iconSrc="/icons/job.svg" iconAlt="求人">おすすめ求人</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length === 0 ? (
              <div className="col-span-full bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-500">おすすめ求人はありません</p>
              </div>
            ) : (
              jobs.slice(0, 6).map((job: JobPosting) => (
                <JobPostCard
                  key={job.id}
                  title={job.title}
                  companyName={job.company_name || ''}
                  location={(job.work_location || []).join(', ')}
                  salary={`${job.salary_min || 0}万円〜${job.salary_max || 0}万円`}
                  tags={(job.job_type || []).slice(0, 3)}
                  imageUrl={(job.image_urls || [])[0] || '/images/default-job.png'}
                  imageAlt={job.title}
                  starred={false}
                  apell={job.appeal_points || []}
                />
              ))
            )}
          </div>
          <div className="mt-6 text-center">
            <Link href="/candidate/search">
              <Button variant="outline">
                もっと求人を見る
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQ セクション */}
        <div className="mb-8">
          <SectionHeading iconSrc="/icons/faq.svg" iconAlt="FAQ">よくある質問</SectionHeading>
          <div className="space-y-4">
            <FaqBox
              title="プロフィールはどこで編集できますか？"
              body="右上のメニューから「プロフィール設定」を選択してください。"
            />
            <FaqBox
              title="応募した求人の状況を確認するには？"
              body="「応募履歴」ページで確認できます。"
            />
            <FaqBox
              title="企業からメッセージが来た場合の通知設定は？"
              body="「通知設定」ページで詳細を設定できます。"
            />
          </div>
        </div>
      </div>
    </div>
  );
}