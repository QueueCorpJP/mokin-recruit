export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string;
          password_hash: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          password_hash: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          password_hash?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      application: {
        Row: {
          application_message: string | null;
          candidate_id: string;
          career_history_url: string | null;
          company_account_id: string;
          company_group_id: string;
          company_user_id: string;
          created_at: string | null;
          id: string;
          job_posting_id: string | null;
          resume_url: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          application_message?: string | null;
          candidate_id: string;
          career_history_url?: string | null;
          company_account_id: string;
          company_group_id: string;
          company_user_id: string;
          created_at?: string | null;
          id?: string;
          job_posting_id?: string | null;
          resume_url?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          application_message?: string | null;
          candidate_id?: string;
          career_history_url?: string | null;
          company_account_id?: string;
          company_group_id?: string;
          company_user_id?: string;
          created_at?: string | null;
          id?: string;
          job_posting_id?: string | null;
          resume_url?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'application_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'application_company_account_id_fkey';
            columns: ['company_account_id'];
            isOneToOne: false;
            referencedRelation: 'company_accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'application_company_group_id_fkey';
            columns: ['company_group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'application_company_user_id_fkey';
            columns: ['company_user_id'];
            isOneToOne: false;
            referencedRelation: 'company_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'application_job_posting_id_fkey';
            columns: ['job_posting_id'];
            isOneToOne: false;
            referencedRelation: 'job_postings';
            referencedColumns: ['id'];
          },
        ];
      };
      article_categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      article_category_relations: {
        Row: {
          article_id: string;
          category_id: string;
          created_at: string | null;
          id: string;
        };
        Insert: {
          article_id: string;
          category_id: string;
          created_at?: string | null;
          id?: string;
        };
        Update: {
          article_id?: string;
          category_id?: string;
          created_at?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'article_category_relations_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_category_relations_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'article_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      article_tag_relations: {
        Row: {
          article_id: string;
          created_at: string | null;
          id: string;
          tag_id: string;
        };
        Insert: {
          article_id: string;
          created_at?: string | null;
          id?: string;
          tag_id: string;
        };
        Update: {
          article_id?: string;
          created_at?: string | null;
          id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'article_tag_relations_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_tag_relations_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'article_tags';
            referencedColumns: ['id'];
          },
        ];
      };
      article_tags: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          content: string;
          created_at: string | null;
          excerpt: string | null;
          id: string;
          meta_description: string | null;
          meta_title: string | null;
          published_at: string | null;
          slug: string;
          status: string;
          thumbnail_url: string | null;
          title: string;
          updated_at: string | null;
          views_count: number | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          published_at?: string | null;
          slug: string;
          status?: string;
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string | null;
          views_count?: number | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          published_at?: string | null;
          slug?: string;
          status?: string;
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string | null;
          views_count?: number | null;
        };
        Relationships: [];
      };
      blocked_companies: {
        Row: {
          candidate_id: string;
          company_names: string[];
          created_at: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          candidate_id: string;
          company_names?: string[];
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string;
          company_names?: string[];
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      candidates: {
        Row: {
          birth_date: string | null;
          career_status_updated_at: string | null;
          created_at: string | null;
          current_activity_status: string | null;
          current_company: string | null;
          current_income: string | null;
          current_position: string | null;
          current_residence: string | null;
          current_salary: string | null;
          desired_industries: string[] | null;
          desired_job_types: string[] | null;
          desired_locations: string[] | null;
          desired_salary: string | null;
          email: string;
          experience_years: number | null;
          first_name: string | null;
          first_name_kana: string | null;
          gender: string | null;
          has_career_change: string | null;
          id: string;
          interested_work_styles: string[] | null;
          job_change_timing: string | null;
          job_summary: string | null;
          last_login_at: string | null;
          last_name: string | null;
          last_name_kana: string | null;
          management_experience_count: number | null;
          password_hash: string | null;
          phone_number: string | null;
          prefecture: string | null;
          recent_job_company_name: string | null;
          recent_job_department_position: string | null;
          recent_job_description: string | null;
          recent_job_end_month: string | null;
          recent_job_end_year: string | null;
          recent_job_industries: Json | null;
          recent_job_is_currently_working: boolean | null;
          recent_job_start_month: string | null;
          recent_job_start_year: string | null;
          recent_job_types: Json | null;
          recent_job_updated_at: string | null;
          resume_filename: string | null;
          resume_uploaded_at: string | null;
          resume_url: string | null;
          scout_reception_enabled: boolean | null;
          self_pr: string | null;
          skills: string[] | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          birth_date?: string | null;
          career_status_updated_at?: string | null;
          created_at?: string | null;
          current_activity_status?: string | null;
          current_company?: string | null;
          current_income?: string | null;
          current_position?: string | null;
          current_residence?: string | null;
          current_salary?: string | null;
          desired_industries?: string[] | null;
          desired_job_types?: string[] | null;
          desired_locations?: string[] | null;
          desired_salary?: string | null;
          email: string;
          experience_years?: number | null;
          first_name?: string | null;
          first_name_kana?: string | null;
          gender?: string | null;
          has_career_change?: string | null;
          id?: string;
          interested_work_styles?: string[] | null;
          job_change_timing?: string | null;
          job_summary?: string | null;
          last_login_at?: string | null;
          last_name?: string | null;
          last_name_kana?: string | null;
          management_experience_count?: number | null;
          password_hash?: string | null;
          phone_number?: string | null;
          prefecture?: string | null;
          recent_job_company_name?: string | null;
          recent_job_department_position?: string | null;
          recent_job_description?: string | null;
          recent_job_end_month?: string | null;
          recent_job_end_year?: string | null;
          recent_job_industries?: Json | null;
          recent_job_is_currently_working?: boolean | null;
          recent_job_start_month?: string | null;
          recent_job_start_year?: string | null;
          recent_job_types?: Json | null;
          recent_job_updated_at?: string | null;
          resume_filename?: string | null;
          resume_uploaded_at?: string | null;
          resume_url?: string | null;
          scout_reception_enabled?: boolean | null;
          self_pr?: string | null;
          skills?: string[] | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          birth_date?: string | null;
          career_status_updated_at?: string | null;
          created_at?: string | null;
          current_activity_status?: string | null;
          current_company?: string | null;
          current_income?: string | null;
          current_position?: string | null;
          current_residence?: string | null;
          current_salary?: string | null;
          desired_industries?: string[] | null;
          desired_job_types?: string[] | null;
          desired_locations?: string[] | null;
          desired_salary?: string | null;
          email?: string;
          experience_years?: number | null;
          first_name?: string | null;
          first_name_kana?: string | null;
          gender?: string | null;
          has_career_change?: string | null;
          id?: string;
          interested_work_styles?: string[] | null;
          job_change_timing?: string | null;
          job_summary?: string | null;
          last_login_at?: string | null;
          last_name?: string | null;
          last_name_kana?: string | null;
          management_experience_count?: number | null;
          password_hash?: string | null;
          phone_number?: string | null;
          prefecture?: string | null;
          recent_job_company_name?: string | null;
          recent_job_department_position?: string | null;
          recent_job_description?: string | null;
          recent_job_end_month?: string | null;
          recent_job_end_year?: string | null;
          recent_job_industries?: Json | null;
          recent_job_is_currently_working?: boolean | null;
          recent_job_start_month?: string | null;
          recent_job_start_year?: string | null;
          recent_job_types?: Json | null;
          recent_job_updated_at?: string | null;
          resume_filename?: string | null;
          resume_uploaded_at?: string | null;
          resume_url?: string | null;
          scout_reception_enabled?: boolean | null;
          self_pr?: string | null;
          skills?: string[] | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      career_status_entries: {
        Row: {
          candidate_id: string;
          company_name: string | null;
          created_at: string | null;
          decline_reason: string | null;
          department: string | null;
          id: string;
          industries: Json | null;
          is_private: boolean | null;
          progress_status: string | null;
          updated_at: string | null;
        };
        Insert: {
          candidate_id: string;
          company_name?: string | null;
          created_at?: string | null;
          decline_reason?: string | null;
          department?: string | null;
          id?: string;
          industries?: Json | null;
          is_private?: boolean | null;
          progress_status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string;
          company_name?: string | null;
          created_at?: string | null;
          decline_reason?: string | null;
          department?: string | null;
          id?: string;
          industries?: Json | null;
          is_private?: boolean | null;
          progress_status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'career_status_entries_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
        ];
      };
      company_accounts: {
        Row: {
          address: string | null;
          business_content: string | null;
          capital_amount: number | null;
          capital_unit: string | null;
          company_attractions: Json | null;
          company_images: string[] | null;
          company_name: string;
          company_overview: string | null;
          company_phase: string | null;
          company_urls: Json | null;
          created_at: string | null;
          employees_count: number | null;
          established_year: number | null;
          headquarters_address: string | null;
          icon_image_url: string | null;
          id: string;
          industries: Json | null;
          industry: string;
          plan: string;
          prefecture: string | null;
          representative_name: string | null;
          representative_position: string | null;
          scout_limit: number | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          business_content?: string | null;
          capital_amount?: number | null;
          capital_unit?: string | null;
          company_attractions?: Json | null;
          company_images?: string[] | null;
          company_name: string;
          company_overview?: string | null;
          company_phase?: string | null;
          company_urls?: Json | null;
          created_at?: string | null;
          employees_count?: number | null;
          established_year?: number | null;
          headquarters_address?: string | null;
          icon_image_url?: string | null;
          id?: string;
          industries?: Json | null;
          industry: string;
          plan?: string;
          prefecture?: string | null;
          representative_name?: string | null;
          representative_position?: string | null;
          scout_limit?: number | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          business_content?: string | null;
          capital_amount?: number | null;
          capital_unit?: string | null;
          company_attractions?: Json | null;
          company_images?: string[] | null;
          company_name?: string;
          company_overview?: string | null;
          company_phase?: string | null;
          company_urls?: Json | null;
          created_at?: string | null;
          employees_count?: number | null;
          established_year?: number | null;
          headquarters_address?: string | null;
          icon_image_url?: string | null;
          id?: string;
          industries?: Json | null;
          industry?: string;
          plan?: string;
          prefecture?: string | null;
          representative_name?: string | null;
          representative_position?: string | null;
          scout_limit?: number | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      company_groups: {
        Row: {
          company_account_id: string;
          created_at: string | null;
          description: string | null;
          group_name: string;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          company_account_id: string;
          created_at?: string | null;
          description?: string | null;
          group_name: string;
          id?: string;
          updated_at?: string | null;
        };
        Update: {
          company_account_id?: string;
          created_at?: string | null;
          description?: string | null;
          group_name?: string;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'company_groups_company_account_id_fkey';
            columns: ['company_account_id'];
            isOneToOne: false;
            referencedRelation: 'company_accounts';
            referencedColumns: ['id'];
          },
        ];
      };
      company_notification_settings: {
        Row: {
          application_notification: string;
          company_user_id: string;
          created_at: string;
          id: string;
          message_notification: string;
          system_notification: string;
          updated_at: string;
        };
        Insert: {
          application_notification?: string;
          company_user_id: string;
          created_at?: string;
          id?: string;
          message_notification?: string;
          system_notification?: string;
          updated_at?: string;
        };
        Update: {
          application_notification?: string;
          company_user_id?: string;
          created_at?: string;
          id?: string;
          message_notification?: string;
          system_notification?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'company_notification_settings_company_user_id_fkey';
            columns: ['company_user_id'];
            isOneToOne: true;
            referencedRelation: 'company_users';
            referencedColumns: ['id'];
          },
        ];
      };
      company_user_group_permissions: {
        Row: {
          company_group_id: string;
          company_user_id: string;
          created_at: string | null;
          id: string;
          permission_level: string;
          updated_at: string | null;
        };
        Insert: {
          company_group_id: string;
          company_user_id: string;
          created_at?: string | null;
          id?: string;
          permission_level: string;
          updated_at?: string | null;
        };
        Update: {
          company_group_id?: string;
          company_user_id?: string;
          created_at?: string | null;
          id?: string;
          permission_level?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'company_user_group_permissions_company_group_id_fkey';
            columns: ['company_group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'company_user_group_permissions_company_user_id_fkey';
            columns: ['company_user_id'];
            isOneToOne: false;
            referencedRelation: 'company_users';
            referencedColumns: ['id'];
          },
        ];
      };
      company_users: {
        Row: {
          auth_user_id: string | null;
          company_account_id: string;
          created_at: string | null;
          email: string;
          full_name: string;
          id: string;
          last_login_at: string | null;
          password_hash: string;
          position_title: string | null;
          updated_at: string | null;
        };
        Insert: {
          auth_user_id?: string | null;
          company_account_id: string;
          created_at?: string | null;
          email: string;
          full_name: string;
          id?: string;
          last_login_at?: string | null;
          password_hash: string;
          position_title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          auth_user_id?: string | null;
          company_account_id?: string;
          created_at?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          last_login_at?: string | null;
          password_hash?: string;
          position_title?: string | null;
          updated_at?: string | null;
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
      decline_reasons: {
        Row: {
          candidate_id: string | null;
          company_user_id: string | null;
          created_at: string | null;
          id: string;
          job_posting_id: string | null;
          reason: string;
          room_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          candidate_id?: string | null;
          company_user_id?: string | null;
          created_at?: string | null;
          id?: string;
          job_posting_id?: string | null;
          reason: string;
          room_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string | null;
          company_user_id?: string | null;
          created_at?: string | null;
          id?: string;
          job_posting_id?: string | null;
          reason?: string;
          room_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'decline_reasons_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'decline_reasons_company_user_id_fkey';
            columns: ['company_user_id'];
            isOneToOne: false;
            referencedRelation: 'company_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'decline_reasons_job_posting_id_fkey';
            columns: ['job_posting_id'];
            isOneToOne: false;
            referencedRelation: 'job_postings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'decline_reasons_room_id_fkey';
            columns: ['room_id'];
            isOneToOne: false;
            referencedRelation: 'rooms';
            referencedColumns: ['id'];
          },
        ];
      };
      education: {
        Row: {
          candidate_id: string | null;
          created_at: string | null;
          department: string | null;
          final_education: string;
          graduation_month: number | null;
          graduation_year: number | null;
          id: string;
          school_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          candidate_id?: string | null;
          created_at?: string | null;
          department?: string | null;
          final_education: string;
          graduation_month?: number | null;
          graduation_year?: number | null;
          id?: string;
          school_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string | null;
          created_at?: string | null;
          department?: string | null;
          final_education?: string;
          graduation_month?: number | null;
          graduation_year?: number | null;
          id?: string;
          school_name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'education_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
        ];
      };
      email_verification_codes: {
        Row: {
          candidate_id: string;
          code: string;
          created_at: string | null;
          email: string;
          expires_at: string;
          id: string;
          used: boolean | null;
        };
        Insert: {
          candidate_id: string;
          code: string;
          created_at?: string | null;
          email: string;
          expires_at: string;
          id?: string;
          used?: boolean | null;
        };
        Update: {
          candidate_id?: string;
          code?: string;
          created_at?: string | null;
          email?: string;
          expires_at?: string;
          id?: string;
          used?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'email_verification_codes_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: true;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
        ];
      };
      expectations: {
        Row: {
          candidate_id: string | null;
          created_at: string | null;
          desired_income: string;
          desired_industries: Json | null;
          desired_job_types: Json | null;
          desired_work_locations: Json | null;
          desired_work_styles: Json | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          candidate_id?: string | null;
          created_at?: string | null;
          desired_income: string;
          desired_industries?: Json | null;
          desired_job_types?: Json | null;
          desired_work_locations?: Json | null;
          desired_work_styles?: Json | null;
          id?: string;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string | null;
          created_at?: string | null;
          desired_income?: string;
          desired_industries?: Json | null;
          desired_job_types?: Json | null;
          desired_work_locations?: Json | null;
          desired_work_styles?: Json | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'expectations_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
        ];
      };
      favorites: {
        Row: {
          candidate_id: string;
          created_at: string | null;
          id: string;
          job_posting_id: string;
          updated_at: string | null;
        };
        Insert: {
          candidate_id: string;
          created_at?: string | null;
          id?: string;
          job_posting_id: string;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string;
          created_at?: string | null;
          id?: string;
          job_posting_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'favorites_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorites_job_posting_id_fkey';
            columns: ['job_posting_id'];
            isOneToOne: false;
            referencedRelation: 'job_postings';
            referencedColumns: ['id'];
          },
        ];
      };
      hidden_candidates: {
        Row: {
          candidate_id: string;
          company_group_id: string;
          company_user_id: string;
          created_at: string;
          hidden_at: string;
          id: string;
          is_hidden: boolean;
          search_query: Json | null;
          updated_at: string;
        };
        Insert: {
          candidate_id: string;
          company_group_id: string;
          company_user_id: string;
          created_at?: string;
          hidden_at?: string;
          id?: string;
          is_hidden?: boolean;
          search_query?: Json | null;
          updated_at?: string;
        };
        Update: {
          candidate_id?: string;
          company_group_id?: string;
          company_user_id?: string;
          created_at?: string;
          hidden_at?: string;
          id?: string;
          is_hidden?: boolean;
          search_query?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'hidden_candidates_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'hidden_candidates_company_group_id_fkey';
            columns: ['company_group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'hidden_candidates_company_user_id_fkey';
            columns: ['company_user_id'];
            isOneToOne: false;
            referencedRelation: 'company_users';
            referencedColumns: ['id'];
          },
        ];
      };
      job_postings: {
        Row: {
          appeal_points: string[] | null;
          application_deadline: string | null;
          approval_comment: string | null;
          approval_reason: string | null;
          approved_at: string | null;
          company_account_id: string | null;
          company_group_id: string;
          created_at: string | null;
          employment_type: string;
          employment_type_note: string | null;
          holidays: string | null;
          id: string;
          image_urls: string[] | null;
          industry: string[] | null;
          internal_memo: string | null;
          job_description: string;
          job_type: string[] | null;
          location_note: string | null;
          overtime: string | null;
          overtime_info: string | null;
          position_summary: string | null;
          preferred_skills: string | null;
          publication_type: string | null;
          published_at: string | null;
          rejected_at: string | null;
          rejection_comment: string | null;
          rejection_reason: string | null;
          remote_work_available: boolean | null;
          required_documents: string[] | null;
          required_skills: string | null;
          salary_max: number | null;
          salary_min: number | null;
          salary_note: string | null;
          selection_process: string | null;
          smoking_policy: string | null;
          smoking_policy_note: string | null;
          status: string | null;
          title: string;
          updated_at: string | null;
          work_location: string[] | null;
          working_hours: string | null;
        };
        Insert: {
          appeal_points?: string[] | null;
          application_deadline?: string | null;
          approval_comment?: string | null;
          approval_reason?: string | null;
          approved_at?: string | null;
          company_account_id?: string | null;
          company_group_id: string;
          created_at?: string | null;
          employment_type: string;
          employment_type_note?: string | null;
          holidays?: string | null;
          id?: string;
          image_urls?: string[] | null;
          industry?: string[] | null;
          internal_memo?: string | null;
          job_description: string;
          job_type?: string[] | null;
          location_note?: string | null;
          overtime?: string | null;
          overtime_info?: string | null;
          position_summary?: string | null;
          preferred_skills?: string | null;
          publication_type?: string | null;
          published_at?: string | null;
          rejected_at?: string | null;
          rejection_comment?: string | null;
          rejection_reason?: string | null;
          remote_work_available?: boolean | null;
          required_documents?: string[] | null;
          required_skills?: string | null;
          salary_max?: number | null;
          salary_min?: number | null;
          salary_note?: string | null;
          selection_process?: string | null;
          smoking_policy?: string | null;
          smoking_policy_note?: string | null;
          status?: string | null;
          title: string;
          updated_at?: string | null;
          work_location?: string[] | null;
          working_hours?: string | null;
        };
        Update: {
          appeal_points?: string[] | null;
          application_deadline?: string | null;
          approval_comment?: string | null;
          approval_reason?: string | null;
          approved_at?: string | null;
          company_account_id?: string | null;
          company_group_id?: string;
          created_at?: string | null;
          employment_type?: string;
          employment_type_note?: string | null;
          holidays?: string | null;
          id?: string;
          image_urls?: string[] | null;
          industry?: string[] | null;
          internal_memo?: string | null;
          job_description?: string;
          job_type?: string[] | null;
          location_note?: string | null;
          overtime?: string | null;
          overtime_info?: string | null;
          position_summary?: string | null;
          preferred_skills?: string | null;
          publication_type?: string | null;
          published_at?: string | null;
          rejected_at?: string | null;
          rejection_comment?: string | null;
          rejection_reason?: string | null;
          remote_work_available?: boolean | null;
          required_documents?: string[] | null;
          required_skills?: string | null;
          salary_max?: number | null;
          salary_min?: number | null;
          salary_note?: string | null;
          selection_process?: string | null;
          smoking_policy?: string | null;
          smoking_policy_note?: string | null;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
          work_location?: string[] | null;
          working_hours?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_job_postings_company_accounts';
            columns: ['company_account_id'];
            isOneToOne: false;
            referencedRelation: 'company_accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'job_postings_company_group_id_fkey';
            columns: ['company_group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
        ];
      };
      job_summary: {
        Row: {
          candidate_id: string | null;
          created_at: string | null;
          id: string;
          job_summary: string | null;
          self_pr: string | null;
          updated_at: string | null;
        };
        Insert: {
          candidate_id?: string | null;
          created_at?: string | null;
          id?: string;
          job_summary?: string | null;
          self_pr?: string | null;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string | null;
          created_at?: string | null;
          id?: string;
          job_summary?: string | null;
          self_pr?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'job_summary_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
        ];
      };
      job_type_experience: {
        Row: {
          candidate_id: string | null;
          created_at: string | null;
          experience_years: number;
          id: string;
          job_type_id: string;
          job_type_name: string;
          updated_at: string | null;
        };
        Insert: {
          candidate_id?: string | null;
          created_at?: string | null;
          experience_years: number;
          id?: string;
          job_type_id: string;
          job_type_name: string;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string | null;
          created_at?: string | null;
          experience_years?: number;
          id?: string;
          job_type_id?: string;
          job_type_name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'job_type_experience_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
        ];
      };
      message_templates: {
        Row: {
          body: string;
          company_id: string;
          created_at: string | null;
          group_id: string;
          id: string;
          template_name: string;
          updated_at: string | null;
        };
        Insert: {
          body: string;
          company_id: string;
          created_at?: string | null;
          group_id: string;
          id?: string;
          template_name: string;
          updated_at?: string | null;
        };
        Update: {
          body?: string;
          company_id?: string;
          created_at?: string | null;
          group_id?: string;
          id?: string;
          template_name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'message_templates_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'company_accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'message_templates_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          approval_comment: string | null;
          approval_reason: string | null;
          approval_status: string | null;
          content: string;
          created_at: string | null;
          file_urls: Json | null;
          id: string;
          message_type: string;
          read_at: string | null;
          replied_at: string | null;
          room_id: string;
          sender_candidate_id: string | null;
          sender_company_group_id: string | null;
          sender_type: string;
          sent_at: string | null;
          status: string;
          subject: string | null;
          updated_at: string | null;
        };
        Insert: {
          approval_comment?: string | null;
          approval_reason?: string | null;
          approval_status?: string | null;
          content: string;
          created_at?: string | null;
          file_urls?: Json | null;
          id?: string;
          message_type: string;
          read_at?: string | null;
          replied_at?: string | null;
          room_id: string;
          sender_candidate_id?: string | null;
          sender_company_group_id?: string | null;
          sender_type: string;
          sent_at?: string | null;
          status?: string;
          subject?: string | null;
          updated_at?: string | null;
        };
        Update: {
          approval_comment?: string | null;
          approval_reason?: string | null;
          approval_status?: string | null;
          content?: string;
          created_at?: string | null;
          file_urls?: Json | null;
          id?: string;
          message_type?: string;
          read_at?: string | null;
          replied_at?: string | null;
          room_id?: string;
          sender_candidate_id?: string | null;
          sender_company_group_id?: string | null;
          sender_type?: string;
          sent_at?: string | null;
          status?: string;
          subject?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_room_id_fkey';
            columns: ['room_id'];
            isOneToOne: false;
            referencedRelation: 'rooms';
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
            foreignKeyName: 'messages_sender_company_group_id_fkey';
            columns: ['sender_company_group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
        ];
      };
      ng_keywords: {
        Row: {
          category: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          keyword: string;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          keyword: string;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          keyword?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notice_categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      notice_category_relations: {
        Row: {
          category_id: string;
          created_at: string | null;
          id: string;
          notice_id: string;
        };
        Insert: {
          category_id: string;
          created_at?: string | null;
          id?: string;
          notice_id: string;
        };
        Update: {
          category_id?: string;
          created_at?: string | null;
          id?: string;
          notice_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notice_category_relations_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'notice_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notice_category_relations_notice_id_fkey';
            columns: ['notice_id'];
            isOneToOne: false;
            referencedRelation: 'notices';
            referencedColumns: ['id'];
          },
        ];
      };
      notices: {
        Row: {
          content: string | null;
          content_images: Json | null;
          created_at: string | null;
          excerpt: string | null;
          id: string;
          published_at: string | null;
          slug: string;
          status: string | null;
          thumbnail_url: string | null;
          title: string;
          updated_at: string | null;
          views_count: number | null;
        };
        Insert: {
          content?: string | null;
          content_images?: Json | null;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          slug: string;
          status?: string | null;
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string | null;
          views_count?: number | null;
        };
        Update: {
          content?: string | null;
          content_images?: Json | null;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          slug?: string;
          status?: string | null;
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string | null;
          views_count?: number | null;
        };
        Relationships: [];
      };
      notification_settings: {
        Row: {
          candidate_id: string;
          created_at: string;
          id: string;
          message_notification: string;
          recommendation_notification: string;
          scout_notification: string;
          updated_at: string;
        };
        Insert: {
          candidate_id: string;
          created_at?: string;
          id?: string;
          message_notification?: string;
          recommendation_notification?: string;
          scout_notification?: string;
          updated_at?: string;
        };
        Update: {
          candidate_id?: string;
          created_at?: string;
          id?: string;
          message_notification?: string;
          recommendation_notification?: string;
          scout_notification?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_settings_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: true;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
        ];
      };
      password_reset_tokens: {
        Row: {
          created_at: string | null;
          email: string;
          expires_at: string;
          id: string;
          token: string;
          updated_at: string | null;
          used: boolean | null;
          user_type: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          expires_at: string;
          id?: string;
          token: string;
          updated_at?: string | null;
          used?: boolean | null;
          user_type: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          expires_at?: string;
          id?: string;
          token?: string;
          updated_at?: string | null;
          used?: boolean | null;
          user_type?: string;
        };
        Relationships: [];
      };
      rooms: {
        Row: {
          candidate_id: string | null;
          company_group_id: string | null;
          created_at: string | null;
          id: string;
          participating_company_users: string[] | null;
          related_job_posting_id: string | null;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          candidate_id?: string | null;
          company_group_id?: string | null;
          created_at?: string | null;
          id?: string;
          participating_company_users?: string[] | null;
          related_job_posting_id?: string | null;
          type?: string;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string | null;
          company_group_id?: string | null;
          created_at?: string | null;
          id?: string;
          participating_company_users?: string[] | null;
          related_job_posting_id?: string | null;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'rooms_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rooms_company_group_id_fkey';
            columns: ['company_group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rooms_related_job_posting_id_fkey';
            columns: ['related_job_posting_id'];
            isOneToOne: false;
            referencedRelation: 'job_postings';
            referencedColumns: ['id'];
          },
        ];
      };
      saved_candidates: {
        Row: {
          candidate_id: string;
          company_group_id: string;
          company_user_id: string;
          created_at: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          candidate_id: string;
          company_group_id: string;
          company_user_id: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
        };
        Update: {
          candidate_id?: string;
          company_group_id?: string;
          company_user_id?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'saved_candidates_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'saved_candidates_company_group_id_fkey';
            columns: ['company_group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'saved_candidates_company_user_id_fkey';
            columns: ['company_user_id'];
            isOneToOne: false;
            referencedRelation: 'company_users';
            referencedColumns: ['id'];
          },
        ];
      };
      scout_sends: {
        Row: {
          candidate_email: string;
          candidate_id: string;
          candidate_name: string;
          company_account_id: string;
          company_group_id: string;
          created_at: string | null;
          id: string;
          job_posting_id: string | null;
          job_title: string | null;
          message_content: string;
          query_source: string | null;
          read_at: string | null;
          replied_at: string | null;
          search_query: Json | null;
          sender_company_user_id: string;
          sender_name: string;
          sent_at: string | null;
          status: string;
          subject: string;
          template_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          candidate_email: string;
          candidate_id: string;
          candidate_name: string;
          company_account_id: string;
          company_group_id: string;
          created_at?: string | null;
          id?: string;
          job_posting_id?: string | null;
          job_title?: string | null;
          message_content: string;
          query_source?: string | null;
          read_at?: string | null;
          replied_at?: string | null;
          search_query?: Json | null;
          sender_company_user_id: string;
          sender_name: string;
          sent_at?: string | null;
          status?: string;
          subject: string;
          template_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          candidate_email?: string;
          candidate_id?: string;
          candidate_name?: string;
          company_account_id?: string;
          company_group_id?: string;
          created_at?: string | null;
          id?: string;
          job_posting_id?: string | null;
          job_title?: string | null;
          message_content?: string;
          query_source?: string | null;
          read_at?: string | null;
          replied_at?: string | null;
          search_query?: Json | null;
          sender_company_user_id?: string;
          sender_name?: string;
          sent_at?: string | null;
          status?: string;
          subject?: string;
          template_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'scout_sends_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scout_sends_company_account_id_fkey';
            columns: ['company_account_id'];
            isOneToOne: false;
            referencedRelation: 'company_accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scout_sends_company_group_id_fkey';
            columns: ['company_group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scout_sends_job_posting_id_fkey';
            columns: ['job_posting_id'];
            isOneToOne: false;
            referencedRelation: 'job_postings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scout_sends_sender_company_user_id_fkey';
            columns: ['sender_company_user_id'];
            isOneToOne: false;
            referencedRelation: 'company_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scout_sends_template_id_fkey';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'search_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      scout_settings: {
        Row: {
          candidate_id: string;
          created_at: string | null;
          id: string;
          scout_status: string;
          updated_at: string | null;
        };
        Insert: {
          candidate_id: string;
          created_at?: string | null;
          id?: string;
          scout_status: string;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string;
          created_at?: string | null;
          id?: string;
          scout_status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      search_history: {
        Row: {
          created_at: string;
          group_id: string;
          group_name: string;
          id: string;
          is_saved: boolean;
          search_conditions: Json;
          search_title: string;
          searched_at: string;
          searcher_id: string;
          searcher_name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          group_id: string;
          group_name: string;
          id?: string;
          is_saved?: boolean;
          search_conditions?: Json;
          search_title: string;
          searched_at?: string;
          searcher_id: string;
          searcher_name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          group_id?: string;
          group_name?: string;
          id?: string;
          is_saved?: boolean;
          search_conditions?: Json;
          search_title?: string;
          searched_at?: string;
          searcher_id?: string;
          searcher_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      search_templates: {
        Row: {
          body: string | null;
          company_id: string;
          created_at: string | null;
          group_id: string;
          id: string;
          is_saved: boolean | null;
          subject: string | null;
          target_job_posting_id: string | null;
          template_name: string;
          updated_at: string | null;
        };
        Insert: {
          body?: string | null;
          company_id: string;
          created_at?: string | null;
          group_id: string;
          id?: string;
          is_saved?: boolean | null;
          subject?: string | null;
          target_job_posting_id?: string | null;
          template_name: string;
          updated_at?: string | null;
        };
        Update: {
          body?: string | null;
          company_id?: string;
          created_at?: string | null;
          group_id?: string;
          id?: string;
          is_saved?: boolean | null;
          subject?: string | null;
          target_job_posting_id?: string | null;
          template_name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_search_templates_company_id';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'company_accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_search_templates_group_id';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'search_templates_target_job_posting_id_fkey';
            columns: ['target_job_posting_id'];
            isOneToOne: false;
            referencedRelation: 'job_postings';
            referencedColumns: ['id'];
          },
        ];
      };
      selection_progress: {
        Row: {
          application_id: string | null;
          candidate_id: string;
          company_group_id: string;
          created_at: string | null;
          decline_reason: string | null;
          document_screening_date: string | null;
          document_screening_result: string | null;
          final_interview_date: string | null;
          final_interview_result: string | null;
          first_interview_date: string | null;
          first_interview_result: string | null;
          id: string;
          internal_memo: string | null;
          job_posting_id: string | null;
          joining_date: string | null;
          offer_date: string | null;
          offer_result: string | null;
          scout_send_id: string | null;
          secondary_interview_date: string | null;
          secondary_interview_result: string | null;
          updated_at: string | null;
        };
        Insert: {
          application_id?: string | null;
          candidate_id: string;
          company_group_id: string;
          created_at?: string | null;
          decline_reason?: string | null;
          document_screening_date?: string | null;
          document_screening_result?: string | null;
          final_interview_date?: string | null;
          final_interview_result?: string | null;
          first_interview_date?: string | null;
          first_interview_result?: string | null;
          id?: string;
          internal_memo?: string | null;
          job_posting_id?: string | null;
          joining_date?: string | null;
          offer_date?: string | null;
          offer_result?: string | null;
          scout_send_id?: string | null;
          secondary_interview_date?: string | null;
          secondary_interview_result?: string | null;
          updated_at?: string | null;
        };
        Update: {
          application_id?: string | null;
          candidate_id?: string;
          company_group_id?: string;
          created_at?: string | null;
          decline_reason?: string | null;
          document_screening_date?: string | null;
          document_screening_result?: string | null;
          final_interview_date?: string | null;
          final_interview_result?: string | null;
          first_interview_date?: string | null;
          first_interview_result?: string | null;
          id?: string;
          internal_memo?: string | null;
          job_posting_id?: string | null;
          joining_date?: string | null;
          offer_date?: string | null;
          offer_result?: string | null;
          scout_send_id?: string | null;
          secondary_interview_date?: string | null;
          secondary_interview_result?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'selection_progress_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'application';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'selection_progress_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'selection_progress_company_group_id_fkey';
            columns: ['company_group_id'];
            isOneToOne: false;
            referencedRelation: 'company_groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'selection_progress_job_posting_id_fkey';
            columns: ['job_posting_id'];
            isOneToOne: false;
            referencedRelation: 'job_postings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'selection_progress_scout_send_id_fkey';
            columns: ['scout_send_id'];
            isOneToOne: false;
            referencedRelation: 'scout_sends';
            referencedColumns: ['id'];
          },
        ];
      };
      signup_progress: {
        Row: {
          candidate_id: string | null;
          completed_steps: Json;
          created_at: string | null;
          current_step: string;
          id: string;
          step_data: Json;
          updated_at: string | null;
        };
        Insert: {
          candidate_id?: string | null;
          completed_steps?: Json;
          created_at?: string | null;
          current_step: string;
          id?: string;
          step_data?: Json;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string | null;
          completed_steps?: Json;
          created_at?: string | null;
          current_step?: string;
          id?: string;
          step_data?: Json;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'signup_progress_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: true;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
        ];
      };
      signup_verification_codes: {
        Row: {
          created_at: string | null;
          email: string;
          expires_at: string;
          id: string;
          updated_at: string | null;
          used_at: string | null;
          verification_code: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          expires_at: string;
          id?: string;
          updated_at?: string | null;
          used_at?: string | null;
          verification_code: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          expires_at?: string;
          id?: string;
          updated_at?: string | null;
          used_at?: string | null;
          verification_code?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          candidate_id: string | null;
          created_at: string | null;
          english_level: string;
          id: string;
          other_languages: Json | null;
          qualifications: string | null;
          skills_list: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          candidate_id?: string | null;
          created_at?: string | null;
          english_level: string;
          id?: string;
          other_languages?: Json | null;
          qualifications?: string | null;
          skills_list?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string | null;
          created_at?: string | null;
          english_level?: string;
          id?: string;
          other_languages?: Json | null;
          qualifications?: string | null;
          skills_list?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'skills_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
        ];
      };
      unread_notifications: {
        Row: {
          candidate_id: string;
          created_at: string;
          id: string;
          message_id: string;
          read_at: string | null;
          task_type: string;
        };
        Insert: {
          candidate_id: string;
          created_at?: string;
          id?: string;
          message_id: string;
          read_at?: string | null;
          task_type: string;
        };
        Update: {
          candidate_id?: string;
          created_at?: string;
          id?: string;
          message_id?: string;
          read_at?: string | null;
          task_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'unread_notifications_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'unread_notifications_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'messages';
            referencedColumns: ['id'];
          },
        ];
      };
      withdrawn_candidates: {
        Row: {
          candidate_id: string;
          candidate_name: string;
          created_at: string | null;
          email: string;
          id: string;
          updated_at: string | null;
          withdrawal_reason: string;
          withdrawal_reason_label: string | null;
          withdrawn_at: string | null;
        };
        Insert: {
          candidate_id: string;
          candidate_name: string;
          created_at?: string | null;
          email: string;
          id?: string;
          updated_at?: string | null;
          withdrawal_reason: string;
          withdrawal_reason_label?: string | null;
          withdrawn_at?: string | null;
        };
        Update: {
          candidate_id?: string;
          candidate_name?: string;
          created_at?: string | null;
          email?: string;
          id?: string;
          updated_at?: string | null;
          withdrawal_reason?: string;
          withdrawal_reason_label?: string | null;
          withdrawn_at?: string | null;
        };
        Relationships: [];
      };
      work_experience: {
        Row: {
          candidate_id: string | null;
          created_at: string | null;
          experience_years: number;
          id: string;
          industry_id: string;
          industry_name: string;
          updated_at: string | null;
        };
        Insert: {
          candidate_id?: string | null;
          created_at?: string | null;
          experience_years: number;
          id?: string;
          industry_id: string;
          industry_name: string;
          updated_at?: string | null;
        };
        Update: {
          candidate_id?: string | null;
          created_at?: string | null;
          experience_years?: number;
          id?: string;
          industry_id?: string;
          industry_name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'work_experience_candidate_id_fkey';
            columns: ['candidate_id'];
            isOneToOne: false;
            referencedRelation: 'candidates';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_signup_rate_limit: {
        Args: { p_email: string; p_table_name: string };
        Returns: boolean;
      };
      generate_message_tasks: {
        Args: { candidate_uuid: string };
        Returns: undefined;
      };
      generate_profile_completion_task: {
        Args: { candidate_uuid: string };
        Returns: undefined;
      };
      get_latest_messages_by_room: {
        Args: { room_ids: string[] };
        Returns: {
          content: string;
          room_id: string;
          sender_type: string;
          sent_at: string;
          status: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
