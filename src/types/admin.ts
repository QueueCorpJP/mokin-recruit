// Admin-specific types for admin panel operations

// Candidate management types
export interface CreateCandidateData {
  // Basic info
  email: string;
  password?: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  gender: 'male' | 'female' | 'unspecified';
  birth_date: string | null;
  prefecture: string;
  phone_number: string;
  current_income: string;
  current_salary?: string;
  desired_salary?: string;

  // Current employment
  current_company?: string;
  current_position?: string;
  current_residence?: string;

  // Career status
  has_career_change: string;
  job_change_timing: string;
  current_activity_status: string;

  // Recent job
  recent_job_company_name: string;
  recent_job_department_position: string;
  recent_job_start_year: string;
  recent_job_start_month: string;
  recent_job_end_year: string;
  recent_job_end_month: string;
  recent_job_is_currently_working: boolean;
  recent_job_description: string;
  recent_job_industries: string[];
  recent_job_types: string[];

  // Summary
  job_summary: string;
  self_pr: string;

  // Preferences
  skills?: string[];
  desired_industries?: string[];
  desired_job_types?: string[];
  desired_locations?: string[];
  management_experience_count?: number;
  interested_work_styles?: string[];
}

export interface UpdateCandidateData {
  // Basic info
  email: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  gender: 'male' | 'female' | 'unspecified';
  birth_date: string;
  prefecture: string;
  phone_number: string;
  current_income: string;
  current_salary?: string;
  desired_salary?: string;

  // Current employment
  current_company?: string;
  current_position?: string;
  current_residence?: string;

  // Career status
  has_career_change: string;
  job_change_timing: string;
  current_activity_status: string;

  // Recent job
  recent_job_company_name: string;
  recent_job_department_position: string;
  recent_job_start_year: string;
  recent_job_start_month: string;
  recent_job_end_year: string;
  recent_job_end_month: string;
  recent_job_is_currently_working: boolean;
  recent_job_description: string;

  // Summary
  job_summary: string;
  self_pr: string;

  // Industry and Job Types
  recent_job_industries: string[];
  recent_job_types: string[];

  // Preferences
  skills?: string[];
  desired_industries?: string[];
  desired_job_types?: string[];
  desired_locations?: string[];
  management_experience_count?: number;
  desired_work_styles?: string[];

  // Password
  password?: string;
}

export interface AdminEducationData {
  final_education: string;
  school_name: string;
  department: string;
  graduation_year: number | null;
  graduation_month: number | null;
  other_languages?: any;
}

export interface AdminWorkExperienceData {
  industry_name?: string;
  experience_years?: number;
}

export interface AdminJobTypeExperienceData {
  job_type_name?: string;
  experience_years?: number;
}

export interface AdminSkillsData {
  english_level: string;
  other_languages: Array<{ language?: string; level?: string }>;
  skills_list: string[];
  skills_tags?: string[];
  qualifications: string;
}

export interface AdminExpectationsData {
  desired_income?: string;
  desired_industries?: string[];
  desired_job_types?: string[];
  desired_work_locations?: string[];
  desired_work_styles?: string[];
}

export interface AdminSelectionEntryData {
  companyName: string;
  industries: string[];
  jobTypes: string[];
}

// Company management types
export interface CompanyFormData {
  company_name: string;
  email: string;
  password?: string;
  representative_name: string;
  industry: string;
  headquarters_address: string;
  company_overview?: string;
  appeal_points?: string;
  full_name: string;
  position_title?: string;
}

export interface CompanyEditFormData {
  company_name: string;
  representative_name: string;
  industry: string;
  headquarters_address: string;
  company_overview?: string;
  appeal_points?: string;
}

export interface CompanyEditData {
  id: string;
  company_name: string;
  representative_name: string;
  industry: string;
  headquarters_address: string;
  company_overview: string | null;
  appeal_points: string | null;
  created_at: string;
  updated_at: string;
}

// Admin list item types
export type ArticleListItem = {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
};

export type CandidateListItem = {
  id: string;
  email: string;
  last_name: string;
  first_name: string;
  created_at: string;
  updated_at: string;
  recent_job_company_name?: string;
  desired_job_types?: string[];
  prefecture?: string;
  status?: 'active' | 'inactive' | 'pending';
};

export type CompanyListItem = {
  id: string;
  company_name: string;
  representative_name: string;
  industry: string;
  created_at: string;
  updated_at: string;
  status?: 'active' | 'inactive' | 'pending';
};

export type AdminJobListItem = {
  id: string;
  title: string;
  company_name: string;
  employment_type?: string;
  salary_range?: string;
  work_location: string[];
  status: 'draft' | 'published' | 'closed';
  created_at: string;
  updated_at: string;
  application_deadline?: string;
};

export type PendingJobListItem = {
  id: string;
  title: string;
  company_name: string;
  employment_type?: string;
  salary_range?: string;
  work_location: string[];
  status: 'pending_approval';
  submitted_at: string;
  company_id: string;
};

export type BlockedCompanyItem = {
  id: string;
  company_name: string;
  blocked_at: string;
  reason?: string;
};

// Detail data interfaces
export interface CandidateDetailData {
  // Basic information
  id: string;
  email: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  gender: 'male' | 'female' | 'unspecified';
  birth_date: string;
  prefecture: string;
  phone_number: string;
  current_income: string;
  current_salary?: string;
  desired_salary?: string;

  // Current employment
  current_company?: string;
  current_position?: string;
  current_residence?: string;

  // Career status
  has_career_change: string;
  job_change_timing: string;
  current_activity_status: string;

  // Recent job
  recent_job_company_name: string;
  recent_job_department_position: string;
  recent_job_start_year: string;
  recent_job_start_month: string;
  recent_job_end_year: string;
  recent_job_end_month: string;
  recent_job_is_currently_working: boolean;
  recent_job_description: string;
  recent_job_industries: string[];
  recent_job_types: string[];

  // Job summary/Self PR
  job_summary: string;
  self_pr: string;

  // Education
  final_education: string;
  school_name: string;
  department: string;
  graduation_year: number | null;
  graduation_month: number | null;

  // Skills
  english_level: string;
  qualifications: string;
  skills_tags: string[];
  other_languages: Array<{ language: string; level: string }>;

  // Job history
  job_history: Array<{
    company_name: string;
    department_position: string;
    start_year: string;
    start_month: string;
    end_year: string;
    end_month: string;
    is_currently_working: boolean;
    job_description: string;
    industries: string[];
    job_types: string[];
  }>;

  // Job type experience
  job_type_experience: Array<{
    job_type: string;
    experience_years: number;
  }>;

  // Expectations
  desired_work_styles: string[];
  desired_industries: string[];
  desired_job_types: string[];
  desired_locations: string[];

  // Selection entries
  selection_entries: Array<{
    id: string;
    is_private: boolean;
    industries: string[];
    company_name: string;
    department: string;
    progress_status: string;
    decline_reason?: string;
  }>;

  // Metadata
  created_at: string;
  updated_at: string;
}

// Notice/Article management types
export interface NoticeFormData {
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'published';
  published_at?: string;
}

// Admin form validation types
export interface AdminFormError {
  field: string;
  message: string;
  code?: string;
}

export interface AdminFormState<T = any> {
  data: T;
  errors: AdminFormError[];
  isSubmitting: boolean;
  isValid: boolean;
}
