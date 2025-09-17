// Common types for server actions and API responses

// Base action result types
export interface ActionSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export interface ActionError {
  success: false;
  error: string;
  code?: string;
  field?: string;
}

export type ActionResult<T = unknown> = ActionSuccess<T> | ActionError;

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormActionResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  message?: string;
}

// Authentication action types
export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    user_type: 'candidate' | 'company_user' | 'admin';
  };
  error?: string;
  redirectTo?: string;
}

export interface LogoutResult {
  success: boolean;
  error?: string;
}

// Email/Password reset action types
export interface NewPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface CandidateLoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CompanyLoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CandidateResetPasswordFormData {
  email: string;
}

export interface CompanyResetPasswordFormData {
  email: string;
}

// Profile update action types
export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  firstNameKana?: string;
  lastNameKana?: string;
  phoneNumber?: string;
  currentResidence?: string;
  currentSalary?: string;
  desiredChangeTimimg?: string;
  jobSearchStatus?: string;
}

// Job-related action types
export interface JobDetailData {
  id: string;
  title: string;
  company_name: string;
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
  application_requirements?: string;
  visibility_scope: string;
  publication_type: string;
  image_urls: string[];
  application_deadline?: string;
  status: 'draft' | 'published' | 'closed';
  created_at: string;
  updated_at: string;
}

// Message-related action types
export interface SendCompanyMessageData {
  roomId: string;
  content: string;
  messageType?: 'scout' | 'application' | 'general';
  attachmentUrls?: string[];
}

export interface SendCandidateMessageData {
  roomId: string;
  content: string;
  attachmentUrls?: string[];
}

// Search-related action types
export interface SearchConditions {
  keyword?: string;
  job_types?: string[];
  industries?: string[];
  work_locations?: string[];
  work_styles?: string[];
  employment_types?: string[];
  salary_min?: number;
  salary_max?: number;
  experience_years?: number;
  english_level?: string;
  final_education?: string;
  age_min?: number;
  age_max?: number;
  gender?: string;
  remote_work_available?: boolean;
}

export interface SaveSearchHistoryData {
  name: string;
  conditions: SearchConditions;
}

export interface SearchHistoryItem {
  id: string;
  name: string;
  conditions: SearchConditions;
  created_at: string;
  updated_at: string;
}

// Favorite-related action types
export interface FavoriteItem {
  id: string;
  job_id: string;
  job_posting_id: string;
  candidate_id: string;
  created_at: string;
  job_posting?: {
    id: string;
    title: string;
    company_name: string;
    work_location: string[];
    salary_range?: string;
  };
  job_postings?:
    | {
        id: string;
        title: string;
        job_description: string;
        salary_min?: number;
        salary_max?: number;
        work_location: string[];
        company_accounts: {
          company_name: string;
        };
      }
    | {
        id: string;
        title: string;
        job_description: string;
        salary_min?: number;
        salary_max?: number;
        work_location: string[];
        company_accounts: {
          company_name: string;
        };
      }[];
}

export interface FavoriteActionResult {
  success: boolean;
  error?: string;
  favorite?: FavoriteItem;
  message?: string;
}

export interface FavoriteListResult {
  success: boolean;
  data?: {
    favorites: FavoriteItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}

export interface FavoriteStatusResult {
  success: boolean;
  data?: Record<string, boolean>;
  error?: string;
}

// Selection progress update types
export interface SelectionProgressUpdateParams {
  candidateId: string;
  status: string;
  declineReason?: string;
  notes?: string;
}

export interface JoiningDateUpdateParams {
  candidateId: string;
  joiningDate: string;
  notes?: string;
}

// Company task data types
export interface CompanyAccountData {
  id: string;
  company_name: string;
  representative_name: string;
  industry: string;
  headquarters_address: string;
  company_overview?: string;
  appeal_points?: string;
  created_at: string;
  updated_at: string;
}

// Upload-related types
export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export interface FileUploadResult {
  success: boolean;
  urls: string[];
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Common API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
}
