// Centralized type definitions for Mokin Recruit
// This file consolidates and re-exports all domain types

// Database types (auto-generated from Supabase)
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/lib/server/types/supabase';

// Domain-specific types
export * from './candidate';
export * from './company';
export * from './message';
export * from './candidate-message';
export * from './job';
export * from './auth';
// Import only specific types from forms to avoid conflicts
export type {
  CandidateFormData,
  CompanyAccountFormData,
  PasswordFormData,
  EducationFormData,
  WorkExperienceFormData,
  SkillsFormData,
  CareerStatusFormData,
  ExpectationsFormData,
  ResumeFormData,
  ProfileFormData,
  JobFormData,
  NotificationFormData,
  EmailChangeFormData,
} from './forms';
export * from './media';
export * from './task';
export * from './admin';
export * from './actions';

// Re-export specific types to avoid conflicts
export type { JobPosting } from './job';
export type { CompanyJobPosting } from './company';
export type { CompanyFormData as AdminCompanyFormData } from './admin';

// Remove this line as we're now explicitly importing specific types from forms

// Common utility types
export type ID = string;
export type UUID = string;
export type Timestamp = string;
export type EmailAddress = string;

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Pagination types (consolidated from candidate.ts)
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Status enums commonly used across the app
export type EntityStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'ARCHIVED'
  | 'DRAFT'
  | 'PUBLISHED';
export type UserRole = 'CANDIDATE' | 'COMPANY_USER' | 'ADMIN';
export type MessageStatus = 'SENT' | 'READ' | 'REPLIED';
export type ApplicationStatus =
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'ACCEPTED'
  | 'REJECTED';

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  errors?: ValidationError[];
  success?: boolean;
  message?: string;
}
