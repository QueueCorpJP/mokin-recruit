import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { logger } from '@/utils/logger';
import {
  signInWithSupabase,
  signOutUser,
  verifyCustomJWT,
  verifySupabaseToken,
} from '@/auth/supabaseAuth';
import { CandidateRepository } from '@/infrastructure/database/CandidateRepository';
import {
  CompanyAccountRepository,
  CompanyUserRepository,
} from '@/infrastructure/database/CompanyUserRepository';
import { SecurityConfig } from '@/config/security';
import { PasswordService } from '@/core/services/PasswordService';
import { UserRegistrationService } from '@/core/services/UserRegistrationService';
import { ValidationService } from '@/core/services/ValidationService';

export class AuthController {
  private candidateRepository: CandidateRepository;
  private companyUserRepository: CompanyUserRepository;
  private companyAccountRepository: CompanyAccountRepository;
  private securityConfig: SecurityConfig;
  private userRegistrationService: UserRegistrationService;
  private passwordService: PasswordService;
  private validationService: ValidationService;

  constructor() {
    this.candidateRepository = new CandidateRepository();
    this.companyUserRepository = new CompanyUserRepository();
    this.companyAccountRepository = new CompanyAccountRepository();
    this.securityConfig = new SecurityConfig();
    this.userRegistrationService = new UserRegistrationService();
    this.passwordService = new PasswordService();
    this.validationService = new ValidationService();
  }

  /**
   * 候補者の新規登録（責任分離版）
   */
  async registerCandidate(req: Request, res: Response): Promise<void> {
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
  async registerCompanyUser(req: Request, res: Response): Promise<void> {
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
  async login(req: Request, res: Response): Promise<void> {
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
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // ユーザーの種類を判定し、最終ログイン時刻を更新
      const candidate = await this.candidateRepository.findByEmail(email);
      if (candidate) {
        await this.candidateRepository.updateLastLogin(candidate.id);
        logger.info(`Candidate login successful: ${email}`);

        res.json({
          message: 'Login successful',
          token: authResult.token,
          user: {
            id: candidate.id,
            email: candidate.email,
            type: 'candidate',
            profile: {
              lastName: candidate.lastName,
              firstName: candidate.firstName,
            },
          },
        });
        return;
      }

      const companyUser = await this.companyUserRepository.findByEmail(email);
      if (companyUser) {
        await this.companyUserRepository.updateLastLogin(companyUser.id);
        logger.info(`Company user login successful: ${email}`);

        res.json({
          message: 'Login successful',
          token: authResult.token,
          user: {
            id: companyUser.id,
            email: companyUser.email,
            type: 'company_user',
            profile: {
              fullName: companyUser.fullName,
              companyAccountId: companyUser.companyAccountId,
            },
          },
        });
        return;
      }

      logger.warn(`User not found in database: ${email}`);
      res.status(404).json({ error: 'User not found' });
    } catch (error) {
      logger.error('Login controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * ログアウト
   */
  async logout(_req: Request, res: Response): Promise<void> {
    try {
      await signOutUser();
      logger.info('User logged out successfully');
      res.json({ message: 'Logout successful' });
    } catch (error) {
      logger.error('Logout controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * トークンリフレッシュ
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token is required' });
        return;
      }

      // カスタムJWTトークンの検証
      const customJwtResult = verifyCustomJWT(refreshToken);
      if (customJwtResult.valid) {
        const newToken = jwt.sign(
          customJwtResult.payload,
          this.securityConfig.jwtSecret
        );

        res.json({
          message: 'Token refreshed successfully',
          token: newToken,
        });
        return;
      }

      // Supabaseトークンの検証
      const supabaseResult = await verifySupabaseToken(refreshToken);
      if (!supabaseResult.success) {
        res.status(401).json({ error: 'Invalid refresh token' });
        return;
      }

      res.json({
        message: 'Token refreshed successfully',
        user: supabaseResult.user,
      });
    } catch (error) {
      logger.error('Token refresh controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * パスワードリセット要求（責任分離版）
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const emailValidation = this.validationService.validateEmail(email);
      if (!emailValidation.isValid) {
        res.status(400).json({ error: emailValidation.errors.join(', ') });
        return;
      }

      const result = await this.passwordService.requestPasswordReset(email);

      if (result) {
        res.json({ message: 'Password reset email sent' });
      } else {
        res.status(400).json({ error: 'Failed to send password reset email' });
      }
    } catch (error) {
      logger.error('Password reset request controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * パスワードリセット実行（責任分離版）
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({ error: 'Token and new password are required' });
        return;
      }

      // パスワード強度チェック
      const passwordValidation =
        this.passwordService.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          error: 'Password validation failed',
          details: passwordValidation.errors,
        });
        return;
      }

      const result = await this.passwordService.resetPassword(
        token,
        newPassword
      );

      if (result) {
        res.json({ message: 'Password reset successful' });
      } else {
        res.status(400).json({ error: 'Password reset failed' });
      }
    } catch (error) {
      logger.error('Password reset controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
