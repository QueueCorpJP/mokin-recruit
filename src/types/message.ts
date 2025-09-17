// Message types aligned with Supabase database schema

export type MessageSenderType = 'CANDIDATE' | 'COMPANY_USER';
export type MessageType = 'SCOUT' | 'APPLICATION' | 'GENERAL';
export type MessageStatus = 'SENT' | 'READ' | 'REPLIED';

export interface ChatMessage {
  id: string;
  room_id: string;
  content: string;
  sender_type: MessageSenderType;
  sender_candidate_id?: string | null;
  sender_company_user_id?: string | null;
  receiver_type: MessageSenderType;
  receiver_candidate_id?: string | null;
  receiver_company_user_id?: string | null;
  message_type: MessageType;
  subject?: string | null;
  status: MessageStatus;
  attachment_file_paths?: string[];
  file_urls?: string[];
  sent_at?: string | null;
  created_at: string;
  updated_at: string;
  read_at?: string | null;
  replied_at?: string | null;

  // リレーションデータ（JOINクエリ結果用）
  sender_candidate?: {
    first_name: string;
    last_name: string;
  } | null;
  sender_company_user?: {
    full_name: string;
    position_title?: string;
    company_account: {
      company_name: string;
    };
  } | null;
  sender_company_group?: {
    company_account?: {
      company_name: string;
    };
  } | null;
}

export interface MessageRoom {
  id: string;
  messages: ChatMessage[];
  companyName: string;
  jobTitle: string;
}
