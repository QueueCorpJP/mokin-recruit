// 認証結果の型定義
export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    userType?: 'candidate' | 'company_user' | 'admin';
    type?: string;
    profile?: any;
  };
  token?: string;
}

// 認証サービスインターフェース (SRP準拠)
export interface IAuthService {
  // 認証
  authenticate(email: string, password: string): Promise<AuthResult>;

  // トークン検証
  verifyToken(token: string): Promise<AuthResult>;

  // トークンリフレッシュ
  refreshToken(refreshToken: string): Promise<AuthResult>;

  // ログアウト
  logout(token: string): Promise<boolean>;
}

// パスワード管理サービスインターフェース (SRP準拠)
export interface IPasswordService {
  // パスワードハッシュ化
  hashPassword(password: string): Promise<string>;

  // パスワード検証
  verifyPassword(password: string, hash: string): Promise<boolean>;

  // パスワードリセット要求
  requestPasswordReset(email: string): Promise<boolean>;

  // パスワードリセット実行
  resetPassword(token: string, newPassword: string): Promise<boolean>;
}

// ユーザー登録サービスインターフェース (SRP準拠)
export interface IUserRegistrationService {
  // 候補者登録
  registerCandidate(data: CandidateRegistrationData): Promise<AuthResult>;

  // 企業ユーザー登録
  registerCompanyUser(data: CompanyUserRegistrationData): Promise<AuthResult>;
}

// MVPスキーマ対応の候補者登録データ
export interface CandidateRegistrationData {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  phoneNumber?: string;
  currentResidence?: string;
  currentSalary?: string;
  desiredSalary?: string;
  skills?: string[];
  experienceYears?: number;
  desiredIndustries?: string[];
  desiredJobTypes?: string[];
  desiredLocations?: string[];
  scoutReceptionEnabled?: boolean;
}

// MVPスキーマ対応の企業ユーザー登録データ
export interface CompanyUserRegistrationData {
  email: string;
  password: string;
  fullName: string;
  companyAccountId: string;
  positionTitle?: string;
}
