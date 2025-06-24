import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { logger } from '@/utils/logger';
import {
  registerUserWithSupabase,
  signInWithSupabase,
  requestPasswordReset,
  updatePassword,
  signOutUser,
  verifySupabaseToken,
  verifyCustomJWT,
  UserRegistrationData,
} from '@/auth/supabaseAuth';
import { CandidateRepository } from '@/infrastructure/database/CandidateRepository';
import {
  CompanyUserRepository,
  CompanyAccountRepository,
} from '@/infrastructure/database/CompanyUserRepository';
import { SecurityConfig } from '@/config/security';

export class AuthController {
  private candidateRepository: CandidateRepository;
  private companyUserRepository: CompanyUserRepository;
  private companyAccountRepository: CompanyAccountRepository;
  private securityConfig: SecurityConfig;

  constructor() {
    this.candidateRepository = new CandidateRepository();
    this.companyUserRepository = new CompanyUserRepository();
    this.companyAccountRepository = new CompanyAccountRepository();
    this.securityConfig = new SecurityConfig();
  }
  /**
   * 候補者の新規登録（Supabase Auth統合）
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
      if (!email || !password || !lastName || !firstName) {
        res.status(400).json({
          error: 'Email, password, lastName, and firstName are required',
        });
        return;
      }

      // メールアドレス重複チェック
      const existingCandidate =
        await this.candidateRepository.findByEmail(email);

      if (existingCandidate) {
        res.status(409).json({ error: 'Email already exists' });
        return;
      }

      // Supabase Authでユーザー登録
      const userData: UserRegistrationData = {
        email,
        password,
        metadata: {
          firstName,
          lastName,
          userType: 'candidate',
        },
      };

      const authResult = await registerUserWithSupabase(userData);

      if (!authResult.success) {
        res.status(400).json({ error: authResult.error });
        return;
      }

      // Supabaseでデータベースに候補者情報を保存
      const hashedPassword = await bcrypt.hash(
        password,
        this.securityConfig.bcryptRounds
      );

      const candidateData = {
        id: authResult.user!.id, // Supabase Auth UIDを使用
        email,
        passwordHash: hashedPassword,
        lastName,
        firstName,
        lastNameKana: lastNameKana || '',
        firstNameKana: firstNameKana || '',
        gender: gender || 'OTHER',
        status: 'ACTIVE',
        // その他のフィールドはデフォルト値または後で更新
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
        res.status(500).json({ error: 'Failed to create candidate record' });
        return;
      }

      logger.info(`Candidate registered successfully: ${email}`);

      res.status(201).json({
        message: 'Candidate registered successfully',
        candidate: {
          id: candidate.id,
          email: candidate.email,
          lastName: candidate.lastName,
          firstName: candidate.firstName,
        },
      });
    } catch (error) {
      logger.error('Candidate registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * 企業ユーザーの新規登録（Supabase Auth統合）
   */
  async registerCompanyUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName, companyAccountId } = req.body;

      // バリデーション
      if (!email || !password || !fullName || !companyAccountId) {
        res.status(400).json({
          error: 'Email, password, fullName, and companyAccountId are required',
        });
        return;
      }

      // メールアドレス重複チェック
      const existingUser = await this.companyUserRepository.findByEmail(email);

      if (existingUser) {
        res.status(409).json({ error: 'Email already exists' });
        return;
      }

      // 企業アカウント存在チェック
      const companyAccount =
        await this.companyAccountRepository.findById(companyAccountId);

      if (!companyAccount) {
        res.status(404).json({ error: 'Company account not found' });
        return;
      }

      // Supabase Authでユーザー登録
      const userData: UserRegistrationData = {
        email,
        password,
        metadata: {
          fullName,
          userType: 'company_user',
          companyAccountId,
        },
      };

      const authResult = await registerUserWithSupabase(userData);

      if (!authResult.success) {
        res.status(400).json({ error: authResult.error });
        return;
      }

      // Supabaseでデータベースに企業ユーザー情報を保存
      const hashedPassword = await bcrypt.hash(
        password,
        this.securityConfig.bcryptRounds
      );

      const companyUserData = {
        id: authResult.user!.id, // Supabase Auth UIDを使用
        email,
        passwordHash: hashedPassword,
        fullName,
        companyAccountId,
        emailNotificationSettings: {},
      };

      const companyUser =
        await this.companyUserRepository.create(companyUserData);

      if (!companyUser) {
        res.status(500).json({ error: 'Failed to create company user record' });
        return;
      }

      logger.info(`Company user registered successfully: ${email}`);

      res.status(201).json({
        message: 'Company user registered successfully',
        user: {
          id: companyUser.id,
          email: companyUser.email,
          fullName: companyUser.fullName,
          companyAccountId: companyUser.companyAccountId,
        },
      });
    } catch (error) {
      logger.error('Company user registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * ログイン（Supabase Auth統合）
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // Supabase Authでログイン
      const authResult = await signInWithSupabase(email, password);

      if (!authResult.success) {
        res.status(401).json({ error: authResult.error });
        return;
      }

      // データベースからユーザー情報を取得
      let user = null;
      let userType = null;

      // 候補者として検索
      const candidate = await this.candidateRepository.findByEmail(email);

      if (candidate) {
        user = candidate;
        userType = 'candidate';
      } else {
        // 企業ユーザーとして検索
        const companyUser =
          await this.companyUserRepository.findByEmailWithCompany(email);

        if (companyUser) {
          user = companyUser;
          userType = 'company_user';
        }
      }

      if (!user) {
        res.status(404).json({ error: 'User not found in database' });
        return;
      }

      // 最終ログイン日時を更新
      if (userType === 'candidate') {
        await this.candidateRepository.updateLastLogin(user.id);
      } else if (userType === 'company_user') {
        await this.companyUserRepository.updateLastLogin(user.id);
      }

      logger.info(`User logged in successfully: ${email}`);

      res.status(200).json({
        message: 'Login successful',
        token: authResult.token,
        user: {
          id: user.id,
          email: user.email,
          type: userType,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * ログアウト
   */
  async logout(_req: Request, res: Response): Promise<void> {
    try {
      await signOutUser();

      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * トークンリフレッシュ
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        res.status(401).json({ error: 'Token not provided' });
        return;
      }

      // カスタムJWTトークンの検証
      const customJwtResult = verifyCustomJWT(token);
      if (customJwtResult.valid) {
        // 新しいトークンを生成
        const newToken = jwt.sign(
          customJwtResult.payload,
          this.securityConfig.jwtSecret
        );

        res.status(200).json({
          message: 'Token refreshed successfully',
          token: newToken,
        });
        return;
      }

      // Supabaseトークンの検証
      const supabaseResult = await verifySupabaseToken(token);
      if (!supabaseResult.success) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      res.status(200).json({
        message: 'Token is valid',
        user: supabaseResult.user,
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * パスワードリセット要求
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const result = await requestPasswordReset(email);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(200).json({
        message: 'Password reset email sent successfully',
      });
    } catch (error) {
      logger.error('Password reset request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * パスワードリセット
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        res.status(400).json({ error: 'Token and password are required' });
        return;
      }

      const result = await updatePassword(token, password);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(200).json({
        message: 'Password reset successfully',
      });
    } catch (error) {
      logger.error('Password reset error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
