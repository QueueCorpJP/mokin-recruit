// User Status
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

// Gender
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

// Company Status
export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// Permission Level
export enum PermissionLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER'
}

// Selection Status
export enum SelectionStatus {
  APPLIED = 'APPLIED',
  DOCUMENT_SCREENING = 'DOCUMENT_SCREENING',
  FIRST_INTERVIEW = 'FIRST_INTERVIEW',
  SECOND_INTERVIEW = 'SECOND_INTERVIEW',
  FINAL_INTERVIEW = 'FINAL_INTERVIEW',
  OFFER = 'OFFER',
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  OFFER_DECLINED = 'OFFER_DECLINED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

// Message Type
export enum MessageType {
  SCOUT = 'SCOUT',
  APPLICATION = 'APPLICATION',
  GENERAL = 'GENERAL',
  SYSTEM = 'SYSTEM'
}

// Message Status
export enum MessageStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED'
}

// Publication Status
export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED'
}

// Admin Role
export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
} 