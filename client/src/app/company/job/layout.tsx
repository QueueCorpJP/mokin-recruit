import React from 'react';
import { Navigation } from '@/components/ui/navigation';

export default function CompanyJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* ヘッダー */}
      <Navigation variant='company' />

      {/* メインコンテンツ */}
      <main className='flex-1'>{children}</main>

      {/* フッター */}
      <footer className='bg-gray-800 text-white'>
        <div className='px-20 py-20'>
          <div className='flex justify-between gap-20'>
            {/* 左側: ロゴとキャッチコピー */}
            <div className='flex flex-col gap-10'>
              <div className='flex flex-col gap-10'>
                <div className='w-45 h-9 bg-white rounded flex items-center justify-center'>
                  <span className='text-black font-bold text-lg'>CuePoint</span>
                </div>
                <p className='text-base font-bold text-white max-w-sm'>
                  戦略的なスカウトを支える
                  <br />
                  ダイレクトリクルーティングサービス
                </p>
              </div>
              <div className='flex items-center justify-center w-26 text-base font-bold text-white border border-white rounded hover:bg-white hover:text-gray-800 transition-colors cursor-pointer'>
                ログアウト
              </div>
            </div>

            {/* 右側: フッターメニュー */}
            <div className='flex gap-10 flex-1 max-w-4xl'>
              {/* サービス */}
              <div className='flex flex-col gap-4 flex-1'>
                <h3 className='text-lg font-bold text-white'>サービス</h3>
                <div className='w-full h-px bg-white'></div>
                <div className='flex flex-col gap-3'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      メッセージ
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      候補者を探す
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      保存した検索条件
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      進捗管理
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      お知らせ一覧
                    </span>
                  </div>
                </div>
              </div>

              {/* お問い合わせ */}
              <div className='flex flex-col gap-4 flex-1'>
                <h3 className='text-lg font-bold text-white'>お問い合わせ</h3>
                <div className='w-full h-px bg-white'></div>
                <div className='flex flex-col gap-3'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      問い合わせ
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      ご利用ガイド
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      よくある質問
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      不具合・要望フォーム
                    </span>
                  </div>
                </div>
              </div>

              {/* 会社情報・規約 */}
              <div className='flex flex-col gap-4 flex-1'>
                <h3 className='text-lg font-bold text-white'>会社情報・規約</h3>
                <div className='w-full h-px bg-white'></div>
                <div className='flex flex-col gap-3'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      運営会社
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      利用規約
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      プライバシーポリシー
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                    <span className='text-base font-bold text-white'>
                      法令に基づく表記
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className='bg-gray-900 px-20 py-6'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-white'>
              © 2025 DRS. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
