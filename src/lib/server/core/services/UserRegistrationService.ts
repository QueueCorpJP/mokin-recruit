import 'reflect-metadata';
import { injectable } from 'inversify';
import { logger } from '@/lib/server/utils/logger';
import {
  registerUserWithSupabase,
  UserRegistrationData,
} from '@/lib/server/auth/supabaseAuth';
import {
  CandidateRepository,
  CreateCandidateData,
} from '@/lib/server/infrastructure/database/CandidateRepository';
import {
  CompanyAccountRepository,
  CompanyUserRepository,
  CreateCompanyUserData,
} from '@/lib/server/infrastructure/database/CompanyUserRepository';
import { PasswordService } from './PasswordService';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import {
  AuthResult,
  IUserRegistrationService,
} from '@/lib/server/core/interfaces/IAuthService';

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

// ユーザー登録サービスの実装 (SRP準拠)
@injectable()
export class UserRegistrationService implements IUserRegistrationService {
  private candidateRepository: CandidateRepository;
  private companyUserRepository: CompanyUserRepository;
  private companyAccountRepository: CompanyAccountRepository;
  private passwordService: PasswordService;

  constructor() {
    this.candidateRepository = new CandidateRepository();
    this.companyUserRepository = new CompanyUserRepository();
    this.companyAccountRepository = new CompanyAccountRepository();
    this.passwordService = new PasswordService();
  }

  async registerCandidate(
    data: CandidateRegistrationData
  ): Promise<AuthResult> {
    try {
      logger.info(`Candidate registration attempt for email: ${data.email}`);

      // パスワード強度チェック
      const passwordValidation = this.passwordService.validatePasswordStrength(
        data.password
      );
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: `Password validation failed: ${passwordValidation.errors.join(', ')}`,
        };
      }

      // メールアドレス重複チェック
      const existingCandidate = await this.candidateRepository.findByEmail(
        data.email
      );
      if (existingCandidate) {
        logger.warn(
          `Candidate registration failed - email already exists: ${data.email}`
        );
        return {
          success: false,
          error: 'Email already exists',
        };
      }

      // Supabase Authでユーザー登録
      const userData: UserRegistrationData = {
        email: data.email,
        password: data.password,
        metadata: {
          firstName: data.firstName,
          lastName: data.lastName,
          userType: 'candidate',
        },
      };

      const authResult = await registerUserWithSupabase(userData);
      if (!authResult.success) {
        logger.error(
          `Supabase registration failed for email: ${data.email}`,
          authResult.error
        );
        return {
          success: false,
          error: authResult.error || 'Registration failed',
        };
      }

      // パスワードハッシュ化
      const hashedPassword = await this.passwordService.hashPassword(
        data.password
      );

      // 候補者テーブルにデータ挿入
      const candidateData: CreateCandidateData = {
        email: data.email,
        password_hash: hashedPassword,
        last_name: data.lastName,
        first_name: data.firstName,
        phone_number: data.phoneNumber,
        current_residence: data.currentResidence,
        current_salary: data.currentSalary,
        desired_salary: data.desiredSalary,
        skills: data.skills || [],
        experience_years: data.experienceYears || 0,
        desired_industries: data.desiredIndustries || [],
        desired_job_types: data.desiredJobTypes || [],
        desired_locations: data.desiredLocations || [],
        scout_reception_enabled: data.scoutReceptionEnabled ?? true,
      };

      const candidate = await this.candidateRepository.create(candidateData);
      
      // Supabaseのメタデータを更新してcandidateIdを追加
      if (authResult.user) {
        const supabase = getSupabaseAdminClient();
        await supabase.auth.admin.updateUserById(authResult.user.id, {
          user_metadata: {
            ...authResult.user.user_metadata,
            candidateId: candidate.id,
            full_name: `${data.lastName} ${data.firstName}`,
          }
        });
      }

      logger.info(`Candidate registration successful: ${candidate.email}`);

      return {
        success: true,
        user: {
          id: authResult.user!.id,
          email: authResult.user!.email!,
          userType: 'candidate',
          type: 'candidate',
          profile: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
        token: authResult.token,
      };
    } catch (error) {
      logger.error('Candidate registration error:', error);
      return {
        success: false,
        error: 'Registration failed',
      };
    }
  }

  async registerCompanyUser(
    data: CompanyUserRegistrationData
  ): Promise<AuthResult> {
    try {
      logger.info(`Company user registration attempt for email: ${data.email}`);

      // パスワード強度チェック
      const passwordValidation = this.passwordService.validatePasswordStrength(
        data.password
      );
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: `Password validation failed: ${passwordValidation.errors.join(', ')}`,
        };
      }

      // メールアドレス重複チェック
      const existingUser = await this.companyUserRepository.findByEmail(
        data.email
      );
      if (existingUser) {
        logger.warn(
          `Company user registration failed - email already exists: ${data.email}`
        );
        return {
          success: false,
          error: 'Email already exists',
        };
      }

      // 企業アカウント存在チェック
      const companyAccount = await this.companyAccountRepository.findById(
        data.companyAccountId
      );
      if (!companyAccount) {
        logger.warn(`Company account not found: ${data.companyAccountId}`);
        return {
          success: false,
          error: 'Company account not found',
        };
      }

      // Supabase Authでユーザー登録
      const userData: UserRegistrationData = {
        email: data.email,
        password: data.password,
        metadata: {
          fullName: data.fullName,
          userType: 'company_user',
          companyAccountId: data.companyAccountId,
        },
      };

      const authResult = await registerUserWithSupabase(userData);
      if (!authResult.success) {
        logger.error(
          `Supabase registration failed for email: ${data.email}`,
          authResult.error
        );
        return {
          success: false,
          error: authResult.error || 'Registration failed',
        };
      }

      // パスワードハッシュ化
      const hashedPassword = await this.passwordService.hashPassword(
        data.password
      );

      // 企業ユーザーテーブルにデータ挿入
      const companyUserData: CreateCompanyUserData = {
        email: data.email,
        password_hash: hashedPassword,
        full_name: data.fullName,
        company_account_id: data.companyAccountId,
        position_title: data.positionTitle,
      };

      const companyUser =
        await this.companyUserRepository.create(companyUserData);
        
      // Supabaseのメタデータを更新してcompanyUserIdを追加
      if (authResult.user) {
        const supabase = getSupabaseAdminClient();
        await supabase.auth.admin.updateUserById(authResult.user.id, {
          user_metadata: {
            ...authResult.user.user_metadata,
            companyUserId: companyUser.id,
            companyAccountId: data.companyAccountId,
          }
        });
      }

      logger.info(`Company user registration successful: ${companyUser.email}`);

      return {
        success: true,
        user: {
          id: authResult.user!.id,
          email: authResult.user!.email!,
          userType: 'company_user',
          type: 'company_user',
          profile: {
            fullName: data.fullName,
            companyAccountId: data.companyAccountId,
          },
        },
        token: authResult.token,
      };
    } catch (error) {
      logger.error('Company user registration error:', error);
      return {
        success: false,
        error: 'Registration failed',
      };
    }
  }
}
