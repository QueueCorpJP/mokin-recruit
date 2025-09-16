// Authentication and user management types

export type UserType = 'candidate' | 'company_user' | 'admin';
export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'PENDING_VERIFICATION';

// Core auth user interface
export interface AuthUser {
  id: string;
  email: string;
  userType: UserType;
  name?: string;
  emailConfirmed: boolean;
  lastSignIn?: string;
  status?: UserStatus;
  user_metadata?: {
    user_type?: string;
    company_account_id?: string;
    company_user_id?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
}

// Authentication state for client components
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  userType: UserType | null;
  loading: boolean;
}

// Login form types
export interface LoginData {
  email: string;
  password: string;
  userType?: UserType;
}

// Registration form types
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword?: string;
  userType: UserType;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  agreeToTerms: boolean;
}

// Password reset types
export interface ResetPasswordData {
  email: string;
  userType?: UserType;
}

export interface NewPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
}

// Session response types
export interface SessionResponse {
  user: AuthUser | null;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } | null;
  error?: string;
}

// Auth context types
export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (_credentials: LoginData) => Promise<{ error?: string }>;
  signUp: (_data: RegisterData) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (_data: ResetPasswordData) => Promise<{ error?: string }>;
  updatePassword: (_data: NewPasswordData) => Promise<{ error?: string }>;
  refreshSession: () => Promise<void>;
}

// Permission and role types
export interface UserPermission {
  id: string;
  user_id: string;
  resource: string;
  action: string;
  granted: boolean;
  created_at: string;
  updated_at: string;
}

export interface RolePermission {
  role: UserType;
  permissions: string[];
  restrictions?: string[];
}
