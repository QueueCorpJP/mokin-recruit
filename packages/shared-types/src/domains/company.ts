import { CompanyStatus, PermissionLevel } from '../common/enums';

// Company Account
export interface CompanyAccount {
  id: string;
  companyName: string;
  headquartersAddress: string;
  representativeName: string;
  industry: string;
  companyOverview?: string;
  appealPoints?: string;
  logoImagePath?: string;
  contractPlan: CompanyContractPlan;
  status: CompanyStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Company Contract Plan
export interface CompanyContractPlan {
  planType: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  maxJobPostings: number;
  maxScoutMessages: number;
  features: string[];
  monthlyFee: number;
  startDate: Date;
  endDate?: Date;
}

// Company Group
export interface CompanyGroup {
  id: string;
  companyAccountId: string;
  groupName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Company User
export interface CompanyUser {
  id: string;
  companyAccountId: string;
  fullName: string;
  positionTitle?: string;
  email: string;
  emailNotificationSettings: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// Company User Group Permission
export interface CompanyUserGroupPermission {
  id: string;
  companyUserId: string;
  companyGroupId: string;
  permissionLevel: PermissionLevel;
  createdAt: Date;
  updatedAt: Date;
}

// Company Profile (Public view)
export interface CompanyProfile {
  id: string;
  companyName: string;
  industry: string;
  headquartersAddress: string;
  companyOverview?: string;
  appealPoints?: string;
  logoImagePath?: string;
  jobPostingsCount: number;
  establishedYear?: number;
  employeeCount?: string;
  website?: string;
}

// Company Registration Request
export interface CompanyRegistrationRequest {
  companyName: string;
  headquartersAddress: string;
  representativeName: string;
  industry: string;
  companyOverview?: string;
  appealPoints?: string;
  userFullName: string;
  userEmail: string;
  userPassword: string;
  userPositionTitle?: string;
}

// Company Profile Update Request
export interface CompanyProfileUpdateRequest {
  companyName?: string;
  headquartersAddress?: string;
  representativeName?: string;
  industry?: string;
  companyOverview?: string;
  appealPoints?: string;
  logoImagePath?: string;
}

// Company User Invitation Request
export interface CompanyUserInvitationRequest {
  email: string;
  fullName: string;
  positionTitle?: string;
  companyGroupIds: string[];
  permissionLevel: PermissionLevel;
}

// Company Search Filters
export interface CompanySearchFilters {
  industries?: string[];
  locations?: string[];
  companySize?: string[];
  keywords?: string;
  hasActiveJobs?: boolean;
} 