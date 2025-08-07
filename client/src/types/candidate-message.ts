// 候補者用メッセージ機能の簡素化された型定義

export interface CandidateRoom {
  id: string;
  companyGroupId: string;
  companyName: string;
  groupName: string;
  jobTitle: string;
  jobPostingId: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isUnread: boolean;
}

export interface CandidateMessage {
  id: string;
  roomId: string;
  content: string;
  senderType: 'CANDIDATE' | 'COMPANY';
  senderName: string;
  isOwnMessage: boolean; // 自分（候補者）のメッセージかどうか
  createdAt: string;
}

export interface CandidateMessagePageData {
  rooms: CandidateRoom[];
  currentUserId: string;
}