export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          birth_date: string | null
          created_at: string | null
          current_residence: string | null
          current_salary: string | null
          desired_change_timing: string | null
          desired_industries: string[] | null
          desired_job_types: string[] | null
          desired_locations: string[] | null
          email: string
          email_notification_settings: Json | null
          first_name: string
          first_name_kana: string | null
          gender: string | null
          has_job_change_experience: boolean | null
          id: string
          job_search_status: string | null
          last_login_at: string | null
          last_name: string
          last_name_kana: string | null
          password_hash: string
          phone_number: string | null
          scout_reception_enabled: boolean | null
          skills: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string | null
          current_residence?: string | null
          current_salary?: string | null
          desired_change_timing?: string | null
          desired_industries?: string[] | null
          desired_job_types?: string[] | null
          desired_locations?: string[] | null
          email: string
          email_notification_settings?: Json | null
          first_name: string
          first_name_kana?: string | null
          gender?: string | null
          has_job_change_experience?: boolean | null
          id?: string
          job_search_status?: string | null
          last_login_at?: string | null
          last_name: string
          last_name_kana?: string | null
          password_hash: string
          phone_number?: string | null
          scout_reception_enabled?: boolean | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string | null
          current_residence?: string | null
          current_salary?: string | null
          desired_change_timing?: string | null
          desired_industries?: string[] | null
          desired_job_types?: string[] | null
          desired_locations?: string[] | null
          email?: string
          email_notification_settings?: Json | null
          first_name?: string
          first_name_kana?: string | null
          gender?: string | null
          has_job_change_experience?: boolean | null
          id?: string
          job_search_status?: string | null
          last_login_at?: string | null
          last_name?: string
          last_name_kana?: string | null
          password_hash?: string
          phone_number?: string | null
          scout_reception_enabled?: boolean | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_accounts: {
        Row: {
          appeal_points: string | null
          company_name: string
          company_overview: string | null
          contract_plan: Json | null
          created_at: string | null
          headquarters_address: string | null
          id: string
          industry: string
          logo_image_path: string | null
          representative_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appeal_points?: string | null
          company_name: string
          company_overview?: string | null
          contract_plan?: Json | null
          created_at?: string | null
          headquarters_address?: string | null
          id?: string
          industry: string
          logo_image_path?: string | null
          representative_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appeal_points?: string | null
          company_name?: string
          company_overview?: string | null
          contract_plan?: Json | null
          created_at?: string | null
          headquarters_address?: string | null
          id?: string
          industry?: string
          logo_image_path?: string | null
          representative_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_users: {
        Row: {
          company_account_id: string
          created_at: string | null
          email: string
          email_notification_settings: Json | null
          full_name: string
          id: string
          last_login_at: string | null
          password_hash: string
          position_title: string | null
          updated_at: string | null
        }
        Insert: {
          company_account_id: string
          created_at?: string | null
          email: string
          email_notification_settings?: Json | null
          full_name: string
          id?: string
          last_login_at?: string | null
          password_hash: string
          position_title?: string | null
          updated_at?: string | null
        }
        Update: {
          company_account_id?: string
          created_at?: string | null
          email?: string
          email_notification_settings?: Json | null
          full_name?: string
          id?: string
          last_login_at?: string | null
          password_hash?: string
          position_title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_account_id_fkey"
            columns: ["company_account_id"]
            isOneToOne: false
            referencedRelation: "company_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          application_deadline: string | null
          application_requirements: string | null
          benefits: string | null
          company_account_id: string
          created_at: string | null
          department_name: string | null
          employment_type: string | null
          id: string
          job_description: string
          preferred_skills: string[] | null
          publication_status: string | null
          published_at: string | null
          required_skills: string[] | null
          salary_range: string | null
          selection_process: string | null
          target_candidate_conditions: Json | null
          title: string
          updated_at: string | null
          visibility_scope: string | null
          work_location: string | null
          work_style: string[] | null
        }
        Insert: {
          application_deadline?: string | null
          application_requirements?: string | null
          benefits?: string | null
          company_account_id: string
          created_at?: string | null
          department_name?: string | null
          employment_type?: string | null
          id?: string
          job_description: string
          preferred_skills?: string[] | null
          publication_status?: string | null
          published_at?: string | null
          required_skills?: string[] | null
          salary_range?: string | null
          selection_process?: string | null
          target_candidate_conditions?: Json | null
          title: string
          updated_at?: string | null
          visibility_scope?: string | null
          work_location?: string | null
          work_style?: string[] | null
        }
        Update: {
          application_deadline?: string | null
          application_requirements?: string | null
          benefits?: string | null
          company_account_id?: string
          created_at?: string | null
          department_name?: string | null
          employment_type?: string | null
          id?: string
          job_description?: string
          preferred_skills?: string[] | null
          publication_status?: string | null
          published_at?: string | null
          required_skills?: string[] | null
          salary_range?: string | null
          selection_process?: string | null
          target_candidate_conditions?: Json | null
          title?: string
          updated_at?: string | null
          visibility_scope?: string | null
          work_location?: string | null
          work_style?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_company_account_id_fkey"
            columns: ["company_account_id"]
            isOneToOne: false
            referencedRelation: "company_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_file_paths: string[] | null
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          read_at: string | null
          receiver_candidate_id: string | null
          receiver_company_user_id: string | null
          receiver_type: string
          replied_at: string | null
          sender_candidate_id: string | null
          sender_company_user_id: string | null
          sender_type: string
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          attachment_file_paths?: string[] | null
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          receiver_candidate_id?: string | null
          receiver_company_user_id?: string | null
          receiver_type: string
          replied_at?: string | null
          sender_candidate_id?: string | null
          sender_company_user_id?: string | null
          sender_type: string
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          attachment_file_paths?: string[] | null
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          receiver_candidate_id?: string | null
          receiver_company_user_id?: string | null
          receiver_type?: string
          replied_at?: string | null
          sender_candidate_id?: string | null
          sender_company_user_id?: string | null
          sender_type?: string
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_candidate_id_fkey"
            columns: ["receiver_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_company_user_id_fkey"
            columns: ["receiver_company_user_id"]
            isOneToOne: false
            referencedRelation: "company_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_candidate_id_fkey"
            columns: ["sender_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_company_user_id_fkey"
            columns: ["sender_company_user_id"]
            isOneToOne: false
            referencedRelation: "company_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
