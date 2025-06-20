import { Gender, UserStatus, SelectionStatus } from '../common/enums';

// Candidate Base
export interface Candidate {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  gender: Gender;
  currentResidence: string;
  birthDate: Date;
  phoneNumber: string;
  currentSalary: string;
  
  // Career Status
  hasJobChangeExperience: boolean;
  desiredChangeTiming: string;
  jobSearchStatus: string;
  
  // Recent Job
  recentCompanyName?: string;
  recentDepartmentName?: string;
  recentPositionName?: string;
  employmentStartDate?: Date;
  employmentEndDate?: Date;
  recentIndustry?: string;
  recentJobType?: string;
  jobDescription?: string;
  
  // Education & Skills
  finalEducation: string;
  englishLevel: string;
  otherLanguage?: string;
  otherLanguageLevel?: string;
  skills: string[];
  certifications?: string;
  
  // Preferences
  desiredSalary: string;
  desiredIndustries: string[];
  desiredJobTypes: string[];
  desiredLocations: string[];
  interestedWorkStyles: string[];
  
  // Additional Info
  careerSummary?: string;
  selfPr?: string;
  resumeFilePath?: string;
  careerHistoryFilePath?: string;
  scoutReceptionEnabled: boolean;
  emailNotificationSettings: Record<string, boolean>;
  blockedCompanyIds: string[];
  favoriteJobIds: string[];
  
  // System Info
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  deletedAt?: Date;
  deletionReason?: string;
}

// Candidate Profile (Public view for companies)
export interface CandidateProfile {
  id: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  gender: Gender;
  age: number; // Calculated from birthDate
  currentResidence: string;
  currentSalary: string;
  hasJobChangeExperience: boolean;
  desiredChangeTiming: string;
  jobSearchStatus: string;
  recentCompanyName?: string;
  recentDepartmentName?: string;
  recentPositionName?: string;
  recentIndustry?: string;
  recentJobType?: string;
  jobDescription?: string;
  finalEducation: string;
  englishLevel: string;
  otherLanguage?: string;
  otherLanguageLevel?: string;
  skills: string[];
  certifications?: string;
  desiredSalary: string;
  desiredIndustries: string[];
  desiredJobTypes: string[];
  desiredLocations: string[];
  interestedWorkStyles: string[];
  careerSummary?: string;
  selfPr?: string;
}

// Candidate Application Status
export interface CandidateApplicationStatus {
  id: string;
  candidateId: string;
  companyName: string;
  departmentName: string;
  positionName?: string;
  selectionStatus: SelectionStatus;
  disclosureConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Candidate Search Filters
export interface CandidateSearchFilters {
  industries?: string[];
  jobTypes?: string[];
  locations?: string[];
  salaryRange?: {
    min?: number;
    max?: number;
  };
  experienceYears?: {
    min?: number;
    max?: number;
  };
  englishLevel?: string[];
  skills?: string[];
  education?: string[];
  gender?: Gender[];
  ageRange?: {
    min?: number;
    max?: number;
  };
  hasJobChangeExperience?: boolean;
  jobSearchStatus?: string[];
  keywords?: string;
}

// Candidate Registration Request
export interface CandidateRegistrationRequest {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  gender: Gender;
  birthDate: string; // ISO date string
  phoneNumber: string;
  currentResidence: string;
  currentSalary: string;
  hasJobChangeExperience: boolean;
  desiredChangeTiming: string;
  jobSearchStatus: string;
}

// Candidate Profile Update Request
export interface CandidateProfileUpdateRequest {
  lastName?: string;
  firstName?: string;
  lastNameKana?: string;
  firstNameKana?: string;
  gender?: Gender;
  currentResidence?: string;
  phoneNumber?: string;
  currentSalary?: string;
  hasJobChangeExperience?: boolean;
  desiredChangeTiming?: string;
  jobSearchStatus?: string;
  recentCompanyName?: string;
  recentDepartmentName?: string;
  recentPositionName?: string;
  employmentStartDate?: string;
  employmentEndDate?: string;
  recentIndustry?: string;
  recentJobType?: string;
  jobDescription?: string;
  finalEducation?: string;
  englishLevel?: string;
  otherLanguage?: string;
  otherLanguageLevel?: string;
  skills?: string[];
  certifications?: string;
  desiredSalary?: string;
  desiredIndustries?: string[];
  desiredJobTypes?: string[];
  desiredLocations?: string[];
  interestedWorkStyles?: string[];
  careerSummary?: string;
  selfPr?: string;
  scoutReceptionEnabled?: boolean;
  emailNotificationSettings?: Record<string, boolean>;
} 