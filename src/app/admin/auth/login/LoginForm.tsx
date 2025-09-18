// サーバーサイドコンポーネント: 管理画面ログインフォーム
// UI/レイアウトは現状の page.tsx から移植
// エラーや入力値は props で受け取る
// サーバーアクション loginAction を呼び出す

import { Button } from '@/components/ui/button';
import { loginAction } from './actions';

// LoginFormProps: ログインフォームで受け取るプロパティ（エラーや入力値）
interface LoginFormProps {
  error?: string | null; // サーバーから返却されたエラーメッセージ
  errorDetail?: string | object | null; // 詳細なエラー内容（開発用）
  errorStage?: string | null; // エラー発生箇所や種別
  email?: string; // 入力済みメールアドレス（エラー時の再表示用）
  password?: string; // 入力済みパスワード（通常は空欄）
}

// 管理画面ログインフォーム本体
export default function LoginForm({
  error,
  errorDetail,
  errorStage,
  email = '',
  password = '',
}: LoginFormProps) {
  // errorDetailがオブジェクトの場合はJSON形式で整形
  let errorDetailString = '';
  if (errorDetail) {
    if (typeof errorDetail === 'object') {
      errorDetailString = JSON.stringify(errorDetail, null, 2);
    } else {
      errorDetailString = String(errorDetail);
    }
  }

  return (
    <div className='min-h-screen flex items-start justify-start px-8 pt-16'>
      <div className='w-full max-w-[500px]'>
        {/* タイトル・説明文 */}
        <div className='text-left mb-[40px]'>
          <h1 className='text-[32px] font-bold text-[#323232] mb-[16px] Noto_Sans_JP'>
            管理画面ログイン
          </h1>
          <div className='space-y-2 Noto_Sans_JP font-[14px] text-[#323232] font-bold'>
            <p>Cue Point管理画面のログインページです。</p>
            <p>
              ログイン情報をご入力いただき、「ログインする」からログインが可能です。
            </p>
          </div>
        </div>
        {/* ログインフォーム本体 */}
        <form
          action={loginAction} // サーバーアクションを呼び出す
          className='space-y-6 flex flex-col items-start'
        >
          {/* エラー表示（サーバーから返却された内容を表示） */}
          {error && <div className='text-red-600 font-bold mb-2'>{error}</div>}
          {errorStage && (
            <div className='text-xs text-yellow-700 mb-2'>
              エラー種別: {errorStage}
            </div>
          )}
          {errorDetailString && (
            <pre className='text-xs text-red-400 mb-2'>{errorDetailString}</pre>
          )}
          {/* メールアドレス入力欄 */}
          <div>
            <input
              type='email'
              name='email'
              defaultValue={email}
              placeholder='メールアドレスを入力してください。'
              className='w-[360px] px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500'
              required
            />
          </div>
          {/* パスワード入力欄 */}
          <div>
            <input
              type='password'
              name='password'
              defaultValue={password}
              placeholder='パスワードを入力してください。'
              className='w-[360px] px-4 py-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500'
              required
            />
          </div>
          {/* ユーザー種別（管理者）をhiddenで送信 */}
          <input type='hidden' name='userType' value='admin' />
          {/* ログインボタン */}
          <div className='pt-2'>
            <Button
              variant='green-gradient'
              className='px-[40px] h-[48px] text-[16px] font-bold rounded-[100px]'
            >
              ログインする
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
