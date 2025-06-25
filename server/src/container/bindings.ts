import 'reflect-metadata';
import { Container } from 'inversify';
import { SupabaseClient } from '@supabase/supabase-js';
import * as process from 'process';

import { TYPES } from './types';
import { logger } from '@/utils/logger';

// Config
import { AppConfig } from '@/config/app';
import { DatabaseConfig } from '@/config/database';
import { SecurityConfig } from '@/config/security';

// Database
import { getSupabaseAdminClient } from '@/database/supabase';

// Repositories
import { CandidateRepository } from '@/infrastructure/database/CandidateRepository';
import {
  CompanyAccountRepository,
  CompanyUserRepository,
} from '@/infrastructure/database/CompanyUserRepository';

// Services
import { PasswordService } from '@/core/services/PasswordService';
import { UserRegistrationService } from '@/core/services/UserRegistrationService';
import { ValidationService } from '@/core/services/ValidationService';

// Controllers
import { AuthController } from '@/controllers/AuthController';

// Interfaces
import {
  IPasswordService,
  IUserRegistrationService,
} from '@/core/interfaces/IAuthService';
import { ICandidateRepository } from '@/core/interfaces/IDomainRepository';

/**
 * DIコンテナのバインディング設定クラス
 * 依存性の登録とライフサイクル管理を担当
 */
export class ContainerBindings {
  /**
   * すべての依存性をコンテナにバインド
   */
  public static bindAll(container: Container): void {
    logger.info('Starting dependency bindings...');

    try {
      // 設定関連のバインディング
      this.bindConfigurations(container);

      // インフラストラクチャ関連のバインディング
      this.bindInfrastructure(container);

      // リポジトリ関連のバインディング
      this.bindRepositories(container);

      // サービス関連のバインディング
      this.bindServices(container);

      // コントローラー関連のバインディング
      this.bindControllers(container);

      // 外部サービス関連のバインディング
      this.bindExternalServices(container);

      logger.info('All dependencies bound successfully');

      // バインディング統計を出力
      this.logBindingStats(container);
    } catch (error) {
      logger.error('Failed to bind dependencies:', error);
      throw new Error('Dependency binding failed');
    }
  }

  /**
   * 設定関連の依存性をバインド
   */
  private static bindConfigurations(container: Container): void {
    logger.debug('Binding configurations...');

    // アプリケーション設定
    container.bind<AppConfig>(TYPES.Config).to(AppConfig).inSingletonScope();

    // データベース設定
    container
      .bind<DatabaseConfig>(TYPES.DatabaseClient)
      .to(DatabaseConfig)
      .inSingletonScope();

    // セキュリティ設定
    container
      .bind<SecurityConfig>(TYPES.Security)
      .to(SecurityConfig)
      .inSingletonScope();

    logger.debug('Configurations bound successfully');
  }

  /**
   * インフラストラクチャ関連の依存性をバインド
   */
  private static bindInfrastructure(container: Container): void {
    logger.debug('Binding infrastructure...');

    // Logger (既存のloggerインスタンスを使用)
    container.bind(TYPES.Logger).toConstantValue(logger);

    logger.debug('Infrastructure bound successfully');
  }

  /**
   * リポジトリ関連の依存性をバインド
   */
  private static bindRepositories(container: Container): void {
    logger.debug('Binding repositories...');

    // 候補者リポジトリ
    container
      .bind<ICandidateRepository>(TYPES.CandidateRepository)
      .to(CandidateRepository)
      .inSingletonScope();

    // 企業ユーザーリポジトリ
    container
      .bind<CompanyUserRepository>(TYPES.CompanyRepository)
      .to(CompanyUserRepository)
      .inSingletonScope();

    // 企業アカウントリポジトリ
    container
      .bind<CompanyAccountRepository>('CompanyAccountRepository')
      .to(CompanyAccountRepository)
      .inSingletonScope();

    logger.debug('Repositories bound successfully');
  }

  /**
   * サービス関連の依存性をバインド
   */
  private static bindServices(container: Container): void {
    logger.debug('Binding services...');

    // パスワードサービス
    container
      .bind<IPasswordService>('IPasswordService')
      .to(PasswordService)
      .inSingletonScope();

    // ユーザー登録サービス
    container
      .bind<IUserRegistrationService>('IUserRegistrationService')
      .to(UserRegistrationService)
      .inSingletonScope();

    // バリデーションサービス
    container
      .bind<ValidationService>('ValidationService')
      .to(ValidationService)
      .inSingletonScope();

    // 認証サービス（将来実装予定）
    // container.bind<IAuthService>(TYPES.AuthService)
    //   .to(AuthService)
    //   .inSingletonScope();

    logger.debug('Services bound successfully');
  }

  /**
   * コントローラー関連の依存性をバインド
   */
  private static bindControllers(container: Container): void {
    logger.debug('Binding controllers...');

    // 認証コントローラー
    container
      .bind<AuthController>('AuthController')
      .to(AuthController)
      .inSingletonScope();

    logger.debug('Controllers bound successfully');
  }

  /**
   * 外部サービス関連の依存性をバインド
   */
  private static bindExternalServices(container: Container): void {
    logger.debug('Binding external services...');

    // Supabaseクライアント
    container
      .bind<SupabaseClient>(TYPES.SupabaseClient)
      .toConstantValue(getSupabaseAdminClient());

    // ストレージサービス（将来実装予定）
    // container.bind<IStorageService>(TYPES.Storage)
    //   .to(SupabaseStorageService)
    //   .inSingletonScope();

    // メールサービス（将来実装予定）
    // container.bind<IEmailService>(TYPES.EmailService)
    //   .to(EmailService)
    //   .inSingletonScope();

    logger.debug('External services bound successfully');
  }

  /**
   * バインディング統計をログ出力
   */
  private static logBindingStats(container: Container): void {
    try {
      const bindings = (container as any)._bindingDictionary;
      if (bindings && typeof bindings.getMap === 'function') {
        const bindingMap = bindings.getMap();
        const serviceCount = bindingMap.size;

        logger.info(`Total services bound: ${serviceCount}`);

        // デバッグモードの場合、詳細な一覧を出力
        if (
          typeof process !== 'undefined' &&
          process.env.NODE_ENV === 'development'
        ) {
          const serviceList: string[] = [];
          for (const [key] of bindingMap) {
            serviceList.push(String(key));
          }
          logger.debug('Bound services:', serviceList);
        }
      }
    } catch (error) {
      logger.warn('Failed to log binding stats:', error);
    }
  }

  /**
   * 特定のサービスタイプのバインディングを検証
   */
  public static validateBinding(
    container: Container,
    serviceIdentifier: symbol | string
  ): boolean {
    try {
      const isBound = container.isBound(serviceIdentifier);
      if (!isBound) {
        logger.error(`Service not bound: ${String(serviceIdentifier)}`);
        return false;
      }

      // 実際にインスタンス化を試行
      const instance = container.get(serviceIdentifier);
      if (!instance) {
        logger.error(`Failed to resolve service: ${String(serviceIdentifier)}`);
        return false;
      }

      logger.debug(
        `Service validation successful: ${String(serviceIdentifier)}`
      );
      return true;
    } catch (error) {
      logger.error(
        `Service validation failed: ${String(serviceIdentifier)}`,
        error
      );
      return false;
    }
  }

  /**
   * 必須サービスの一括検証
   */
  public static validateEssentialServices(container: Container): boolean {
    const essentialServices = [
      TYPES.Config,
      TYPES.DatabaseClient,
      TYPES.Security,
      TYPES.Logger,
      TYPES.CandidateRepository,
      TYPES.CompanyRepository,
      TYPES.SupabaseClient,
    ];

    let allValid = true;
    for (const service of essentialServices) {
      if (!this.validateBinding(container, service)) {
        allValid = false;
      }
    }

    if (allValid) {
      logger.info('All essential services validated successfully');
    } else {
      logger.error('Essential service validation failed');
    }

    return allValid;
  }
}
