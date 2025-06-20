// User Types
export type UserType = 'CANDIDATE' | 'COMPANY' | 'ADMIN';

// Auth Token
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

// Auth User
export interface AuthUser {
  id: string;
  email: string;
  userType: UserType;
  isVerified: boolean;
  lastLoginAt?: Date;
}

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Register Request
export interface RegisterRequest {
  email: string;
  password: string;
  userType: UserType;
}

// Password Reset Request
export interface PasswordResetRequest {
  email: string;
}

// Password Update Request
export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

// Email Verification
export interface EmailVerificationRequest {
  email: string;
  verificationCode: string;
}

// JWT Payload
export interface JwtPayload {
  sub: string; // user id
  email: string;
  userType: UserType;
  iat: number;
  exp: number;
}

// Session Data
export interface SessionData {
  user: AuthUser;
  token: AuthToken;
  expiresAt: Date;
} 