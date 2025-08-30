import 'reflect-metadata';
import { injectable } from 'inversify';
import { logger } from '@/lib/server/utils/logger';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

/**
 * テストデータ生成サービス
 * 開発・テスト環境でのダミーデータ作成
 */
@injectable()
export class TestDataService {
  private readonly isTestMode: boolean;

  constructor() {
    this.isTestMode =
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  }

  /**
   * テストデータ生成が有効かチェック
   */
  isEnabled(): boolean {
    return this.isTestMode;
  }

  /**
   * 包括的なテストデータセットを生成
   */
  async generateCompleteTestDataset(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'Test data generation is not available in production',
      };
    }

    try {
      logger.info('🧪 Starting comprehensive test data generation...');

      const results = {
        candidates: await this.generateTestCandidates(),
        companies: await this.generateTestCompanies(),
        companyUsers: await this.generateTestCompanyUsers(),
        jobPostings: await this.generateTestJobPostings(),
        adminUsers: await this.generateTestAdminUsers(),
      };

      logger.info('🎉 Test data generation completed successfully');

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      logger.error('❌ Test data generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * テスト用候補者データを生成
   */
  private async generateTestCandidates(): Promise<any[]> {
    const candidates = [
      {
        email: 'candidate1@test.local',
        password: 'TestPassword123!',
        lastName: '山田',
        firstName: '太郎',
        lastNameKana: 'ヤマダ',
        firstNameKana: 'タロウ',
        gender: 'MALE',
        currentResidence: '東京都渋谷区',
        birthDate: '1990-05-15',
        phoneNumber: '090-1234-5678',
        currentSalary: '500万円',
        desiredSalary: '600万円',
        hasJobChangeExperience: true,
        desiredChangeTiming: '3ヶ月以内',
        jobSearchStatus: 'ACTIVE',
        finalEducation: '大学卒業',
        englishLevel: 'INTERMEDIATE',
      },
      {
        email: 'candidate2@test.local',
        password: 'TestPassword123!',
        lastName: '佐藤',
        firstName: '花子',
        lastNameKana: 'サトウ',
        firstNameKana: 'ハナコ',
        gender: 'FEMALE',
        currentResidence: '大阪府大阪市',
        birthDate: '1985-08-22',
        phoneNumber: '090-8765-4321',
        currentSalary: '700万円',
        desiredSalary: '800万円',
        hasJobChangeExperience: false,
        desiredChangeTiming: '6ヶ月以内',
        jobSearchStatus: 'PASSIVE',
        finalEducation: '大学院修了',
        englishLevel: 'ADVANCED',
      },
      {
        email: 'candidate3@test.local',
        password: 'TestPassword123!',
        lastName: '田中',
        firstName: '次郎',
        lastNameKana: 'タナカ',
        firstNameKana: 'ジロウ',
        gender: 'MALE',
        currentResidence: '神奈川県横浜市',
        birthDate: '1992-12-03',
        phoneNumber: '090-5555-7777',
        currentSalary: '400万円',
        desiredSalary: '550万円',
        hasJobChangeExperience: true,
        desiredChangeTiming: '1年以内',
        jobSearchStatus: 'CONSIDERING',
        finalEducation: '専門学校卒業',
        englishLevel: 'BEGINNER',
      },
    ];

    const createdCandidates = [];
    for (const candidate of candidates) {
      try {
        const result = await this.createTestUser(candidate, 'candidate');
        if (result.success) {
          createdCandidates.push(result.user);
        }
      } catch (error) {
        logger.warn(
          `Failed to create test candidate: ${candidate.email}`,
          error
        );
      }
    }

    return createdCandidates;
  }

  /**
   * テスト用企業データを生成
   */
  private async generateTestCompanies(): Promise<any[]> {
    const companies = [
      {
        id: 'test-company-001',
        companyName: 'テックイノベーション株式会社',
        industry: 'IT・ソフトウェア',
        companySize: '100-499名',
        establishedYear: 2010,
        location: '東京都港区',
        website: 'https://tech-innovation.test',
        description: '最新技術を活用したソリューション開発企業',
        benefits: ['リモートワーク可', '副業OK', '研修制度充実'],
      },
      {
        id: 'test-company-002',
        companyName: '株式会社グローバルソリューションズ',
        industry: 'コンサルティング',
        companySize: '500-999名',
        establishedYear: 2005,
        location: '大阪府大阪市',
        website: 'https://global-solutions.test',
        description: '企業の成長を支援するコンサルティング会社',
        benefits: ['海外研修あり', 'フレックス制度', '社内起業制度'],
      },
      {
        id: 'test-company-003',
        companyName: 'デジタルマーケティング合同会社',
        industry: 'マーケティング・広告',
        companySize: '50-99名',
        establishedYear: 2018,
        location: '神奈川県横浜市',
        website: 'https://digital-marketing.test',
        description: 'デジタル時代のマーケティング戦略を提供',
        benefits: ['成果報酬制度', 'スキルアップ支援', '自由な働き方'],
      },
    ];

    // 実際の企業データベースへの挿入は、Supabaseのテーブル構造に依存
    // ここでは簡略化
    return companies;
  }

  /**
   * テスト用企業ユーザーデータを生成
   */
  private async generateTestCompanyUsers(): Promise<any[]> {
    const companyUsers = [
      {
        email: 'hr@tech-innovation.test',
        password: 'TestPassword123!',
        fullName: '人事部 採用担当',
        companyAccountId: 'test-company-001',
        positionTitle: '人事マネージャー',
      },
      {
        email: 'recruiter@global-solutions.test',
        password: 'TestPassword123!',
        fullName: '田村 美咲',
        companyAccountId: 'test-company-002',
        positionTitle: 'リクルーター',
      },
      {
        email: 'admin@digital-marketing.test',
        password: 'TestPassword123!',
        fullName: '営業部 責任者',
        companyAccountId: 'test-company-003',
        positionTitle: '営業責任者',
      },
    ];

    const createdUsers = [];
    for (const user of companyUsers) {
      try {
        const result = await this.createTestUser(user, 'company_user');
        if (result.success) {
          createdUsers.push(result.user);
        }
      } catch (error) {
        logger.warn(`Failed to create test company user: ${user.email}`, error);
      }
    }

    return createdUsers;
  }

  /**
   * テスト用求人データを生成
   */
  private async generateTestJobPostings(): Promise<any[]> {
    const jobPostings = [
      {
        companyAccountId: 'test-company-001',
        title: 'フルスタックエンジニア',
        description: 'React/Node.jsを使用したWebアプリケーション開発',
        requirements: ['React経験3年以上', 'Node.js経験', 'TypeScript使用経験'],
        salaryRange: '500万円〜800万円',
        workLocation: '東京都港区（リモート可）',
        employmentType: 'FULL_TIME',
        experienceLevel: 'MID_LEVEL',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        benefits: ['リモートワーク', '副業OK', '技術書購入支援'],
      },
      {
        companyAccountId: 'test-company-002',
        title: 'ITコンサルタント',
        description: '企業のDX推進を支援するコンサルティング業務',
        requirements: ['コンサル経験2年以上', 'IT知識', 'プロジェクト管理経験'],
        salaryRange: '600万円〜1000万円',
        workLocation: '大阪府大阪市',
        employmentType: 'FULL_TIME',
        experienceLevel: 'SENIOR_LEVEL',
        skills: ['プロジェクト管理', 'DX', 'システム設計'],
        benefits: ['海外研修', 'フレックス制度', '成果報酬'],
      },
      {
        companyAccountId: 'test-company-003',
        title: 'デジタルマーケター',
        description: 'SNS・Web広告の企画・運用・分析業務',
        requirements: ['マーケティング経験1年以上', 'データ分析スキル'],
        salaryRange: '400万円〜650万円',
        workLocation: '神奈川県横浜市',
        employmentType: 'FULL_TIME',
        experienceLevel: 'ENTRY_LEVEL',
        skills: ['Google Analytics', 'Facebook広告', 'SEO', 'データ分析'],
        benefits: ['成果報酬', 'スキルアップ支援', '自由な働き方'],
      },
    ];

    // 実際の求人データベースへの挿入は、Supabaseのテーブル構造に依存
    return jobPostings;
  }

  /**
   * テスト用管理者ユーザーを生成
   */
  private async generateTestAdminUsers(): Promise<any[]> {
    const adminUsers = [
      {
        email: 'admin@mokin-recruit.test',
        password: 'AdminPassword123!',
        fullName: 'システム管理者',
        permissions: ['all'],
        role: 'SUPER_ADMIN',
      },
      {
        email: 'moderator@mokin-recruit.test',
        password: 'ModeratorPassword123!',
        fullName: 'コンテンツモデレーター',
        permissions: ['content_moderation', 'user_management'],
        role: 'MODERATOR',
      },
    ];

    const createdAdmins = [];
    for (const admin of adminUsers) {
      try {
        const result = await this.createTestUser(admin, 'admin');
        if (result.success) {
          createdAdmins.push(result.user);
        }
      } catch (error) {
        logger.warn(`Failed to create test admin: ${admin.email}`, error);
      }
    }

    return createdAdmins;
  }

  /**
   * テストユーザーを作成（汎用）
   */
  private async createTestUser(
    userData: any,
    userType: string
  ): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const supabaseAdmin = getSupabaseAdminClient();

      // Supabase Authにユーザーを作成
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            userType,
            full_name:
              userData.fullName || `${userData.lastName} ${userData.firstName}`,
            created_for_testing: true,
            test_data_generated: true,
          },
        });

      if (authError) {
        // ユーザーが既に存在する場合はスキップ
        if (authError.message.includes('already registered')) {
          logger.info(`Test user already exists: ${userData.email}`);
          return {
            success: true,
            user: { email: userData.email, exists: true },
          };
        }
        throw authError;
      }

      logger.info(`✅ Test user created: ${userData.email} (${userType})`);

      return {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          userType,
          ...userData,
        },
      };
    } catch (error) {
      logger.error(`Failed to create test user: ${userData.email}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * テストデータをクリーンアップ
   */
  async cleanupTestData(): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'Test data cleanup is not available in production',
      };
    }

    try {
      logger.info('🧹 Starting test data cleanup...');

      const supabaseAdmin = getSupabaseAdminClient();

      // テスト用ユーザーを取得
      const { data: users, error: listError } =
        await supabaseAdmin.auth.admin.listUsers();

      if (listError) {
        throw listError;
      }

      // テスト用ユーザーをフィルタリング
      const testUsers = users.users.filter(
        user =>
          user.user_metadata?.created_for_testing === true ||
          user.email?.includes('@test.local') ||
          user.email?.includes('@bypass.local')
      );

      let deletedCount = 0;
      for (const user of testUsers) {
        try {
          const { error: deleteError } =
            await supabaseAdmin.auth.admin.deleteUser(user.id);

          if (!deleteError) {
            deletedCount++;
            logger.info(`🗑️ Deleted test user: ${user.email}`);
          }
        } catch (error) {
          logger.warn(`Failed to delete test user: ${user.email}`, error);
        }
      }

      logger.info(
        `🎉 Test data cleanup completed. Deleted ${deletedCount} users.`
      );

      return {
        success: true,
        message: `Cleaned up ${deletedCount} test users`,
      };
    } catch (error) {
      logger.error('❌ Test data cleanup failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 利用可能なテストユーザー一覧を取得
   */
  async getAvailableTestUsers(): Promise<{
    success: boolean;
    users?: any[];
    error?: string;
  }> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'Test user listing is not available in production',
      };
    }

    try {
      const supabaseAdmin = getSupabaseAdminClient();

      const { data: users, error: listError } =
        await supabaseAdmin.auth.admin.listUsers();

      if (listError) {
        throw listError;
      }

      const testUsers = users.users
        .filter(
          user =>
            user.user_metadata?.created_for_testing === true ||
            user.email?.includes('@test.local')
        )
        .map(user => ({
          id: user.id,
          email: user.email,
          userType: user.user_metadata?.userType || 'unknown',
          fullName: user.user_metadata?.full_name || 'Unknown',
          createdAt: user.created_at,
          lastSignIn: user.last_sign_in_at,
        }));

      return {
        success: true,
        users: testUsers,
      };
    } catch (error) {
      logger.error('Failed to get test users:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export default TestDataService;
