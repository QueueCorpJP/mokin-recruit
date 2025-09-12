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

export type JobPosting = {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
};

// UI specific view types can evolve separately from domain types
export type CompanyMemberView = {
  id: CompanyUserId;
  email: string;
  nameLabel: string;
  role: UiRole;
};
