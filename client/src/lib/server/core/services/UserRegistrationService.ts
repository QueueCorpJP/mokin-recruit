import 'reflect-metadata';
import { injectable } from 'inversify';
import { logger } from '@/utils/logger';
import {
  registerUserWithSupabase,
  UserRegistrationData,
} from '@/auth/supabaseAuth';
import { CandidateRepository } from '@/infrastructure/database/CandidateRepository';
import {
  CompanyAccountRepository,
  CompanyUserRepository,
} from '@/infrastructure/database/CompanyUserRepository';
import { PasswordService } from './PasswordService';
import {
  AuthResult,
  CandidateRegistrationData,
  CompanyUserRegistrationData,
  IUserRegistrationService,
} from '@/core/interfaces/IAuthService';
import { CandidateEntity } from '@/core/interfaces/IDomainRepository';

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

      // データベースに候補者情報を保存
      const candidateData = {
        id: authResult.user!.id,
        email: data.email,
        passwordHash: hashedPassword,
        lastName: data.lastName,
        firstName: data.firstName,
        lastNameKana: data.lastNameKana || '',
        firstNameKana: data.firstNameKana || '',
        gender: data.gender || 'OTHER',
        status: 'ACTIVE',
        // デフォルト値
        currentResidence: '',
        birthDate: new Date(),
        phoneNumber: '',
        currentSalary: '',
        hasJobChangeExperience: false,
        desiredChangeTiming: '',
        jobSearchStatus: '',
        finalEducation: '',
        englishLevel: '',
        desiredSalary: '',
        emailNotificationSettings: {},
      };

      const candidate = await this.candidateRepository.create(candidateData);
      if (!candidate) {
        logger.error(
          `Failed to create candidate record for email: ${data.email}`
        );
        return {
          success: false,
          error: 'Failed to create candidate record',
        };
      }

      // レスポンス用の候補者情報を構築
      const candidateResponse = {
        id: (candidate as CandidateEntity).id,
        email: (candidate as CandidateEntity).email,
        profile: {
          lastName: (candidate as CandidateEntity).lastName,
          firstName: (candidate as CandidateEntity).firstName,
        },
      };

      logger.info(`Candidate registered successfully: ${data.email}`);
      return {
        success: true,
        user: candidateResponse,
      };
    } catch (error) {
      logger.error('Candidate registration error:', error);
      return {
        success: false,
        error: 'Registration service error',
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

      // データベースに企業ユーザー情報を保存
      const companyUserData = {
        id: authResult.user!.id,
        email: data.email,
        passwordHash: hashedPassword,
        fullName: data.fullName,
        companyAccountId: data.companyAccountId,
        emailNotificationSettings: {},
      };

      const companyUser =
        await this.companyUserRepository.create(companyUserData);
      if (!companyUser) {
        logger.error(
          `Failed to create company user record for email: ${data.email}`
        );
        return {
          success: false,
          error: 'Failed to create company user record',
        };
      }

      // レスポンス用の企業ユーザー情報を構築
      const companyUserResponse = {
        id: (companyUser as any).id,
        email: (companyUser as any).email,
        userType: 'company_user' as const,
        profile: {
          fullName: (companyUser as any).fullName,
          companyAccountId: (companyUser as any).companyAccountId,
        },
      };

      logger.info(`Company user registered successfully: ${data.email}`);
      return {
        success: true,
        user: companyUserResponse,
      };
    } catch (error) {
      logger.error('Company user registration error:', error);
      return {
        success: false,
        error: 'Registration service error',
      };
    }
  }
}
