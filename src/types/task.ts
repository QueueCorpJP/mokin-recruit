// Task management types for both candidate and company tasks

// Candidate task types
export interface TaskData {
  hasNewMessage: boolean;
  newMessageDate?: Date;
  newMessageCompanyName?: string;
  newMessageJobTitle?: string;
  newMessageRoomId?: string;

  hasUnreadMessage: boolean;
  unreadMessageDate?: Date;
  unreadMessageCompanyName?: string;
  unreadMessageJobTitle?: string;
  unreadMessageRoomId?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  iconSrc?: string;
  completed?: boolean;
  triggerFunction: () => boolean;
  navigateTo?: string;
}

// Company task types
export interface Room {
  id: string;
  candidateName: string;
  jobTitle: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface LegacyTaskData {
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
