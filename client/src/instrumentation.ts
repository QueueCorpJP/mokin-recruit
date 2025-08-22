/**
 * Next.js Instrumentation
 * サーバー起動時に一度だけ実行される初期化処理
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 一時的に初期化を無効化（起動問題の調査のため）
    console.log('🚀 Server initialization skipped for debugging');
    // const { initializeServer } = await import('@/lib/server/init');
    // initializeServer();
  }
}