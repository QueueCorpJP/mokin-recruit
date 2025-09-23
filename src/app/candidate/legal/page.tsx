import React from 'react';

export default function LegalPage() {
  return (
    <>
      {/* メインコンテンツラッパー（背景色F9F9F9） */}
      <div
        className='pt-10 px-20 pb-20 flex justify-center w-full'
        style={{ background: '#F9F9F9' }}
      >
        <div className='w-full max-w-[1280px]'>
          {/* 白い枠組み（Box）: 幅100%、padding 80px、背景白、角丸10px、カスタムシャドウ、flex縦並び・gap 40px */}
          <div
            className='w-full bg-white flex flex-col gap-10'
            style={{
              borderRadius: '10px',
              boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
              padding: '80px',
            }}
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
              職業安定法に基づく表記
            </h1>

            {/* 職業安定法に基づく表記本文 */}
            <div
              className='w-full'
              style={{
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
              }}
            >
              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>事業者名</h3>
                <p>メルセネール株式会社</p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>代表者名</h3>
                <p>代表取締役　大道寺 一慶</p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>所在地</h3>
                <p>
                  〒101-0041
                  <br />
                  東京都千代田区神田須田町１丁目32番地
                </p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>電話番号</h3>
                <p>03‐3518‐5519</p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  有料職業紹介事業許可番号
                </h3>
                <p>13-ユ-318099</p>
              </div>

              <div className='w-full h-px bg-gray-300 my-8'></div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  求職者からの手数料について
                </h3>
                <p>
                  本サービスにおいて、求職者から手数料を徴収することは一切ありません。
                </p>
              </div>

              <div className='w-full h-px bg-gray-300 my-8'></div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>求人情報に関する事項</h3>
                <ul className='list-disc pl-6 space-y-1'>
                  <li>
                    求人票には「掲載開始日」または「最終更新日」を表示しています。
                  </li>
                  <li>
                    求人情報は、当社のガイドラインに基づき審査のうえ掲載しています。
                  </li>
                  <li>
                    求人内容に虚偽または誤解を招く表記がないよう、適正表示を徹底しています。
                  </li>
                  <li>
                    労働基準法その他関連法令に違反する内容の求人は掲載いたしません。
                  </li>
                </ul>
              </div>

              <div className='w-full h-px bg-gray-300 my-8'></div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  求職者情報に関する事項
                </h3>
                <ul className='list-disc pl-6 space-y-1'>
                  <li>求職者プロフィールには「更新日」を表示しています。</li>
                  <li>
                    登録内容に変更が生じた場合、求職者は速やかに情報を更新いただく必要があります。
                  </li>
                  <li>
                    プロフィール情報の正確性・最新性を保つため、必要に応じて当社から更新依頼を行う場合があります。
                  </li>
                  <li>
                    求職者の選考状況や他社応募状況について、本人の明示的同意を得た場合に限り、企業会員に提供することがあります。
                  </li>
                </ul>
              </div>

              <div className='w-full h-px bg-gray-300 my-8'></div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>情報の管理について</h3>
                <ul className='list-disc pl-6 space-y-1'>
                  <li>
                    当社は、求人情報および求職者情報が正確かつ最新であるよう適正に管理します。
                  </li>
                  <li>
                    登録いただいた個人情報は、当社プライバシーポリシーに基づき安全に管理いたします。
                  </li>
                </ul>
              </div>

              <div className='w-full h-px bg-gray-300 my-8'></div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>表示順位に関する事項</h3>
                <p className='mb-3'>
                  求人情報や求職者情報の検索結果表示順位は、以下の要素を総合的に勘案して決定しています。
                </p>
                <ul className='list-disc pl-6 space-y-1'>
                  <li>求人の業種・職種・勤務地等の条件</li>
                  <li>求職者の経歴・スキル・希望条件</li>
                  <li>
                    サービスの利用状況（応募・スカウト、ログイン状況など）
                  </li>
                </ul>
              </div>

              <div className='w-full h-px bg-gray-300 my-8'></div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>返戻金制度について</h3>
                <p className='mb-2'>
                  企業から受領する成果報酬の返戻制度については、企業向け利用規約（※リンク）および個別契約書に記載しています。
                </p>
                <p>求職者からの返金は発生しません。</p>
              </div>

              <div className='w-full h-px bg-gray-300 my-8'></div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>苦情・ご相談窓口</h3>
                <p className='mb-3'>
                  サービスに関する苦情・ご相談は以下よりご連絡ください。
                </p>
                <ul className='list-disc pl-6 space-y-1'>
                  <li>電話：03‐3518‐5519</li>
                  <li>メール：support@cuepoint.jp</li>
                  <li>お問い合わせフォーム：※フォームURL</li>
                  <li>受付時間：平日10:00〜18:00（当社休業日を除く）</li>
                </ul>
              </div>

              <div className='mt-8 pt-6 border-t border-gray-200'>
                <p className='text-center'>
                  制定日：2025年11月1日
                  <br />
                  最終更新日：2025年11月1日
                  <br />
                  メルセネール株式会社
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
