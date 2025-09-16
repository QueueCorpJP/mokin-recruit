// Form data types for all user inputs across the application

// Base form validation types
export interface FormError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState<T = unknown> {
  data: T;
  errors: FormError[];
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Candidate registration and profile form types
export interface CandidateFormData {
  // 基本情報
  email: string;
  password?: string;
  passwordConfirm?: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  gender: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  prefecture: string;
  phoneNumber: string;
  currentIncome: string;

  // 転職活動状況
  hasCareerChange: string;
  jobChangeTiming: string;
  currentActivityStatus: string;

  // 職務経歴
  recentJobCompanyName: string;
  recentJobDepartmentPosition: string;
  recentJobStartYear: string;
  recentJobStartMonth: string;
  recentJobEndYear: string;
  recentJobEndMonth: string;
  recentJobIsCurrentlyWorking: boolean;
  recentJobDescription: string;
  recentJobIndustries: string[];
  recentJobTypes: string[];

  // 職務要約・自己PR
  jobSummary: string;
  selfPr: string;

  // 希望条件
  desiredWorkStyles?: string[];
  desiredSalary?: string;
  desiredIndustries?: string[];
  desiredJobTypes?: string[];
  desiredLocations?: string[];
}

// Education form data
export interface EducationFormData {
  final_education: string;
  school_name: string;
  department: string;
  graduation_year: number | null;
  graduation_month: number | null;
}

// Skills form data
export interface SkillsFormData {
  english_level: string;
  qualifications: string;
  skills_tags: string[];
  other_languages?: Array<{ language: string; level: string }>;
}

// Selection/Career status form data
export interface SelectionEntry {
  id: string;
  isPrivate: boolean;
  industries: string[];
  companyName: string;
  department: string;
  progressStatus: string;
  declineReason?: string;
  // Job history fields
  startYear?: string;
  startMonth?: string;
  endYear?: string;
  endMonth?: string;
  isCurrentlyWorking?: boolean;
  jobDescription?: string;
  jobTypes?: string[];
}

// Company registration form types
export interface CompanyFormData {
  companyName: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
  representativeName: string;
  industry: string;
  headquartersAddress: string;
  companyOverview?: string;
  appealPoints?: string;
  fullName: string;
  positionTitle?: string;
}

// Job posting form data
export interface JobPostingFormData {
  title: string;
  departmentName?: string;
  jobDescription: string;
  positionSummary?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryRange?: string;
  salaryNote?: string;
  workLocation: string[];
  locationNote?: string;
  employmentTypeNote?: string;
  workingHours?: string;
  overtimeInfo?: string;
  holidays?: string;
  remoteWorkAvailable: boolean;
  jobType: string[];
  industry: string[];
  workStyle: string[];
  benefits?: string;
  selectionProcess?: string;
  appealPoints: string[];
  smokingPolicy?: string;
  smokingPolicyNote?: string;
  requiredDocuments: string[];
  internalMemo?: string;
  applicationRequirements?: string;
  visibilityScope: string;
  publicationType: string;
  imageUrls: string[];
  applicationDeadline?: string;
}

// Message form data
export interface MessageFormData {
  subject: string;
  content: string;
  messageType: 'SCOUT' | 'APPLICATION' | 'GENERAL';
  attachmentFilePaths: string[];
}

// Search form data
export interface SearchFormData {
  keyword?: string;
  location?: string[];
  salaryMin?: number;
  salaryMax?: number;
  employmentType?: string[];
  workStyle?: string[];
  industry?: string[];
  jobType?: string[];
  remoteWorkAvailable?: boolean;
  companySize?: string[];
}

// Profile update form data
export interface ProfileUpdateFormData {
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

// Settings form data
export interface SettingsFormData {
  emailNotificationSettings: Record<string, boolean>;
  scoutReceptionEnabled: boolean;
  ngCompanies?: string[];
}

// Notification settings form data
export interface NotificationSetting {
  scoutNotification: string;
  messageNotification: string;
  recommendationNotification: string;
}

// Candidate specific settings types
export type ReceiveSetting = 'receive' | 'not-receive';

export interface NotificationSettings {
  scout_notification: ReceiveSetting;
  message_notification: ReceiveSetting;
  recommendation_notification: ReceiveSetting;
}

export interface ScoutSettings {
  scout_status: ReceiveSetting;
}

export interface BlockedCompanySettings {
  company_names: string[];
}

// Modal state for form interactions
export interface ModalState {
  isOpen: boolean;
  targetType: 'industry' | 'jobtype' | 'workstyle' | null;
  targetIndex: number | null;
}
