import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { authMiddleware } from '@/middleware/auth';
import { logger } from '@/utils/logger';
import { connectDatabase } from '@/database/connection';

// ルートインポート
import authRoutes from '@/routes/auth';
import candidateRoutes from '@/routes/candidates';
import companyRoutes from '@/routes/companies';
import jobRoutes from '@/routes/jobs';
import messageRoutes from '@/routes/messages';
import adminRoutes from '@/routes/admin';

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger設定
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Direct Template API',
      version: '1.0.0',
      description: '転職プラットフォーム Direct Template の API ドキュメント',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '開発サーバー',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // ルートファイルのパス
};

const specs = swaggerJsdoc(swaggerOptions);

// レート制限設定
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15分
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 最大100リクエスト
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 基本ミドルウェア
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// CORS設定
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// レート制限適用
app.use('/api/', limiter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ヘルスチェック
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API ルート
app.use('/api/auth', authRoutes);
app.use('/api/candidates', authMiddleware, candidateRoutes);
app.use('/api/companies', authMiddleware, companyRoutes);
app.use('/api/jobs', authMiddleware, jobRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// 静的ファイル配信（アップロードファイル用）
app.use('/uploads', express.static('uploads'));

// エラーハンドリング
app.use(notFoundHandler);
app.use(errorHandler);

// サーバー起動
async function startServer() {
  try {
    // データベース接続
    await connectDatabase();
    logger.info('Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// 未処理の例外をキャッチ
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer(); 