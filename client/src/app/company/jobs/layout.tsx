import React from 'react';

export default function CompanyJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* ヘッダー */}
      <header className='bg-white border-b border-gray-200 shadow-sm'>
        <div className='flex justify-between items-center px-10 py-4'>
          {/* ロゴ */}
          <div className='flex items-center'>
            <div className='w-45 h-9 bg-black rounded flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>CuePoint</span>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className='flex items-center gap-10'>
            <a
              href='/company'
              className='flex items-center gap-2 text-base font-bold text-gray-800 hover:text-green-600 transition-colors'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
              </svg>
              マイページ
            </a>

            <div className='flex items-center gap-2 text-base font-bold text-gray-800 hover:text-green-600 transition-colors'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
              </svg>
              メッセージ
              <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>

            <div className='flex items-center gap-2 text-base font-bold text-gray-800 hover:text-green-600 transition-colors'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                  clipRule='evenodd'
                />
              </svg>
              候補者を探す
              <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>

            <a
              href='/company/jobs'
              className='flex items-center gap-2 text-base font-bold text-green-600 border-b-4 border-green-600 pb-1'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
              </svg>
              求人一覧
            </a>

            <a
              href='/company/applications'
              className='flex items-center gap-2 text-base font-bold text-gray-800 hover:text-green-600 transition-colors'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                <path
                  fillRule='evenodd'
                  d='M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L16 11.586V5a2 2 0 00-2-2v1a1 1 0 01-1 1H7a1 1 0 01-1-1V3a2 2 0 00-2 2v6.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L4 11.586V5z'
                  clipRule='evenodd'
                />
              </svg>
              対応リスト
            </a>

            <div className='flex items-center gap-2 text-base font-bold text-gray-800 hover:text-green-600 transition-colors'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
                  clipRule='evenodd'
                />
              </svg>
              ヘルプ
              <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>

            <div className='flex flex-col gap-1 text-base font-bold text-gray-800'>
              <div className='text-sm font-bold text-gray-800 max-w-35 truncate'>
                企業アカウント名テキスト企業アカウント名テキスト
              </div>
              <div className='text-base font-bold text-gray-800 max-w-35 truncate'>
                ユーザー名テキストユーザー名テキスト
              </div>
              <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </nav>
        </div>
      </header>

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
