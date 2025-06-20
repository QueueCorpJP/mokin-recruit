import { AdminRole } from '../common/enums';

// Admin User
export interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// System Statistics
export interface SystemStatistics {
  totalCandidates: number;
  totalCompanies: number;
  totalJobPostings: number;
  totalMessages: number;
  activeJobPostings: number;
  pendingJobApprovals: number;
  flaggedMessages: number;
  newRegistrations: {
    candidates: number;
    companies: number;
  };
  period: 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR';
}

// Content Moderation
export interface ContentModerationItem {
  id: string;
  contentType: 'JOB_POSTING' | 'MESSAGE' | 'PROFILE' | 'COMPANY_INFO';
  contentId: string;
  reportedBy?: string;
  reportReason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  moderatedBy?: string;
  moderatedAt?: Date;
  notes?: string;
  createdAt: Date;
}

// NG Keyword
export interface NgKeyword {
  id: string;
  keyword: string;
  category: 'GENERAL' | 'DISCRIMINATION' | 'INAPPROPRIATE' | 'SPAM';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// System Announcement
export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'ALL' | 'CANDIDATES' | 'COMPANIES' | 'ADMINS';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  isActive: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string;
  userType: 'CANDIDATE' | 'COMPANY' | 'ADMIN';
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

// User Activity Summary
export interface UserActivitySummary {
  userId: string;
  userType: 'CANDIDATE' | 'COMPANY';
  lastLoginAt?: Date;
  totalLogins: number;
  totalActions: number;
  recentActions: AuditLog[];
  accountAge: number; // in days
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// Platform Metrics
export interface PlatformMetrics {
  userGrowth: {
    period: string;
    candidates: number;
    companies: number;
    growth: number; // percentage
  }[];
  jobPostingMetrics: {
    totalPosted: number;
    totalApproved: number;
    totalRejected: number;
    averageApprovalTime: number; // in hours
  };
  messageMetrics: {
    totalSent: number;
    scoutMessages: number;
    applicationMessages: number;
    responseRate: number;
  };
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    lastUpdated: Date;
  };
} 