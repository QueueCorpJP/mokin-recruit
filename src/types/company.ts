// Company domain and UI display types
// Keep minimal to avoid compile ripple effects. Extend incrementally.

export type CompanyId = string;
export type CompanyAccountId = string;
export type CompanyUserId = string;

export type PermissionLevelDb =
  | 'ADMINISTRATOR'
  | 'SCOUT_STAFF'
  | 'RECRUITER_STAFF';
export type UiRole = 'admin' | 'scout' | 'recruiter';

export type CompanyGroup = {
  id: string;
  name: string;
};

export type CompanyMember = {
  id: CompanyUserId;
  email: string;
  displayName?: string;
  permissionLevel: PermissionLevelDb;
};

export type CompanyJobPosting = {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
};

// Company detail page types
export interface CompanyDetailData {
  id: string;
  companyName: string;
  companyLogo?: string;
  images: string[];
  title: string;
  description: string;
  jobDescription: string;
  positionSummary: string;
  skills: string;
  otherRequirements: string;
  jobTypes: string[];
  industries: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryNote: string;
  locations: string[];
  locationNote: string;
  employmentType: string;
  employmentTypeNote: string;
  workingHours: string;
  overtime: string;
  overtimeMemo?: string;
  holidays: string;
  selectionProcess: string;
  appealPoints: {
    business: string[];
    company: string[];
    team: string[];
    workstyle: string[];
  };
  smoke: string;
  resumeRequired: string[];
  representative: string;
  establishedYear: string;
  capital: string;
  employeeCount: string;
  industry: string;
  businessContent: string;
  address: string;
  companyPhase: string;
  website: string;
}

export interface JobPostingData {
  id: string;
  title: string;
  employment_type: string;
  work_location: string[];
  salary_min?: number;
  salary_max?: number;
  image_urls?: string[];
  job_type?: string | string[];
  required_documents?: string[];
}

// UI specific view types can evolve separately from domain types
export type CompanyMemberView = {
  id: CompanyUserId;
  email: string;
  nameLabel: string;
  role: UiRole;
};

// Account management types
export interface Member {
  id: string;
  name: string;
  email: string;
  permission: 'admin' | 'scout' | 'recruiter' | 'member' | 'viewer';
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
}
