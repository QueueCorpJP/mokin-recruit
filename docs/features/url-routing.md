# URL Routing Design

## Overview

This document defines the complete URL routing structure for the Mokin Recruit platform, ensuring
role-based separation and preventing URL conflicts.

## Core Routing Principles

### 1. Role-Based Prefix System

- **Candidate**: `/candidate/*` - All candidate-specific functionality
- **Company**: `/company/*` - All company-specific functionality
- **Admin**: `/admin/*` - All administrative functionality
- **Public**: No prefix - Public pages and shared functionality

### 2. Development Flexibility

- **Auth Bypass**: `/dev-tools` - Development authentication bypass
- **Legacy Support**: Temporary compatibility for existing `/auth/*` routes
- **API Endpoints**: Shared across all roles under `/api/*`

## Complete URL Structure

### Authentication Routes

#### Candidate Authentication

- `/candidate/auth/login` - Candidate login page
- `/candidate/auth/register` - Candidate registration page
- `/candidate/auth/reset-password` - Password reset request
- `/candidate/auth/reset-password/new` - New password form
- `/candidate/auth/reset-password/complete` - Reset completion

#### Company Authentication

- `/company/auth/login` - Company login page
- `/company/auth/register` - Company registration page
- `/company/auth/reset-password` - Password reset request
- `/company/auth/reset-password/new` - New password form
- `/company/auth/reset-password/complete` - Reset completion

#### Admin Authentication

- `/admin/auth/login` - Admin login page
- `/admin/auth/register` - Admin registration page (if needed)
- `/admin/auth/reset-password` - Password reset request
- `/admin/auth/reset-password/new` - New password form
- `/admin/auth/reset-password/complete` - Reset completion

### Main Application Routes

#### Candidate Routes

- `/candidate/dashboard` - Candidate dashboard (was `/mypage`)
- `/candidate/profile` - Profile management
- `/candidate/search` - Job search interface
- `/candidate/applications` - Application history
- `/candidate/messages` - Message center
- `/candidate/tasks` - Task management
- `/candidate/settings` - Account settings
- `/candidate/notifications` - Notification center

#### Company Routes

- `/company/dashboard` - Company dashboard (was `/mypage`)
- `/company/profile` - Company profile management
- `/company/search` - Candidate search interface
- `/company/job` - Job posting management
- `/company/applications` - Application management
- `/company/messages` - Message center
- `/company/analytics` - Recruitment analytics
- `/company/settings` - Account settings
- `/company/team` - Team member management

#### Admin Routes

- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/companies` - Company management
- `/admin/jobs` - Job management
- `/admin/messages` - System messages
- `/admin/analytics` - System analytics
- `/admin/settings` - System settings
- `/admin/audit` - Audit logs

### Public Routes (No Prefix)

- `/` - Landing page
- `/about` - About page
- `/contact` - Contact page
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/help` - Help center
- `/dev-tools` - Development tools (dev only)

### API Routes (Shared)

- `/api/auth/login` - Authentication endpoint (shared)
- `/api/auth/register/candidate` - Candidate registration
- `/api/auth/register/company` - Company registration
- `/api/auth/logout` - Logout endpoint (shared)
- `/api/auth/session` - Session management (shared)
- `/api/auth/reset-password` - Password reset (shared)
- `/api/auth/reset-password/request` - Reset request (shared)

## Implementation Guidelines

### 1. Migration Strategy

1. **Phase 1**: Implement new role-based routes
2. **Phase 2**: Add legacy route redirects
3. **Phase 3**: Update all internal links
4. **Phase 4**: Remove legacy routes

### 2. Development Considerations

- **Auth Bypass**: Maintain `/dev-tools` for development authentication
- **API Consistency**: Keep API endpoints role-agnostic where possible
- **Middleware**: Update to handle new URL patterns
- **Testing**: Ensure all routes work in both development and production

### 3. SEO and User Experience

- **Clear URLs**: Role-based prefixes improve clarity
- **Bookmarkable**: All routes remain bookmarkable
- **Responsive**: All routes work across devices
- **Accessible**: Maintain accessibility standards

### 4. Security Considerations

- **Role Validation**: Middleware validates user role against URL prefix
- **Access Control**: Proper authentication checks for protected routes
- **CSRF Protection**: Maintain CSRF protection across all routes

## Route Conflicts Resolution

### Before (Problematic)

```
/login (candidate? company? admin?)
/mypage (candidate? company?)
/search (candidate searching jobs? company searching candidates?)
/message (candidate messages? company messages?)
```

### After (Clear Separation)

```
/candidate/auth/login (candidate login)
/company/auth/login (company login)
/admin/auth/login (admin login)

/candidate/dashboard (candidate dashboard)
/company/dashboard (company dashboard)

/candidate/search (job search)
/company/search (candidate search)

/candidate/messages (candidate messages)
/company/messages (company messages)
```

## Next Steps

1. **Update middleware.ts** - Add new URL patterns
2. **Create new page components** - Implement role-based auth pages
3. **Update navigation components** - Use new URL structure
4. **Add redirect logic** - Handle legacy URLs
5. **Update API documentation** - Reflect new routing structure
6. **Test all routes** - Ensure proper functionality

This routing structure provides:

- ✅ Complete role separation
- ✅ Zero URL conflicts
- ✅ Development flexibility
- ✅ Scalable architecture
- ✅ Clear user experience
