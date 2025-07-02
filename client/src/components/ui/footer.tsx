import Link from 'next/link';

interface FooterProps {
  variant?: 'default' | 'login-before';
}

export function Footer({ variant = 'default' }: FooterProps) {
  // メニューデータ
  const menuData = {
    service: {
      title: 'サービス',
      items: [
        'メッセージ',
        '候補者を探す',
        '保存した検索条件',
        '進捗管理',
        'お知らせ一覧',
      ],
    },
    support: {
      title: 'お問い合わせ',
      items: [
        '問い合わせ',
        'ご利用ガイド',
        'よくある質問',
        '不具合・要望フォーム',
      ],
    },
    company: {
      title: '会社情報・規約',
      items: [
        '運営会社',
        '利用規約',
        'プライバシーポリシー',
        '法令に基づく表記',
      ],
    },
  };

  return (
    <footer className='bg-[#323232] text-white'>
      {/* メインフッターセクション */}
      <div className='px-4 lg:px-20 py-20'>
        <div className='flex flex-col lg:flex-row gap-10 lg:gap-20'>
          {/* 左側 - ロゴとキャッチフレーズ + 会員登録/ログイン */}
          <div className='flex-1 flex flex-col justify-between gap-10'>
            {/* ロゴとキャッチフレーズ */}
            <div className='flex flex-col gap-6'>
              <div className='w-[180px] h-[37.8px] flex items-center'>
                {/* 一旦テキストロゴで代用 - logo-white.pngが用意されたら置き換え */}
                <h2 className='text-white font-bold text-2xl tracking-wider'>
                  CuePoint
                </h2>
                {/* 
                <img 
                  src='/logo-white.png'
                  alt='CuePoint'
                  className='h-[37.8px] w-full object-contain'
                />
                */}
              </div>
              <p className='text-white font-bold text-base leading-8 tracking-[0.1em]'>
                戦略的なスカウトを支える
                <br />
                ダイレクトリクルーティングサービス
              </p>
            </div>

            {/* 会員登録/ログインリンク */}
            <div className='flex items-center gap-2'>
              <Link
                href='/auth/register'
                className='text-white font-bold text-base leading-8 tracking-[0.1em] bg-transparent px-6 py-2 text-center w-[104px] hover:text-[#0F9058] transition-colors'
              >
                会員登録
              </Link>
              <span className='text-white font-medium text-base leading-8 tracking-[0.1em]'>
                /
              </span>
              <Link
                href='/auth/login'
                className='text-white font-bold text-base leading-8 tracking-[0.1em] bg-transparent px-6 py-2 text-center w-[104px] hover:text-[#0F9058] transition-colors'
              >
                ログイン
              </Link>
            </div>
          </div>

          {/* 右側 - 3カラムメニュー */}
          <div className='w-full lg:w-[800px] flex flex-col md:flex-row gap-6 md:gap-10'>
            {/* サービスメニュー */}
            <div className='flex-1'>
              <h3 className='text-white font-bold text-lg leading-[1.6em] tracking-[0.1em] mb-4'>
                {menuData.service.title}
              </h3>
              <div className='border-t border-white mb-4'></div>
              <div className='space-y-0'>
                {menuData.service.items.map((item, index) => (
                  <div key={index} className='flex items-center gap-2 py-1'>
                    <div className='w-2 h-2 bg-[#0F9058] rounded-full flex-shrink-0'></div>
                    <span className='text-white font-bold text-sm leading-8 tracking-[0.1em]'>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* お問い合わせメニュー */}
            <div className='flex-1'>
              <h3 className='text-white font-bold text-lg leading-[1.6em] tracking-[0.1em] mb-4'>
                {menuData.support.title}
              </h3>
              <div className='border-t border-white mb-4'></div>
              <div className='space-y-0'>
                {menuData.support.items.map((item, index) => (
                  <div key={index} className='flex items-center gap-2 py-1'>
                    <div className='w-2 h-2 bg-[#0F9058] rounded-full flex-shrink-0'></div>
                    <span className='text-white font-bold text-sm leading-8 tracking-[0.1em]'>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 会社情報・規約メニュー */}
            <div className='flex-1'>
              <h3 className='text-white font-bold text-lg leading-[1.6em] tracking-[0.1em] mb-4'>
                {menuData.company.title}
              </h3>
              <div className='border-t border-white mb-4'></div>
              <div className='space-y-0'>
                {menuData.company.items.map((item, index) => (
                  <div key={index} className='flex items-center gap-2 py-1'>
                    <div className='w-2 h-2 bg-[#0F9058] rounded-full flex-shrink-0'></div>
                    <span className='text-white font-bold text-sm leading-8 tracking-[0.1em]'>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* コピーライトセクション */}
      <div className='bg-[#262626] px-4 lg:px-20 py-6'>
        <p className='text-white font-medium text-sm leading-[1.6em] tracking-[0.1em]'>
          © 2025 DRS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
