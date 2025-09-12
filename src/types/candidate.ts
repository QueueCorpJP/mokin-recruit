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

// UIで参照される可能性のある候補者概要（既存のCandidateDataが散在するため補完用）
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
  [key: string]: any;
}
