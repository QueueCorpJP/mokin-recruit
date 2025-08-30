import winston from 'winston';

// ログレベルの定義
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// ログカラーの定義
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(logColors);

// 環境に応じたログレベルの設定
const getLogLevel = (): string => {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }
  return process.env.NODE_ENV === 'development' ? 'debug' : 'info';
};

// 本番環境対応のログフォーマット
const createLogFormat = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // 本番環境: JSON形式でVercelログに出力
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );
  } else {
    // 開発環境: 色付きフォーマット
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.colorize({ all: true }),
      winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`
      )
    );
  }
};

// 環境に応じたトランスポートの設定
const createTransports = () => {
  const transports: winston.transport[] = [];

  // コンソール出力は常に有効
  transports.push(new winston.transports.Console());

  // ファイル出力は開発環境のみ（Vercel対応）
  if (process.env.NODE_ENV === 'development') {
    try {
      transports.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          handleExceptions: true,
        }),
        new winston.transports.File({
          filename: 'logs/all.log',
          handleExceptions: true,
        })
      );
    } catch (error) {
      // ファイル書き込みに失敗してもログ機能は継続
      console.warn('File logging disabled:', error);
    }
  }

  return transports;
};

// Loggerインスタンスの作成（環境適応型）
export const logger = winston.createLogger({
  level: getLogLevel(),
  levels: logLevels,
  format: createLogFormat(),
  transports: createTransports(),
  exitOnError: false, // エラーでプロセスを終了しない
  handleExceptions: true,
  handleRejections: true,
});

// 本番環境でのエラーハンドリング強化
if (process.env.NODE_ENV === 'production') {
  logger.on('error', error => {
    console.error('Logger error:', error);
  });
}

// 開発環境での追加設定
if (process.env.NODE_ENV === 'development') {
  logger.debug('Logger initialized in development mode');
}
