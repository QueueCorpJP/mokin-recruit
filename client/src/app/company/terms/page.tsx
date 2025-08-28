import React from 'react';
import { AuthAwareNavigation } from '@/components/layout/AuthAwareNavigation';
import { AuthAwareFooter } from '@/components/layout/AuthAwareFooter';

// 利用規約ページのラッパー（Wrapper）
// - 上部padding: 40px
// - 左右・下padding: 80px
// - 最大幅: 1280px、中央寄せ
// - 背景色: #F9F9F9
// - 子要素（今後のコンテンツ）はこの中に配置
export default function TermsPage() {
  return (
    <>
      {/* ナビゲーション（ページ上部） */}
      <AuthAwareNavigation />
      {/* メインコンテンツラッパー（背景色F9F9F9） */}
      <div
        className='pt-10 px-20 pb-20 flex justify-center w-full'
        style={{ background: '#F9F9F9' }}
        // pt-10: padding-top 40px, px-20: 左右padding 80px, pb-20: 下padding 80px
        // 背景色: #F9F9F9
      >
        <div
          className='w-full max-w-[1280px]'
          // max-w-[1280px]: 最大幅1280px, w-full: 画面幅に合わせて広がる
        >
          {/* 白い枠組み（Box）: 幅100%、padding 80px、背景白、角丸10px、カスタムシャドウ、flex縦並び・gap 40px */}
          <div
            className='w-full bg-white flex flex-col gap-10'
            style={{
              borderRadius: '10px',
              boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
              padding: '80px',
            }}
            // borderRadius: 10px
            // boxShadow: X=0, Y=0, blur=20px, 色: #000000 5%
            // padding: 80px
            // flex flex-col: 縦並び
            // gap-10: 要素間の縦gap 40px
          >
            {/* h1見出し: フォントサイズ32px, 行間160%, 色#0F9058, 太字, 幅100%, 中央揃え */}
            <h1
              className='w-full font-bold text-center'
              style={{
                fontSize: '32px',
                lineHeight: '160%',
                color: '#0F9058',
              }}
            >
              利用規約
            </h1>
            {/* テキスト本文: フォントサイズ16px, 行間200%, 文字間隔0.1em, 幅100% */}
            <p
              className='w-full'
              style={{
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
              }}
            >
              これはサンプルの利用規約テキストです。ご利用にあたっては、以下の内容をご確認ください。
              本サービスを利用することで、利用者は本規約に同意したものとみなされます。
              本規約は予告なく変更される場合がありますので、定期的にご確認ください。
              サービスの利用に関するお問い合わせは、サポート窓口までご連絡ください。
              なお、詳細な規約内容は実際の運用に合わせて適宜ご記載ください。
            </p>
            {/* グレーの区切り線: 高さ1px, 幅100%, 色#DCDCDC */}
            <div
              style={{
                width: '100%',
                height: '1px',
                background: '#DCDCDC',
              }}
            />
            {/* 第1条〜第5条まで同じスタイルで追加 */}
            {/* 第1条セクション */}
            <div className='flex flex-col gap-4 mt-10'>
              <h2
                className='w-full font-bold'
                style={{
                  fontSize: '24px',
                  lineHeight: '160%',
                  letterSpacing: '0.1em',
                }}
              >
                第1条
              </h2>
              <p
                className='w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                こちらは第1条のサンプルテキストです。実際の利用規約の内容に合わせてご記載ください。
              </p>
            </div>
            {/* 第2条セクション */}
            <div className='flex flex-col gap-4 mt-10'>
              <h2
                className='w-full font-bold'
                style={{
                  fontSize: '24px',
                  lineHeight: '160%',
                  letterSpacing: '0.1em',
                }}
              >
                第2条
              </h2>
              <p
                className='w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                こちらは第2条のサンプルテキストです。サービスの利用条件や禁止事項などを記載することが一般的です。
              </p>
            </div>
            {/* 第3条セクション */}
            <div className='flex flex-col gap-4 mt-10'>
              <h2
                className='w-full font-bold'
                style={{
                  fontSize: '24px',
                  lineHeight: '160%',
                  letterSpacing: '0.1em',
                }}
              >
                第3条
              </h2>
              <p
                className='w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                こちらは第3条のサンプルテキストです。ユーザー登録やアカウント管理に関する内容を記載することが多いです。
              </p>
            </div>
            {/* 第4条セクション */}
            <div className='flex flex-col gap-4 mt-10'>
              <h2
                className='w-full font-bold'
                style={{
                  fontSize: '24px',
                  lineHeight: '160%',
                  letterSpacing: '0.1em',
                }}
              >
                第4条
              </h2>
              <p
                className='w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                こちらは第4条のサンプルテキストです。個人情報の取り扱いやプライバシーに関する事項を記載することが一般的です。
              </p>
            </div>
            {/* 第5条セクション */}
            <div className='flex flex-col gap-4 mt-10'>
              <h2
                className='w-full font-bold'
                style={{
                  fontSize: '24px',
                  lineHeight: '160%',
                  letterSpacing: '0.1em',
                }}
              >
                第5条
              </h2>
              <p
                className='w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                こちらは第5条のサンプルテキストです。免責事項やサービスの変更・終了に関する内容を記載することが多いです。
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* フッター（ページ下部） */}
      <AuthAwareFooter />
    </>
  );
}
