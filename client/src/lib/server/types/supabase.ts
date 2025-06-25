export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          last_name: string;
          first_name: string;
          last_name_kana: string | null;
          first_name_kana: string | null;
          gender: string | null;
          current_residence: string | null;
          birth_date: string | null;
          phone_number: string | null;
          current_salary: string | null;
          has_job_change_experience: boolean;
          desired_change_timing: string | null;
          job_search_status: string | null;
          skills: string[];
          desired_industries: string[];
          desired_job_types: string[];
          desired_locations: string[];
          email_notification_settings: Json;
          scout_reception_enabled: boolean;
          status: string;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          last_name: string;
          first_name: string;
          last_name_kana?: string | null;
          first_name_kana?: string | null;
          gender?: string | null;
          current_residence?: string | null;
          birth_date?: string | null;
          phone_number?: string | null;
          current_salary?: string | null;
          has_job_change_experience?: boolean;
          desired_change_timing?: string | null;
          job_search_status?: string | null;
          skills?: string[];
          desired_industries?: string[];
          desired_job_types?: string[];
          desired_locations?: string[];
          email_notification_settings?: Json;
          scout_reception_enabled?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          last_name?: string;
          first_name?: string;
          last_name_kana?: string | null;
          first_name_kana?: string | null;
          gender?: string | null;
          current_residence?: string | null;
          birth_date?: string | null;
          phone_number?: string | null;
          current_salary?: string | null;
          has_job_change_experience?: boolean;
          desired_change_timing?: string | null;
          job_search_status?: string | null;
          skills?: string[];
          desired_industries?: string[];
          desired_job_types?: string[];
          desired_locations?: string[];
          email_notification_settings?: Json;
          scout_reception_enabled?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Relationships: [];
      };
      company_accounts: {
        Row: {
          id: string;
          company_name: string;
          headquarters_address: string | null;
          representative_name: string | null;
          industry: string;
          company_overview: string | null;
          appeal_points: string | null;
          logo_image_path: string | null;
          contract_plan: Json;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          headquarters_address?: string | null;
          representative_name?: string | null;
          industry: string;
          company_overview?: string | null;
          appeal_points?: string | null;
          logo_image_path?: string | null;
          contract_plan?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          headquarters_address?: string | null;
          representative_name?: string | null;
          industry?: string;
          company_overview?: string | null;
          appeal_points?: string | null;
          logo_image_path?: string | null;
          contract_plan?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      company_users: {
        Row: {
          id: string;
          company_account_id: string;
          full_name: string;
          position_title: string | null;
          email: string;
          password_hash: string;
          email_notification_settings: Json;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id?: string;
          company_account_id: string;
          full_name: string;
          position_title?: string | null;
          email: string;
          password_hash: string;
          email_notification_settings?: Json;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          company_account_id?: string;
          full_name?: string;
          position_title?: string | null;
          email?: string;
          password_hash?: string;
          email_notification_settings?: Json;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'company_users_company_account_id_fkey';
            columns: ['company_account_id'];
            isOneToOne: false;
            referencedRelation: 'company_accounts';
            referencedColumns: ['id'];
          },
        ];
      };
      job_postings: {
        Row: {
          id: string;
          company_account_id: string;
          title: string;
          department_name: string | null;
          job_description: string;
          required_skills: string[];
          preferred_skills: string[];
          employment_type: string | null;
          salary_range: string | null;
          work_location: string | null;
          work_style: string[];
          benefits: string | null;
          selection_process: string | null;
          application_requirements: string | null;
          visibility_scope: string;
          target_candidate_conditions: Json;
          publication_status: string;
          published_at: string | null;
          application_deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_account_id: string;
          title: string;
          department_name?: string | null;
          job_description: string;
          required_skills?: string[];
          preferred_skills?: string[];
          employment_type?: string | null;
          salary_range?: string | null;
          work_location?: string | null;
          work_style?: string[];
          benefits?: string | null;
          selection_process?: string | null;
          application_requirements?: string | null;
          visibility_scope?: string;
          target_candidate_conditions?: Json;
          publication_status?: string;
          published_at?: string | null;
          application_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_account_id?: string;
          title?: string;
          department_name?: string | null;
          job_description?: string;
          required_skills?: string[];
          preferred_skills?: string[];
          employment_type?: string | null;
          salary_range?: string | null;
          work_location?: string | null;
          work_style?: string[];
          benefits?: string | null;
          selection_process?: string | null;
          application_requirements?: string | null;
          visibility_scope?: string;
          target_candidate_conditions?: Json;
          publication_status?: string;
          published_at?: string | null;
          application_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'job_postings_company_account_id_fkey';
            columns: ['company_account_id'];
            isOneToOne: false;
            referencedRelation: 'company_accounts';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          sender_type: string;
          sender_candidate_id: string | null;
          sender_company_user_id: string | null;
          receiver_type: string;
          receiver_candidate_id: string | null;
          receiver_company_user_id: string | null;
          message_type: string;
          subject: string;
          content: string;
          attachment_file_paths: string[];
          status: string;
          read_at: string | null;
          replied_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sender_type: string;
          sender_candidate_id?: string | null;
          sender_company_user_id?: string | null;
          receiver_type: string;
          receiver_candidate_id?: string | null;
          receiver_company_user_id?: string | null;
          message_type?: string;
          subject: string;
          content: string;
          attachment_file_paths?: string[];
          status?: string;
          read_at?: string | null;
          replied_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sender_type?: string;
          sender_candidate_id?: string | null;
          sender_company_user_id?: string | null;
          receiver_type?: string;
          receiver_candidate_id?: string | null;
          receiver_company_user_id?: string | null;
          message_type?: string;
          subject?: string;
          content?: string;
          attachment_file_paths?: string[];
          status?: string;
          read_at?: string | null;
          replied_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_receiver_candidate_id_fkey';
            columns: ['receiver_candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_receiver_company_user_id_fkey';
            columns: ['receiver_company_user_id'];
            isOneToOne: false;
            referencedRelation: 'company_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_sender_candidate_id_fkey';
            columns: ['sender_candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_sender_company_user_id_fkey';
            columns: ['sender_company_user_id'];
            isOneToOne: false;
            referencedRelation: 'company_users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// 型エイリアス（使いやすさのため）
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// 具体的なテーブル型
export type CandidateRow = Tables<'candidates'>;
export type CandidateInsert = TablesInsert<'candidates'>;
export type CandidateUpdate = TablesUpdate<'candidates'>;

export type CompanyAccountRow = Tables<'company_accounts'>;
export type CompanyAccountInsert = TablesInsert<'company_accounts'>;
export type CompanyAccountUpdate = TablesUpdate<'company_accounts'>;

export type CompanyUserRow = Tables<'company_users'>;
export type CompanyUserInsert = TablesInsert<'company_users'>;
export type CompanyUserUpdate = TablesUpdate<'company_users'>;

export type JobPostingRow = Tables<'job_postings'>;
export type JobPostingInsert = TablesInsert<'job_postings'>;
export type JobPostingUpdate = TablesUpdate<'job_postings'>;

export type MessageRow = Tables<'messages'>;
export type MessageInsert = TablesInsert<'messages'>;
export type MessageUpdate = TablesUpdate<'messages'>;
