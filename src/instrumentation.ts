/**
 * Next.js Instrumentation
 * サーバー起動時に一度だけ実行される初期化処理
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // サーバ初期化を有効化
    try {
      const { initializeServer } = await import('@/lib/server/init');
      await initializeServer();
    } catch (error) {
      console.error('Server initialization failed:', error);
    }
  }
}
