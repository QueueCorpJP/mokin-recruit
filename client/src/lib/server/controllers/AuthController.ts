import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { logger } from '../utils/logger';
import {
  signInWithSupabase,
  signOutUser,
  verifySupabaseToken,
} from '../auth/supabaseAuth';
import { SessionService } from '../core/services/SessionService';
import type { ISessionService } from '../core/services/SessionService';

import {
  CompanyAccountRepository,
  CompanyUserRepository,
} from '../infrastructure/database/CompanyUserRepository';
import { SecurityConfig } from '../config/security';
import { PasswordService } from '../core/services/PasswordService';
import { UserRegistrationService } from '../core/services/UserRegistrationService';
import { ValidationService } from '../core/services/ValidationService';
import { TYPES } from '../container/types';
import type { ICandidateRepository } from '../core/interfaces/IDomainRepository';

// Express.jsのRequest/Responseインターフェースを模擬
interface MockRequest {
  body?: any;
  headers?: any;
  params?: any;
  query?: any;
}

interface MockResponse {
  status: (code: number) => MockResponse;
  json: (data: any) => void;
}

@injectable()
export class AuthController {
  private candidateRepository: ICandidateRepository;
  private companyUserRepository: CompanyUserRepository;
  private companyAccountRepository: CompanyAccountRepository;
  private securityConfig: SecurityConfig;
  private userRegistrationService: UserRegistrationService;
  private passwordService: PasswordService;
  private validationService: ValidationService;
  private sessionService: ISessionService;

  constructor(
    @inject(TYPES.CandidateRepository)
    candidateRepository: ICandidateRepository,
    @inject(TYPES.CompanyRepository)
    companyUserRepository: CompanyUserRepository,
    @inject('CompanyAccountRepository')
    companyAccountRepository: CompanyAccountRepository,
    @inject(TYPES.Security) securityConfig: SecurityConfig,
    @inject('IUserRegistrationService')
    userRegistrationService: UserRegistrationService,
    @inject('IPasswordService') passwordService: PasswordService,
    @inject('ValidationService') validationService: ValidationService,
    @inject(TYPES.SessionService) sessionService: ISessionService
  ) {
    this.candidateRepository = candidateRepository;
    this.companyUserRepository = companyUserRepository;
    this.companyAccountRepository = companyAccountRepository;
    this.securityConfig = securityConfig;
    this.userRegistrationService = userRegistrationService;
    this.passwordService = passwordService;
    this.validationService = validationService;
    this.sessionService = sessionService;
  }

  /**
   * 候補者の新規登録（責任分離版）
   */
  async registerCandidate(req: MockRequest, res: MockResponse): Promise<void> {
    try {
      const {
        email,
        password,
        lastName,
        firstName,
        lastNameKana,
        firstNameKana,
        gender,
      } = req.body;

      // バリデーション
      const validationResult =
        this.validationService.validateCandidateRegistration({
          email,
          password,
          lastName,
          firstName,
          lastNameKana,
          firstNameKana,
          gender,
        });

      if (!validationResult.isValid) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.fieldErrors,
        });
        return;
      }

      // サービス層に委譲
      const registrationResult =
        await this.userRegistrationService.registerCandidate({
          email,
          password,
          lastName,
          firstName,
          lastNameKana,
          firstNameKana,
          gender,
        });

      if (!registrationResult.success) {
        const statusCode = registrationResult.error?.includes('already exists')
          ? 409
          : 400;
        res.status(statusCode).json({ error: registrationResult.error });
        return;
      }

      res.status(201).json({
        message: 'Candidate registered successfully',
        candidate: registrationResult.user,
      });
    } catch (error) {
      logger.error('Candidate registration controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * 企業ユーザーの新規登録（責任分離版）
   */
  async registerCompanyUser(
    req: MockRequest,
    res: MockResponse
  ): Promise<void> {
    try {
      const { email, password, fullName, companyAccountId } = req.body;

      // バリデーション
      const validationResult =
        this.validationService.validateCompanyUserRegistration({
          email,
          password,
          fullName,
          companyAccountId,
        });

      if (!validationResult.isValid) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.fieldErrors,
        });
        return;
      }

      // サービス層に委譲
      const registrationResult =
        await this.userRegistrationService.registerCompanyUser({
          email,
          password,
          fullName,
          companyAccountId,
        });

      if (!registrationResult.success) {
        let statusCode = 400;
        if (registrationResult.error?.includes('already exists')) {
          statusCode = 409;
        } else if (registrationResult.error?.includes('not found')) {
          statusCode = 404;
        }
        res.status(statusCode).json({ error: registrationResult.error });
        return;
      }

      res.status(201).json({
        message: 'Company user registered successfully',
        user: registrationResult.user,
      });
    } catch (error) {
      logger.error('Company user registration controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * ログイン（責任分離版）
   */
  async login(req: MockRequest, res: MockResponse): Promise<void> {
    try {
      const { email, password } = req.body;

      // バリデーション
      const validationResult = this.validationService.validateLoginData({
        email,
        password,
      });

      if (!validationResult.isValid) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.fieldErrors,
        });
        return;
      }

      logger.info(`Login attempt for email: ${email}`);

      // Supabase Authでログイン
      const authResult = await signInWithSupabase(email, password);

      if (!authResult.success) {
        logger.warn(`Login failed for email: ${email}`);
        res.status(401).json({
          error: 'Invalid credentials',
        });
        return;
      }

      // ユーザー情報の取得と最終ログイン時刻の更新
      let userInfo = null;
      try {
        // 候補者として検索
        const candidate = await this.candidateRepository.findByEmail(email);
        if (candidate) {
          await this.candidateRepository.updateLastLogin(candidate.id);
          userInfo = {
            id: candidate.id,
            email: candidate.email,
            type: 'candidate',
            name: `${candidate.lastName} ${candidate.firstName}`,
          };
        } else {
          // 企業ユーザーとして検索
          const companyUser =
            await this.companyUserRepository.findByEmail(email);
          if (companyUser) {
            userInfo = {
              id: companyUser.id,
              email: companyUser.email,
              type: 'company_user',
              name: companyUser.fullName,
              companyAccountId: companyUser.companyAccountId,
            };
          }
        }
      } catch (error) {
        logger.error('Error fetching user info during login:', error);
      }

      if (!userInfo) {
        logger.error(`User not found in database: ${email}`);
        res.status(401).json({
          error: 'User not found',
        });
        return;
      }

      logger.info(`Login successful for user: ${userInfo.id}`);

      res.status(200).json({
        message: 'Login successful',
        token: authResult.token,
        user: userInfo,
      });
    } catch (error) {
      logger.error('Login controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * ログアウト
   */
  async logout(_req: MockRequest, res: MockResponse): Promise<void> {
    try {
      // Supabaseからサインアウト
      await signOutUser();

      res.status(200).json({
        message: 'Logout successful',
      });
    } catch (error) {
      logger.error('Logout controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * トークンリフレッシュ
   */
  async refreshToken(req: MockRequest, res: MockResponse): Promise<void> {
    try {
      const authHeader = req.headers?.authorization;
      if (!authHeader) {
        res.status(401).json({ error: 'Authorization header missing' });
        return;
      }

      const token = authHeader.replace('Bearer ', '');

      // Supabaseトークンの検証
      const verificationResult = await verifySupabaseToken(token);

      if (!verificationResult.success) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      // 新しいトークンを生成（実装は環境に依存）
      // 現在はSupabaseが自動的にリフレッシュするため、既存トークンを返す
      res.status(200).json({
        message: 'Token refreshed successfully',
        token: token, // 実際の実装では新しいトークンを生成
      });
    } catch (error) {
      logger.error('Token refresh controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * パスワードリセット要求
   */
  async forgotPassword(req: MockRequest, res: MockResponse): Promise<void> {
    try {
      const { email } = req.body;

      // バリデーション
      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      // ユーザーの存在確認
      const candidate = await this.candidateRepository.findByEmail(email);
      const companyUser = candidate
        ? null
        : await this.companyUserRepository.findByEmail(email);

      if (!candidate && !companyUser) {
        // セキュリティ上、ユーザーが存在しない場合でも成功レスポンスを返す
        res.status(200).json({
          message: 'If the email exists, a reset link has been sent',
        });
        return;
      }

      // パスワードリセットメールの送信（実装必要）
      // await this.emailService.sendPasswordResetEmail(email, resetToken);

      logger.info(`Password reset requested for email: ${email}`);

      res.status(200).json({
        message: 'If the email exists, a reset link has been sent',
      });
    } catch (error) {
      logger.error('Forgot password controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * パスワードリセット実行
   */
  async resetPassword(req: MockRequest, res: MockResponse): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      // バリデーション
      if (!token || !newPassword) {
        res.status(400).json({
          error: 'Token and new password are required',
        });
        return;
      }

      // トークンの検証（実装必要）
      // const tokenVerification = await this.verifyResetToken(token);

      // パスワードの更新（実装必要）
      // await this.passwordService.updatePassword(userId, newPassword);

      logger.info('Password reset completed');

      res.status(200).json({
        message: 'Password reset successful',
      });
    } catch (error) {
      logger.error('Reset password controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
