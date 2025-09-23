import { SectionHeading } from '@/components/ui/SectionHeading';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { getCompanyTaskData } from './action';
import { getCompanyAccountData } from '@/lib/actions/company-task-data';
import dynamic from 'next/dynamic';

const TaskList = dynamic(() => import('./TaskList'), {
  loading: () => (
    <div className='bg-white rounded-[10px] p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
      <div className='animate-pulse space-y-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='flex items-center p-4 border border-gray-200 rounded'
          >
            <div className='w-4 h-4 bg-gray-200 rounded mr-4'></div>
            <div className='flex-1'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});

const CompanyTaskSidebar = dynamic(
  () =>
    import('@/components/company/CompanyTaskSidebar').then(mod => ({
      default: mod.CompanyTaskSidebar,
    })),
  {
    loading: () => (
      <div className='w-full md:max-w-[320px] md:flex-none'>
        <div className='bg-white rounded-[10px] p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
          <div className='animate-pulse'>
            <div className='h-6 bg-gray-200 rounded w-32 mb-6'></div>
            <div className='space-y-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='h-16 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

import type { Room, LegacyTaskData } from '@/types';

async function getTaskData(): Promise<LegacyTaskData> {
  // 新しいサーバーアクションを呼び出し
  const taskData = await getCompanyTaskData();

  // 旧形式に変換して返す
  const legacyData: LegacyTaskData = {
    hasNoJobPostings: taskData.hasNoJobPostings,
    hasNewApplication: taskData.hasNewApplication,
    hasUnreadApplication: taskData.hasUnreadApplication,
    hasNewMessage: taskData.hasNewMessage,
    hasUnreadMessage: taskData.hasUnreadMessage,
    hasUnregisteredInterviewResult: taskData.hasUnregisteredInterviewResult,
  };

  // 新着応募の最初のデータを設定
  if (taskData.newApplications && taskData.newApplications.length > 0) {
    const firstApp = taskData.newApplications[0];
    legacyData.newApplicationCandidateName = firstApp.candidateName;
    legacyData.newApplicationJobTitle = firstApp.jobTitle;
    legacyData.newApplicationId = firstApp.id;
  }

  // 未確認応募の最初のデータを設定
  if (taskData.unreadApplications && taskData.unreadApplications.length > 0) {
    const firstApp = taskData.unreadApplications[0];
    legacyData.unreadApplicationCandidateName = firstApp.candidateName;
    legacyData.unreadApplicationJobTitle = firstApp.jobTitle;
    legacyData.unreadApplicationId = firstApp.id;
  }

  // 新着メッセージの最初のデータを設定
  if (taskData.newMessages && taskData.newMessages.length > 0) {
    const firstMsg = taskData.newMessages[0];
    legacyData.newMessageDate = firstMsg.sentAt;
    legacyData.newMessageCandidateName = firstMsg.candidateName;
    legacyData.newMessageJobTitle = firstMsg.jobTitle;
    legacyData.newMessageRoomId = firstMsg.roomId;
  }

  // 未読メッセージの最初のデータを設定
  if (taskData.unreadMessages && taskData.unreadMessages.length > 0) {
    const firstMsg = taskData.unreadMessages[0];
    legacyData.unreadMessageDate = firstMsg.sentAt;
    legacyData.unreadMessageCandidateName = firstMsg.candidateName;
    legacyData.unreadMessageJobTitle = firstMsg.jobTitle;
    legacyData.unreadMessageRoomId = firstMsg.roomId;
  }

  // 面接結果未登録の最初のデータを設定
  if (
    taskData.unregisteredInterviews &&
    taskData.unregisteredInterviews.length > 0
  ) {
    const firstInterview = taskData.unregisteredInterviews[0];
    legacyData.unregisteredInterviewCandidateName =
      firstInterview.candidateName;
    legacyData.unregisteredInterviewJobTitle = firstInterview.jobTitle;
    legacyData.unregisteredInterviewId = firstInterview.id;
  }

  return legacyData;
}

export default async function CompanyTaskPage() {
  const authResult = await requireCompanyAuthForAction();
  if (!authResult.success) {
    return (
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }

  // 新しい形式のタスクデータを直接使用（並列化）
  const [taskData, companyAccountData] = await Promise.all([
    getCompanyTaskData(),
    getCompanyAccountData(authResult.data.companyUserId).catch(() => null),
  ]);

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
                iconAlt='対応リストアイコン'
              >
                対応リスト
              </SectionHeading>
            </div>

            <TaskList initialTaskData={taskData} />
          </div>

          <CompanyTaskSidebar
            className='md:flex-none'
            companyAccountData={companyAccountData}
          />
        </div>
      </main>
    </div>
  );
}
