import { PrismaClient, Prisma } from '@prisma/client';
import { initializeSupabase, testSupabaseConnection } from './supabase';
import { initializeStorageBuckets } from '@/storage/supabaseStorage';
import { logger } from '@/utils/logger';

declare global {
  var __db__: PrismaClient | undefined;
}

let prisma: PrismaClient;

// 環境変数の検証
function validateDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  return databaseUrl;
}

// Supabase用のPrisma設定
function createPrismaConfig() {
  const logLevels: Prisma.LogLevel[] = process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'];

  return {
    log: logLevels,
  };
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(createPrismaConfig());
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient(createPrismaConfig());
  }
  prisma = global.__db__;
}

export { prisma };

export async function connectDatabase(): Promise<void> {
  try {
    // 環境変数検証
    validateDatabaseUrl();

    // Prisma接続
    await prisma.$connect();
    logger.info('Prisma database connected successfully');

    // Supabase初期化
    initializeSupabase();
    
    // Supabase接続テスト
    const supabaseConnected = await testSupabaseConnection();
    if (!supabaseConnected) {
      logger.warn('Supabase connection test failed, but continuing with Prisma only');
    } else {
      // Supabase Storage初期化
      await initializeStorageBuckets();
    }

    logger.info('Database connection setup completed');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Database disconnect failed:', error);
    throw error;
  }
} 