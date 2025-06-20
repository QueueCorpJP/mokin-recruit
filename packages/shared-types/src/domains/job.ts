import { PublicationStatus } from '../common/enums';

// Job Posting
export interface JobPosting {
  id: string;
  companyGroupId: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  remoteWorkAvailable: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryType: 'HOURLY' | 'MONTHLY' | 'ANNUAL';
  jobType: string;
  industry: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE';
  skills: string[];
  benefits: string[];
  workingHours: string;
  holidays: string;
  applicationDeadline?: Date;
  startDate?: Date;
  publicationStatus: PublicationStatus;
  isActive: boolean;
  viewCount: number;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  expiredAt?: Date;
}

// Job Search Filters
export interface JobSearchFilters {
  keywords?: string;
  jobTypes?: string[];
  industries?: string[];
  locations?: string[];
  remoteWorkAvailable?: boolean;
  salaryRange?: {
    min?: number;
    max?: number;
  };
  employmentTypes?: string[];
  experienceLevel?: string[];
  skills?: string[];
  companyIds?: string[];
  publishedAfter?: Date;
}

// Job Application
export interface JobApplication {
  id: string;
  jobPostingId: string;
  candidateId: string;
  coverLetter?: string;
  resumeFilePath?: string;
  additionalDocuments?: string[];
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  appliedAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

// Job Creation Request
export interface JobCreationRequest {
  title: string;
  description: string;
  requirements: string;
  location: string;
  remoteWorkAvailable: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryType: 'HOURLY' | 'MONTHLY' | 'ANNUAL';
  jobType: string;
  industry: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE';
  skills: string[];
  benefits: string[];
  workingHours: string;
  holidays: string;
  applicationDeadline?: string; // ISO date string
  startDate?: string; // ISO date string
}

// Job Update Request
export interface JobUpdateRequest {
  title?: string;
  description?: string;
  requirements?: string;
  location?: string;
  remoteWorkAvailable?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: 'HOURLY' | 'MONTHLY' | 'ANNUAL';
  jobType?: string;
  industry?: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  experienceLevel?: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE';
  skills?: string[];
  benefits?: string[];
  workingHours?: string;
  holidays?: string;
  applicationDeadline?: string;
  startDate?: string;
  isActive?: boolean;
}

// Job Summary (for lists)
export interface JobSummary {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salaryRange: string;
  jobType: string;
  industry: string;
  employmentType: string;
  remoteWorkAvailable: boolean;
  publishedAt: Date;
  applicationDeadline?: Date;
  tags: string[];
}

// Recommended Jobs
export interface RecommendedJob {
  job: JobSummary;
  matchScore: number;
  matchReasons: string[];
} 