import { Metadata, Viewport } from 'next';
import { Navigation } from '@/components/ui/navigation';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'パスワードの再設定 | CuePoint',
  description: 'パスワードをリセットするためのメールを送信します',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function ResetPasswordPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* ヘッダー */}
      <Navigation />

      {/* メインコンテンツ */}
      <main className='flex-1 bg-gradient-to-b from-[#17856F] to-[#229A4E] flex items-center justify-center px-20 py-20'>
        {/* 背景装飾 */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -left-56 top-[395px] w-[1889.89px] h-[335px] bg-gradient-to-b from-[#198D76] to-[#1CA74F] rounded-full opacity-30'></div>
        </div>

        {/* カードコンテナ */}
        <div className='relative bg-white rounded-[10px] shadow-lg p-20 w-full max-w-[800px]'>
          <ForgotPasswordForm />
        </div>
      </main>

      {/* フッター */}
      <footer className='bg-[#323232] text-white'>
        <div className='px-20 py-20'>
          <div className='flex gap-20'>
            {/* 左側 - ロゴとキャッチフレーズ */}
            <div className='flex-1 flex flex-col justify-between gap-10'>
              <div className='flex flex-col gap-6'>
                <div className='w-45'>
                  <img src='/images/logo-white.png' alt='CuePoint' className='h-9' />
                </div>
                <p className='text-white font-bold leading-8'>
                  戦略的なスカウトを支える
                  <br />
                  ダイレクトリクルーティングサービス
                </p>
              </div>

              <div className='flex gap-2 items-center'>
                <span className='text-white font-bold bg-transparent px-6 py-2 text-center w-26'>
                  会員登録
                </span>
                <span className='text-white'>/</span>
                <span className='text-white font-bold bg-transparent px-6 py-2 text-center w-26'>
                  ログイン
                </span>
              </div>
            </div>

            {/* 右側 - フッターメニュー */}
            <div className='w-[800px] flex gap-10'>
              {/* サービス */}
              <div className='flex-1'>
                <h3 className='text-white font-bold text-lg mb-4'>サービス</h3>
                <div className='border-t border-white mb-4'></div>
                <div className='space-y-0'>
                  {[
                    'メッセージ',
                    '候補者を探す',
                    '保存した検索条件',
                    '進捗管理',
                    'お知らせ一覧',
                  ].map(item => (
                    <div key={item} className='flex items-center gap-2 py-1'>
                      <div className='w-2 h-2 bg-[#0F9058] rounded-full'></div>
                      <span className='text-white font-bold text-sm'>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* お問い合わせ */}
              <div className='flex-1'>
                <h3 className='text-white font-bold text-lg mb-4'>
                  お問い合わせ
                </h3>
                <div className='border-t border-white mb-4'></div>
                <div className='space-y-0'>
                  {[
                    '問い合わせ',
                    'ご利用ガイド',
                    'よくある質問',
                    '不具合・要望フォーム',
                  ].map(item => (
                    <div key={item} className='flex items-center gap-2 py-1'>
                      <div className='w-2 h-2 bg-[#0F9058] rounded-full'></div>
                      <span className='text-white font-bold text-sm'>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 会社情報・規約 */}
              <div className='flex-1'>
                <h3 className='text-white font-bold text-lg mb-4'>
                  会社情報・規約
                </h3>
                <div className='border-t border-white mb-4'></div>
                <div className='space-y-0'>
                  {[
                    '運営会社',
                    '利用規約',
                    'プライバシーポリシー',
                    '法令に基づく表記',
                  ].map(item => (
                    <div key={item} className='flex items-center gap-2 py-1'>
                      <div className='w-2 h-2 bg-[#0F9058] rounded-full'></div>
                      <span className='text-white font-bold text-sm'>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className='bg-[#262626] px-20 py-6'>
          <p className='text-white text-sm'>
            © 2025 DRS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
