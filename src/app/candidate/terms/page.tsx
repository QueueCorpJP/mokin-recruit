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
              利用規約
            </h1>{' '}
            {/* 利用規約本文（新テキスト） */}
            <p
              className='w-full font-bold text-center'
              style={{
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
              }}
            >
              この利用規約（以下「本規約」といいます）は、株式会社メルセネール（以下「当社」といいます）が提供するダイレクトリクルーティングサービス（以下「本サービス」といいます）の利用に関する条件を定めるものです。
              <br />
              本サービスをご利用されるすべての方（以下「ユーザー」といいます）は、本規約に同意したものとみなされます。
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
                第1条（適用）
              </h2>
              <ol
                className='list-decimal pl-6 w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                <li>
                  本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。
                </li>
                <li>
                  当社は本サービスに関し、本規約のほか、ご利用にあたってのルール等（以下「個別規定」といいます）を定めることがあります。これら個別規定は本規約の一部を構成するものとします。
                </li>
              </ol>
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
                第2条（利用登録）
              </h2>
              <ol
                className='list-decimal pl-6 w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                <li>
                  本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法により利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
                </li>
                <li>
                  当社は、利用登録の申請者に以下の事由があると判断した場合、登録を拒否することがあり、その理由については一切の開示義務を負いません。
                  <ul className='list-disc pl-6 mt-2'>
                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、当社が利用登録を相当でないと判断した場合</li>
                  </ul>
                </li>
              </ol>
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
                第3条（ユーザーIDおよびパスワードの管理）
              </h2>
              <ol
                className='list-decimal pl-6 w-full'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                }}
              >
                <li>
                  ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
                </li>
                <li>
                  いかなる場合にも、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、当該ユーザーIDを登録しているユーザー自身による利用とみなします。
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
