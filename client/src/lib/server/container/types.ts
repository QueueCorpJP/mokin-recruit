/**
 * DIコンテナの型定義
 * 依存性注入で使用するシンボル識別子を定義
 */
export const TYPES = {
  // === Core Infrastructure ===
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  Security: Symbol.for('Security'),
  Storage: Symbol.for('Storage'),

  // === Database Layer ===
  DatabaseClient: Symbol.for('DatabaseClient'),
  DatabaseConfig: Symbol.for('DatabaseConfig'),

  // === Repository Layer ===
  CandidateRepository: Symbol.for('CandidateRepository'),
  CompanyRepository: Symbol.for('CompanyRepository'),
  CompanyAccountRepository: Symbol.for('CompanyAccountRepository'),
  JobRepository: Symbol.for('JobRepository'),
  MessageRepository: Symbol.for('MessageRepository'),
  ApplicationRepository: Symbol.for('ApplicationRepository'),

  // === Service Layer ===
  AuthService: Symbol.for('AuthService'),
  PasswordService: Symbol.for('PasswordService'),
  UserRegistrationService: Symbol.for('UserRegistrationService'),
  ValidationService: Symbol.for('ValidationService'),
  CandidateService: Symbol.for('CandidateService'),
  CompanyService: Symbol.for('CompanyService'),
  JobService: Symbol.for('JobService'),
  MessageService: Symbol.for('MessageService'),
  NotificationService: Symbol.for('NotificationService'),

  // === Use Case Layer ===
  AuthUseCase: Symbol.for('AuthUseCase'),
  CandidateUseCase: Symbol.for('CandidateUseCase'),
  CompanyUseCase: Symbol.for('CompanyUseCase'),
  JobUseCase: Symbol.for('JobUseCase'),
  MessageUseCase: Symbol.for('MessageUseCase'),
  ApplicationUseCase: Symbol.for('ApplicationUseCase'),

  // === External Services ===
  SupabaseClient: Symbol.for('SupabaseClient'),
  EmailService: Symbol.for('EmailService'),
  FileStorage: Symbol.for('FileStorage'),
  RedisClient: Symbol.for('RedisClient'),

  // === Middleware & Utilities ===
  AuthMiddleware: Symbol.for('AuthMiddleware'),
  ValidationMiddleware: Symbol.for('ValidationMiddleware'),
  ErrorHandler: Symbol.for('ErrorHandler'),
  RateLimiter: Symbol.for('RateLimiter'),
} as const;

/**
 * DIコンテナの型定義
 */
export type DITypes = typeof TYPES;

/**
 * サービス識別子の型
 */
export type ServiceIdentifier = keyof DITypes | symbol | string;

/**
 * サービス登録情報の型
 */
export interface ServiceRegistration {
  identifier: ServiceIdentifier;
  implementation: any;
  lifecycle: 'singleton' | 'transient' | 'request';
  dependencies?: ServiceIdentifier[];
}

/**
 * DIコンテナの設定オプション
 */
export interface ContainerOptions {
  defaultScope?: 'Singleton' | 'Transient' | 'Request';
  skipBaseClassChecks?: boolean;
  autoBindInjectable?: boolean;
  strictMode?: boolean;
}
