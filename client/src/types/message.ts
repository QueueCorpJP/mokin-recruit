export interface ChatMessage {
  id: string;
  room_id: string;
  content: string;
  sender_type: 'CANDIDATE' | 'COMPANY_USER';
  sender_candidate_id?: string | null;
  sender_company_group_id?: string | null;
  message_type: 'SCOUT' | 'APPLICATION' | 'GENERAL';
  subject?: string | null;
  status: 'SENT' | 'READ' | 'REPLIED';
  sent_at: string | null;
  read_at?: string | null;
  replied_at?: string | null;
  file_urls?: string[];
  created_at: string;
  updated_at: string;
  
  // リレーションデータ
  sender_candidate?: {
    first_name: string;
    last_name: string;
  } | null;
  sender_company_group?: {
    group_name: string;
    company_account: {
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