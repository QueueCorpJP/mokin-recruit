import { ChevronRightIcon } from 'lucide-react';
import { FaqBox } from '@/components/ui/FaqBox';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { getCachedCompanyUser } from '@/lib/auth/server';
import TaskList from './TaskList';
import { CompanyTaskSidebar } from '@/components/company/CompanyTaskSidebar';
import { getCompanyTaskData } from './action';

interface Room {
  id: string;
  candidateName: string;
  jobTitle: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

// TaskDataインターフェースはaction.tsからインポートされるため、ここでの定義は不要
// ただし、旧形式との互換性のため、変換用のインターフェースを定義
interface LegacyTaskData {
  // Task 1: 求人作成が0件
  hasNoJobPostings: boolean;
  
  // Task 2 & 3: 応募への対応
  hasNewApplication: boolean;
  newApplicationCandidateName?: string;
  newApplicationJobTitle?: string;
  newApplicationId?: string;
  
  hasUnreadApplication: boolean;
  unreadApplicationCandidateName?: string;
  unreadApplicationJobTitle?: string;
  unreadApplicationId?: string;
  
  // Task 4 & 5: メッセージ対応
  hasNewMessage: boolean;
  newMessageDate?: Date;
  newMessageCandidateName?: string;
  newMessageJobTitle?: string;
  newMessageRoomId?: string;
  
  hasUnreadMessage: boolean;
  unreadMessageDate?: Date;
  unreadMessageCandidateName?: string;
  unreadMessageJobTitle?: string;
  unreadMessageRoomId?: string;
  
  // Task 6: 選考結果未登録
  hasUnregisteredInterviewResult: boolean;
  unregisteredInterviewCandidateName?: string;
  unregisteredInterviewJobTitle?: string;
  unregisteredInterviewId?: string;
}

/**
 * 新しいaction.tsのデータを旧形式に変換
 */
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
  if (taskData.unregisteredInterviews && taskData.unregisteredInterviews.length > 0) {
    const firstInterview = taskData.unregisteredInterviews[0];
    legacyData.unregisteredInterviewCandidateName = firstInterview.candidateName;
    legacyData.unregisteredInterviewJobTitle = firstInterview.jobTitle;
    legacyData.unregisteredInterviewId = firstInterview.id;
  }

  return legacyData;
}

export default async function CompanyTaskPage() {
  const user = await getCachedCompanyUser();
  
  // 新しい形式のタスクデータを直接使用
  const taskData = await getCompanyTaskData();

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
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
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
    <div className="min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10">
      <main className="w-full max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start">
          <div className="max-w-[880px] md:px-6 flex-1 box-border w-full">
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
          
          <CompanyTaskSidebar className="md:flex-none" />
        </div>
      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';