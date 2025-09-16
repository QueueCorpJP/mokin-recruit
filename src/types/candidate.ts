// Candidate shared domain types (non-breaking). Keep minimal and composable.

// Pagination information shared across candidate pages
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Search conditions commonly used in candidate job search
export interface CandidateSearchConditions {
  keyword?: string;
  location?: string;
  salaryMin?: string | number;
  industries?: string[];
  jobTypes?: string[];
  appealPoints?: string[];
  page?: number;
  limit?: number;
}

// Minimal card data for JobPostCard and similar UI pieces
export interface JobCardData {
  id: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  tags: string[];
  companyName: string;
  location: string | string[];
  salary: string;
  apell: string[];
  starred?: boolean;
}

// Favorite status map for batch lookups
export type FavoriteStatusMap = Record<string, boolean>;

// Core candidate profile types aligned with database schema
export type CandidateStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_DISCLOSED';
export type JobSearchStatus =
  | 'ACTIVELY_LOOKING'
  | 'PASSIVELY_LOOKING'
  | 'NOT_LOOKING'
  | 'OPEN_TO_OPPORTUNITIES';

export interface CandidateProfile {
  id: string;
  email: string;
  last_name: string;
  first_name: string;
  last_name_kana?: string;
  first_name_kana?: string;
  gender?: Gender;
  current_residence?: string;
  birth_date?: string;
  phone_number?: string;
  current_salary?: string;
  has_job_change_experience: boolean;
  desired_change_timing?: string;
  job_search_status?: JobSearchStatus;
  skills: string[];
  desired_industries: string[];
  desired_job_types: string[];
  desired_locations: string[];
  job_histories: Record<string, unknown>[];
  recent_job_company_name?: string;
  recent_job_department_position?: string;
  recent_job_start_year?: string;
  recent_job_start_month?: string;
  recent_job_end_year?: string;
  recent_job_end_month?: string;
  recent_job_is_currently_working: boolean;
  recent_job_industries: Record<string, unknown>[];
  recent_job_types: Record<string, unknown>[];
  recent_job_description?: string;
  recent_job_updated_at?: string;
  email_notification_settings: Record<string, unknown>;
  scout_reception_enabled: boolean;
  status: CandidateStatus;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// Legacy interface for backward compatibility - gradually migrate away from this
export interface CandidateData {
  id: string;
  name?: string;
  position?: string;
  location?: string;
  age?: string | number;
  gender?: string;
  salary?: string;
  degree?: string;
  university?: string;
  languageLevel?: string;
  lastLogin?: string;
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | string[]
    | number[]
    | Record<string, unknown>;
}

// Work experience types
export interface WorkExperience {
  id: string;
  candidate_id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
}

// Education types
export interface Education {
  id: string;
  candidate_id: string;
  school_name: string;
  degree_type?: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  gpa?: number;
  created_at: string;
  updated_at: string;
}
