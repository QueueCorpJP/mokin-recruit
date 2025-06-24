// DIコンテナの型定義
export const TYPES = {
  // Database
  DatabaseClient: Symbol.for('DatabaseClient'),
  CandidateRepository: Symbol.for('CandidateRepository'),
  CompanyRepository: Symbol.for('CompanyRepository'),
  JobRepository: Symbol.for('JobRepository'),
  MessageRepository: Symbol.for('MessageRepository'),

  // Services
  AuthService: Symbol.for('AuthService'),
  CandidateService: Symbol.for('CandidateService'),
  CompanyService: Symbol.for('CompanyService'),
  JobService: Symbol.for('JobService'),
  MessageService: Symbol.for('MessageService'),

  // Use Cases
  AuthUseCase: Symbol.for('AuthUseCase'),
  CandidateUseCase: Symbol.for('CandidateUseCase'),
  CompanyUseCase: Symbol.for('CompanyUseCase'),
  JobUseCase: Symbol.for('JobUseCase'),
  MessageUseCase: Symbol.for('MessageUseCase'),

  // Infrastructure
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  Security: Symbol.for('Security'),
  Storage: Symbol.for('Storage'),

  // External Services
  SupabaseClient: Symbol.for('SupabaseClient'),
  EmailService: Symbol.for('EmailService'),
  FileStorage: Symbol.for('FileStorage'),
} as const;

export type DITypes = typeof TYPES;
