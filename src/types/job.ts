// Job posting and related types

export type JobPostingStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SUSPENDED';
export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP';
export type WorkStyleType = 'OFFICE' | 'REMOTE' | 'HYBRID';

// Job type and industry classification types
export interface JobType {
  id: string;
  name: string;
  experienceYears?: string;
}

export interface JobTypeGroup {
  id: string;
  name: string;
  label?: string; // For backward compatibility
  jobTypes: JobType[];
}

export interface Industry {
  id: string;
  name: string;
  experienceYears?: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface WorkStyle {
  id: string;
  name: string;
}

export interface JobPosting {
  id: string;
  company_account_id: string;
  company_group_id: string;
  title: string;
  department_name?: string;
  job_description: string;
  position_summary?: string;
  required_skills: string[];
  preferred_skills: string[];
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  salary_range?: string;
  salary_note?: string;
  work_location: string[];
  location_note?: string;
  employment_type_note?: string;
  working_hours?: string;
  overtime_info?: string;
  holidays?: string;
  remote_work_available: boolean;
  job_type: string[];
  industry: string[];
  work_style: string[];
  benefits?: string;
  selection_process?: string;
  appeal_points: string[];
  smoking_policy?: string;
  smoking_policy_note?: string;
  required_documents: string[];
  internal_memo?: string;
  application_requirements?: string;
  visibility_scope: string;
  publication_type: string;
  image_urls: string[];
  target_candidate_conditions: Record<string, unknown>;
  publication_status: JobPostingStatus;
  status: JobPostingStatus;
  published_at?: string;
  application_deadline?: string;
  created_at: string;
  updated_at: string;

  // Relations
  company_account?: {
    company_name: string;
    logo_image_path?: string;
  };
  company_group?: {
    group_name: string;
  };
}

// Job search and filtering types
export interface JobSearchFilters {
  keyword?: string;
  location?: string[];
  salary_min?: number;
  salary_max?: number;
  employment_type?: string[];
  work_style?: string[];
  industry?: string[];
  job_type?: string[];
  remote_work_available?: boolean;
  company_size?: string[];
}

export interface JobSearchResult {
  jobs: JobPosting[];
  total: number;
  filters: JobSearchFilters;
  page: number;
  limit: number;
}

// API request/response types for job operations
export interface JobSearchParams {
  keyword?: string;
  location?: string;
  salaryMin?: string;
  industries?: string[];
  jobTypes?: string[];
  appealPoints?: string[];
  page?: number;
  limit?: number;
}

export interface JobSearchResponse {
  success: boolean;
  data?: {
    jobs: JobPosting[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}

export interface JobDetailResponse {
  success: boolean;
  data?: JobPosting;
  error?: string;
}

export interface JobCreateData {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  employment_type: string;
  experience_level: string;
  industry: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  company_id: string;
}

export interface JobUpdateData extends Partial<JobCreateData> {
  id: string;
}

// Job entity for domain layer
export interface JobEntity {
  id: string;
  title: string;
  description: string;
  companyId: string;
  location: string;
  salaryRange?: string;
  requirements?: string;
  benefits?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Application related types
export type ApplicationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'OFFER_MADE'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface Application {
  id: string;
  candidate_id: string;
  job_posting_id: string;
  status: ApplicationStatus;
  application_date: string;
  cover_letter?: string;
  resume_file_path?: string;
  notes?: string;
  created_at: string;
  updated_at: string;

  // Relations
  job_posting?: JobPosting;
  candidate?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

// UI-specific job search result types (for search/setting pages)
export interface JobSearchResultUI {
  id: string;
  title: string;
  companyName: string;
  imageUrl: string;
  imageAlt?: string;
  tags: string[];
  location: string[];
  salary: string;
  apell: string[];
  starred?: boolean;
  created_at: string;
  job_type: string | string[];
  work_location: string | string[];
  salary_min?: number;
  salary_max?: number;
  salary_note?: string;
  appeal_points?: any;
  image_urls?: string[];
  company_name?: string;
  companyIconUrl?: string;
}

export interface JobSearchResponseUI {
  success: boolean;
  data?: {
    jobs: JobSearchResultUI[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}

export interface FavoriteStatusResponse {
  success: boolean;
  data?: Record<string, boolean>;
  error?: string;
}
