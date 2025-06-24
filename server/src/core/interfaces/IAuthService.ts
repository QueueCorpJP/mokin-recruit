// 認証結果の型定義
export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    userType: 'candidate' | 'company_user' | 'admin';
  };
  token?: string;
  error?: string;
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

// 登録データの型定義
export interface CandidateRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  firstNameKana?: string;
  lastNameKana?: string;
  gender?: string;
}

export interface CompanyUserRegistrationData {
  email: string;
  password: string;
  fullName: string;
  companyAccountId: string;
  positionTitle?: string;
}
