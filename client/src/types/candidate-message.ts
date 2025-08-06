// 候補者用メッセージ機能の簡素化された型定義

export interface CandidateRoom {
  id: string;
  companyName: string;
  jobTitle: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
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