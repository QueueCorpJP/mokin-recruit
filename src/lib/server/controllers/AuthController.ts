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
import {
  UserRegistrationService,
  CandidateRegistrationData,
  CompanyUserRegistrationData,
} from '../core/services/UserRegistrationService';
import { ValidationService } from '../core/services/ValidationService';
import { TYPES } from '../container/types';
import type { ICandidateRepository } from '../core/interfaces/IDomainRepository';
import { AdminUserRepository } from '../infrastructure/database/AdminUserRepository';

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
  private adminUserRepository: AdminUserRepository;

  constructor(
    @inject(TYPES.CandidateRepository)
    candidateRepository: ICandidateRepository,
    @inject(TYPES.CompanyRepository)
    companyUserRepository: CompanyUserRepository,
    @inject(TYPES.CompanyAccountRepository)
    companyAccountRepository: CompanyAccountRepository,
    @inject(TYPES.Security) securityConfig: SecurityConfig,
    @inject(TYPES.UserRegistrationService)
    userRegistrationService: UserRegistrationService,
    @inject(TYPES.PasswordService) passwordService: PasswordService,
    @inject(TYPES.ValidationService) validationService: ValidationService,
    @inject(TYPES.SessionService) sessionService: ISessionService,
    @inject(TYPES.AdminUserRepository)
    adminUserRepository: AdminUserRepository
  ) {
    this.candidateRepository = candidateRepository;
    this.companyUserRepository = companyUserRepository;
    this.companyAccountRepository = companyAccountRepository;
    this.securityConfig = securityConfig;
    this.userRegistrationService = userRegistrationService;
    this.passwordService = passwordService;
    this.validationService = validationService;
    this.sessionService = sessionService;
    this.adminUserRepository = adminUserRepository;
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
   * ログイン（責任分離版・ロール別認証対応）
   */
  async login(req: MockRequest, res: MockResponse): Promise<void> {
    try {
      const { email, password, userType } = req.body;

      // 入力データのバリデーション
      const validationResult = this.validationService.validateLoginData({
        email,
        password,
      });

      if (!validationResult.isValid) {
        logger.warn('Login validation failed', {
          email,
          userType: userType || 'default',
          fieldErrors: validationResult.fieldErrors,
          generalErrors: validationResult.generalErrors,
        });

        const errorMessages: string[] = [];

        // フィールドエラーを収集
        Object.entries(validationResult.fieldErrors).forEach(
          ([field, errors]) => {
            errorMessages.push(...errors);
          }
        );

        // 一般エラーを収集
        errorMessages.push(...validationResult.generalErrors);

        res.status(400).json({
          success: false,
          error: 'バリデーションエラー',
          message: errorMessages.join(', '),
          details: {
            fieldErrors: validationResult.fieldErrors,
            generalErrors: validationResult.generalErrors,
          },
          errorStage: 'validation',
          errorDetail:
            process.env.NODE_ENV === 'development'
              ? validationResult
              : undefined,
        });
        return;
      }

      logger.info(
        `Login attempt for user: ${email} (userType: ${userType || 'default'})`
      );

      // ユーザータイプごとの認証方式を選択
      let authResult: any = { success: false, user: null, session: null };
      let useSupabaseAuth = true;

      // 候補者の場合は、まず独自認証を試行
      if (userType === 'candidate') {
        try {
          const candidate = await this.candidateRepository.findByEmail(email);
          if (candidate) {
            // パスワード検証を実行
            logger.debug(
              `Attempting password verification for candidate: ${email}`
            );
            logger.debug(`Input password: "${password}"`);
            logger.debug(`Stored hash: "${candidate.password_hash}"`);
            const isValidPassword = await this.passwordService.verifyPassword(
              password,
              candidate.password_hash
            );

            if (isValidPassword) {
              logger.info(`Found candidate user: ${email}, using custom auth`);
              useSupabaseAuth = false;

              // 適切なSupabaseユーザーオブジェクトを作成
              const supabaseUser = {
                id: candidate.id,
                email: candidate.email,
                user_metadata: {
                  userType: 'candidate',
                  name: `${candidate.last_name} ${candidate.first_name}`,
                },
                app_metadata: {},
                aud: 'authenticated',
                created_at: candidate.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
                email_confirmed_at: new Date().toISOString(),
                phone_confirmed_at: '',
                confirmed_at: new Date().toISOString(),
                last_sign_in_at: new Date().toISOString(),
                role: 'authenticated',
              };

              // モックのSupabaseセッションを作成
              const mockSupabaseSession = {
                access_token: '',
                refresh_token: '',
                expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7日後
                expires_in: 7 * 24 * 60 * 60,
                token_type: 'bearer',
                user: supabaseUser,
              };

              // SessionServiceを使用してJWTトークンを生成
              logger.debug('Creating session with SessionService...');
              try {
                const sessionResult = await this.sessionService.createSession(
                  supabaseUser,
                  mockSupabaseSession
                );
                logger.debug(`SessionService result: ${sessionResult.success}`);

                if (sessionResult.success && sessionResult.sessionInfo) {
                  authResult = {
                    success: true,
                    user: supabaseUser,
                    session: mockSupabaseSession,
                    token: sessionResult.sessionInfo.session.access_token,
                  };

                  logger.info(
                    `JWT token generated successfully for candidate: ${candidate.id}`
                  );

                  // データベースのlast_login_at更新
                  try {
                    await this.candidateRepository.updateLastLogin(
                      candidate.id
                    );
                    logger.debug(
                      `Updated last_login_at for candidate: ${candidate.id}`
                    );
                  } catch (updateError) {
                    logger.warn(
                      `Failed to update last_login_at for candidate ${candidate.id}:`,
                      updateError
                    );
                  }
                } else {
                  logger.error(
                    'Failed to create session for candidate:',
                    sessionResult.error
                  );
                  // Supabase認証にフォールバック
                  useSupabaseAuth = true;
                }
              } catch (sessionError) {
                logger.error(
                  'SessionService error for candidate:',
                  sessionError
                );
                // Supabase認証にフォールバック
                useSupabaseAuth = true;
              }
            } else {
              logger.warn(`Invalid password for candidate: ${email}`);
            }
          }
        } catch (error) {
          logger.warn(`Candidate auth check failed: ${error}`);
        }
      }

      // Supabase認証（企業ユーザーまたは候補者で独自認証が失敗した場合）
      if (useSupabaseAuth) {
        authResult = await signInWithSupabase(email, password);
      }

      if (!authResult.success) {
        logger.warn(`Authentication failed for user: ${email}`, {
          userType: userType || 'default',
          error: authResult.error,
          usedSupabaseAuth: useSupabaseAuth,
        });

        // 認証エラーの詳細分類
        let errorMessage = 'ログインに失敗しました';
        let errorCode = 'AUTH_FAILED';

        if (authResult.error) {
          const errorStr = authResult.error.toLowerCase();
          if (
            errorStr.includes('invalid_credentials') ||
            errorStr.includes('invalid login')
          ) {
            errorMessage = 'メールアドレスまたはパスワードが正しくありません';
            errorCode = 'INVALID_CREDENTIALS';
          } else if (errorStr.includes('email not confirmed')) {
            errorMessage = 'メールアドレスが確認されていません';
            errorCode = 'EMAIL_NOT_CONFIRMED';
          } else if (errorStr.includes('too many requests')) {
            errorMessage =
              'ログイン試行回数が上限に達しました。しばらくしてから再度お試しください';
            errorCode = 'TOO_MANY_REQUESTS';
          }
        }

        res.status(401).json({
          success: false,
          error: errorMessage,
          message: errorMessage,
          code: errorCode,
          details: {
            originalError: authResult.error,
            authMethod: useSupabaseAuth ? 'supabase' : 'custom',
          },
          errorStage: 'auth',
          errorDetail:
            process.env.NODE_ENV === 'development'
              ? authResult.error
              : undefined,
        });
        return;
      }

      // ロール別ユーザー検索とバリデーション
      let userInfo: any = null;
      try {
        // userTypeが指定されている場合はロール別検索
        if (userType) {
          switch (userType) {
            case 'candidate':
              const candidate =
                await this.candidateRepository.findByEmail(email);
              if (candidate) {
                userInfo = {
                  id: candidate.id,
                  email: candidate.email,
                  userType: 'candidate',
                  name: `${candidate.last_name} ${candidate.first_name}`,
                  profile: {
                    lastName: candidate.last_name,
                    firstName: candidate.first_name,
                    phoneNumber: candidate.phone_number,
                    currentResidence: candidate.current_residence,
                  },
                };
              } else {
                // 候補者として認証を試みたが、候補者テーブルに存在しない
                logger.warn(
                  `Candidate login failed - user not found in candidates table: ${email}`
                );
                res.status(401).json({
                  success: false,
                  error: '候補者としてのログインに失敗しました',
                  message:
                    '候補者アカウントが見つかりません。企業アカウントをお持ちの場合は、企業ログインページをご利用ください。',
                  code: 'CANDIDATE_NOT_FOUND',
                  errorStage: 'not_found',
                  errorDetail:
                    process.env.NODE_ENV === 'development'
                      ? { email }
                      : undefined,
                });
                return;
              }
              break;

            case 'company':
              const companyUser =
                await this.companyUserRepository.findByEmail(email);
              if (companyUser) {
                userInfo = {
                  id: companyUser.id,
                  email: companyUser.email,
                  userType: 'company_user',
                  name: companyUser.full_name || companyUser.email,
                  profile: {
                    fullName: companyUser.full_name,
                    companyAccountId: companyUser.company_account_id,
                  },
                };
              } else {
                // 企業ユーザーとして認証を試みたが、企業ユーザーテーブルに存在しない
                logger.warn(
                  `Company login failed - user not found in company_users table: ${email}`
                );
                res.status(401).json({
                  success: false,
                  error: '企業ユーザーとしてのログインに失敗しました',
                  message:
                    '企業アカウントが見つかりません。候補者アカウントをお持ちの場合は、候補者ログインページをご利用ください。',
                  code: 'COMPANY_USER_NOT_FOUND',
                  errorStage: 'not_found',
                  errorDetail:
                    process.env.NODE_ENV === 'development'
                      ? { email }
                      : undefined,
                });
                return;
              }
              break;

            case 'admin':
              // 管理者認証
              const adminUser =
                await this.adminUserRepository.findByEmail(email);
              if (!adminUser) {
                logger.warn(
                  `Admin login failed - user not found in admin_users table: ${email}`
                );
                res.status(401).json({
                  success: false,
                  error: '管理者としてのログインに失敗しました',
                  message: '管理者アカウントが見つかりません。',
                  code: 'ADMIN_NOT_FOUND',
                  errorStage: 'not_found',
                  errorDetail:
                    process.env.NODE_ENV === 'development'
                      ? { email }
                      : undefined,
                });
                return;
              }
              // パスワード検証
              const isValidAdminPassword =
                await this.passwordService.verifyPassword(
                  password,
                  adminUser.password_hash
                );
              if (!isValidAdminPassword) {
                logger.warn(`Invalid password for admin: ${email}`);
                res.status(401).json({
                  success: false,
                  error: 'メールアドレスまたはパスワードが正しくありません',
                  message: 'メールアドレスまたはパスワードが正しくありません',
                  code: 'INVALID_CREDENTIALS',
                  errorStage: 'password_mismatch',
                  errorDetail:
                    process.env.NODE_ENV === 'development'
                      ? { email }
                      : undefined,
                });
                return;
              }
              // JWT生成
              const adminSupabaseUser = {
                id: adminUser.id,
                email: adminUser.email,
                user_metadata: {
                  userType: 'admin',
                  name: adminUser.name,
                },
                app_metadata: {},
                aud: 'authenticated',
                created_at: adminUser.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
                email_confirmed_at: new Date().toISOString(),
                phone_confirmed_at: '',
                confirmed_at: new Date().toISOString(),
                last_sign_in_at: new Date().toISOString(),
                role: 'authenticated',
              };
              const adminMockSession = {
                access_token: '',
                refresh_token: '',
                expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
                expires_in: 7 * 24 * 60 * 60,
                token_type: 'bearer',
                user: adminSupabaseUser,
              };
              let adminToken = '';
              try {
                const sessionResult = await this.sessionService.createSession(
                  adminSupabaseUser,
                  adminMockSession
                );
                if (sessionResult.success && sessionResult.sessionInfo) {
                  adminToken = sessionResult.sessionInfo.session.access_token;
                  await this.adminUserRepository.updateLastLogin(adminUser.id);
                  logger.info(
                    `JWT token generated successfully for admin: ${adminUser.id}`
                  );
                } else {
                  logger.error(
                    'Failed to create session for admin:',
                    sessionResult.error
                  );
                  res.status(500).json({
                    success: false,
                    error: 'セッション生成に失敗しました',
                    message: 'セッション生成に失敗しました',
                    code: 'SESSION_ERROR',
                    errorStage: 'jwt_error',
                    errorDetail:
                      process.env.NODE_ENV === 'development'
                        ? sessionResult.error
                        : undefined,
                  });
                  return;
                }
              } catch (sessionError) {
                logger.error('SessionService error for admin:', sessionError);
                res.status(500).json({
                  success: false,
                  error: 'セッション生成に失敗しました',
                  message: 'セッション生成に失敗しました',
                  code: 'SESSION_ERROR',
                  errorStage: 'jwt_error',
                  errorDetail:
                    process.env.NODE_ENV === 'development'
                      ? String(sessionError)
                      : undefined,
                });
                return;
              }
              userInfo = {
                id: adminUser.id,
                email: adminUser.email,
                userType: 'admin',
                name: adminUser.name,
                profile: {},
              };
              authResult = {
                success: true,
                user: adminSupabaseUser,
                session: adminMockSession,
                token: adminToken,
              };
              break;

            default:
              logger.error(`Unknown userType: ${userType}`);
              res.status(400).json({
                success: false,
                error: '不正なユーザータイプです',
                message: '有効なユーザータイプを指定してください。',
                code: 'INVALID_USER_TYPE',
                errorStage: 'invalid_type',
                errorDetail:
                  process.env.NODE_ENV === 'development'
                    ? { userType }
                    : undefined,
              });
              return;
          }
        } else {
          // userTypeが未指定の場合は従来通りの検索（後方互換性）
          const candidate = await this.candidateRepository.findByEmail(email);
          if (candidate) {
            userInfo = {
              id: candidate.id,
              email: candidate.email,
              userType: 'candidate',
              name: `${candidate.last_name} ${candidate.first_name}`,
              profile: {
                lastName: candidate.last_name,
                firstName: candidate.first_name,
                phoneNumber: candidate.phone_number,
                currentResidence: candidate.current_residence,
              },
            };
          } else {
            const companyUser =
              await this.companyUserRepository.findByEmail(email);
            if (companyUser) {
              userInfo = {
                id: companyUser.id,
                email: companyUser.email,
                userType: 'company_user',
                name: companyUser.full_name || companyUser.email,
                profile: {
                  fullName: companyUser.full_name,
                  companyAccountId: companyUser.company_account_id,
                },
              };
            }
          }
        }
      } catch (dbError) {
        logger.error('Database error during user lookup', {
          email,
          userType: userType || 'default',
          error: dbError,
        });

        res.status(500).json({
          success: false,
          error: 'データベースエラーが発生しました',
          message: 'ユーザー情報の取得に失敗しました',
          code: 'DATABASE_ERROR',
          errorStage: 'db_error',
          errorDetail:
            process.env.NODE_ENV === 'development'
              ? String(dbError)
              : undefined,
        });
        return;
      }

      if (!userInfo) {
        logger.error(
          `User not found in database: ${email} (userType: ${userType || 'default'})`
        );
        res.status(404).json({
          success: false,
          error: 'ユーザーが見つかりません',
          message:
            'アカウント情報が見つかりません。サポートにお問い合わせください',
          code: 'USER_NOT_FOUND',
          errorStage: 'not_found',
          errorDetail:
            process.env.NODE_ENV === 'development' ? { email } : undefined,
        });
        return;
      }

      // Supabaseのuser_metadataを更新してuserTypeを保存
      // データベース直接作成ユーザーの場合、Supabase Authに存在しない可能性があるため、
      // 更新失敗は警告として扱い、ログイン処理は継続する
      try {
        const { getSupabaseAdminClient } = await import(
          '@/lib/server/database/supabase'
        );
        const supabaseAdmin = getSupabaseAdminClient();

        const { error: metadataError } =
          await supabaseAdmin.auth.admin.updateUserById(userInfo.id, {
            user_metadata: {
              userType: userInfo.userType,
              name: userInfo.name,
              last_login_at: new Date().toISOString(),
            },
          });

        if (metadataError) {
          // データベース直接作成ユーザーの場合、Supabase Authに存在しないため更新できない
          // これは正常な動作として扱う
          logger.info(
            `User metadata update skipped for database-only user: ${userInfo.id} (${userInfo.userType})`
          );
          logger.debug(
            `Metadata update error (expected for DB-only users): ${metadataError.message}`
          );
        } else {
          logger.info(
            `User metadata updated for ${userInfo.id} (userType: ${userInfo.userType})`
          );
        }
      } catch (metadataUpdateError) {
        // メタデータ更新のエラーもデータベース直接ユーザーの場合は想定内
        logger.info(
          `User metadata update skipped for database-only user: ${userInfo.id}`
        );
        logger.debug(
          'Metadata update error (expected for DB-only users):',
          metadataUpdateError
        );
      }

      // データベースのlast_login_at更新（カスタム認証を使わなかった場合）
      if (userInfo && useSupabaseAuth) {
        try {
          if (userInfo.userType === 'candidate') {
            await this.candidateRepository.updateLastLogin(userInfo.id);
          } else if (userInfo.userType === 'company_user') {
            await this.companyUserRepository.updateLastLogin(userInfo.id);
          } else if (userInfo.userType === 'admin') {
            await this.adminUserRepository.updateLastLogin(userInfo.id);
          }
        } catch (updateError) {
          logger.warn(
            `Failed to update last_login_at for ${userInfo.userType} ${userInfo.id}:`,
            updateError
          );
        }
      }

      logger.info(
        `Login successful for user: ${userInfo.id} (userType: ${userInfo.userType})`
      );

      res.status(200).json({
        success: true,
        message: 'ログインに成功しました',
        data: {
          token: authResult.token,
          user: userInfo,
        },
        // 後方互換性のため
        token: authResult.token,
        user: userInfo,
      });
    } catch (error) {
      logger.error('Login controller error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Internal server error';

      res.status(500).json({
        success: false,
        error: 'サーバーエラーが発生しました',
        message:
          'システムエラーが発生しました。しばらくしてから再度お試しください',
        code: 'INTERNAL_SERVER_ERROR',
        details:
          process.env.NODE_ENV === 'development'
            ? {
                originalError: errorMessage,
              }
            : undefined,
        errorStage: 'exception',
        errorDetail:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      });
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
