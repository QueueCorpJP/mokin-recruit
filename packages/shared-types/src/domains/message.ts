import { MessageType, MessageStatus } from '../common/enums';

// Message
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  jobPostingId?: string;
  companyGroupId?: string;
  messageType: MessageType;
  subject?: string;
  content: string;
  attachments: MessageAttachment[];
  status: MessageStatus;
  isRead: boolean;
  readAt?: Date;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Message Attachment
export interface MessageAttachment {
  id: string;
  messageId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
}

// Message Thread
export interface MessageThread {
  id: string;
  candidateId: string;
  companyUserId: string;
  jobPostingId: string;
  subject: string;
  lastMessageAt: Date;
  unreadCount: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

// Scout Message
export interface ScoutMessage {
  id: string;
  companyUserId: string;
  candidateId: string;
  jobPostingId: string;
  templateId?: string;
  subject: string;
  content: string;
  personalizedContent?: string;
  sentAt: Date;
  readAt?: Date;
  respondedAt?: Date;
  declinedAt?: Date;
  declineReason?: string;
  status: 'SENT' | 'READ' | 'RESPONDED' | 'DECLINED' | 'EXPIRED';
}

// Message Template
export interface MessageTemplate {
  id: string;
  companyGroupId: string;
  createdBy: string;
  templateType: 'SCOUT' | 'INTERVIEW_INVITATION' | 'OFFER' | 'REJECTION' | 'GENERAL';
  name: string;
  subject: string;
  content: string;
  variables: TemplateVariable[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Template Variable
export interface TemplateVariable {
  key: string;
  label: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN';
  required: boolean;
  defaultValue?: string;
}

// Message Send Request
export interface MessageSendRequest {
  receiverId: string;
  jobPostingId?: string;
  messageType: MessageType;
  subject?: string;
  content: string;
  attachments?: MessageAttachmentUpload[];
}

// Message Attachment Upload
export interface MessageAttachmentUpload {
  fileName: string;
  fileContent: string; // base64 encoded
  mimeType: string;
}

// Scout Send Request
export interface ScoutSendRequest {
  candidateId: string;
  jobPostingId: string;
  templateId?: string;
  subject: string;
  content: string;
  personalizedContent?: string;
}

// Message Search Filters
export interface MessageSearchFilters {
  keywords?: string;
  messageType?: MessageType;
  status?: MessageStatus;
  isRead?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
  jobPostingId?: string;
  companyId?: string;
}

// Message Statistics
export interface MessageStatistics {
  totalSent: number;
  totalReceived: number;
  unreadCount: number;
  scoutResponseRate: number;
  averageResponseTime: number; // in hours
} 