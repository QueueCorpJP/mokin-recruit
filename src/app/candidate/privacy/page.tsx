import React from 'react';

// 利用規約ページのラッパー（Wrapper）
// - 上部padding: 40px
// - 左右・下padding: 80px
// - 最大幅: 1280px、中央寄せ
// - 背景色: #F9F9F9
// - 子要素（今後のコンテンツ）はこの中に配置
export default function TermsPage() {
  return (
    <>
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
              プライバシポリシー
            </h1>
            {/* プライバシーポリシー本文（新テキスト） */}
            <p
              className='w-full font-bold text-center'
              style={{
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
              }}
            >
              株式会社メルセネール（以下「当社」といいます）は、当社が提供するダイレクトリクルーティングサービス（以下「本サービス」といいます）において、ユーザーの個人情報の保護を重要な責務と考え、以下の方針に基づき、個人情報の適切な取得・利用・管理を行います。
            </p>
            {/* グレーの区切り線 */}
            <div
              style={{ width: '100%', height: '1px', background: '#DCDCDC' }}
            />

            {/* 第1条 */}
            <div className='flex flex-col gap-4 mt-10'>
              <h2
                className='w-full font-bold'
                style={{
                  fontSize: '24px',
                  lineHeight: '160%',
                  letterSpacing: '0.1em',
                }}
              >
                第1条（個人情報の定義）
              </h2>
              <p
                className='w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                本プライバシーポリシーにおける「個人情報」とは、個人情報保護法に定める「個人情報」をいい、氏名、生年月日、住所、電話番号、メールアドレス、職歴、スキル情報、その他特定の個人を識別できる情報を含みます。
              </p>
            </div>

            {/* 第2条 */}
            <div className='flex flex-col gap-4 mt-10'>
              <h2
                className='w-full font-bold'
                style={{
                  fontSize: '24px',
                  lineHeight: '160%',
                  letterSpacing: '0.1em',
                }}
              >
                第2条（個人情報の取得方法）
              </h2>
              <p
                className='w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                当社は、ユーザーが本サービスに登録・応募・お問い合わせ等を行う際に、必要な個人情報を適正かつ公正な手段によって取得します。
                <br />
                また、サービス向上のため、クッキー（Cookie）やアクセス解析ツール等を使用して、利用状況に関する情報を収集することがあります。
              </p>
            </div>

            {/* 第3条 */}
            <div className='flex flex-col gap-4 mt-10'>
              <h2
                className='w-full font-bold'
                style={{
                  fontSize: '24px',
                  lineHeight: '160%',
                  letterSpacing: '0.1em',
                }}
              >
                第3条（個人情報の利用目的）
              </h2>
              <p
                className='w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                当社は、取得した個人情報を以下の目的のために利用いたします：
              </p>
              <ul
                className='list-disc pl-6 w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                <li>本サービスの提供および運営のため</li>
                <li>ユーザーと企業とのマッチングを実現するため</li>
                <li>本人確認、ユーザーサポート、連絡・通知のため</li>
                <li>
                  サービスの改善・新機能の開発、マーケティング・分析のため
                </li>
                <li>法令に基づく対応や、不正利用の防止のため</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
