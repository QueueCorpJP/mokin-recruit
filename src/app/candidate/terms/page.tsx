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
              CuePoint プライバシーポリシー
            </h1>{' '}
            {/* プライバシーポリシー本文 */}
            <div
              className='w-full'
              style={{
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
              }}
            >
              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>1. 個人情報の定義</h3>
                <p>
                  本プライバシーポリシーにおいて「個人情報」とは、個人情報保護法に定める個人情報を指し、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合でき、それにより特定の個人を識別できるものを含みます）をいいます。
                </p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  2. 個人情報の収集項目
                </h3>
                <p className='mb-3'>
                  当社は、以下の個人情報を取得する場合があります。
                </p>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    2.1 求職者から直接収集する情報
                  </h4>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>氏名、年齢、性別、生年月日</li>
                    <li>連絡先（電話番号、メールアドレス、住所）</li>
                    <li>職務経歴、学歴、資格、スキル</li>
                    <li>転職希望条件（職種、勤務地、年収等）</li>
                    <li>その他求職活動に関連する情報</li>
                  </ul>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    2.2 サービス利用時に自動的に収集される情報
                  </h4>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>IPアドレス、ブラウザ情報、OS情報</li>
                    <li>アクセス日時、参照元URL</li>
                    <li>
                      サービス内での行動履歴（ページ閲覧、スカウト開封等）
                    </li>
                    <li>Cookie及び類似技術による情報</li>
                  </ul>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    2.3 企業会員から収集する情報
                  </h4>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>法人名、担当者氏名、連絡先</li>
                    <li>求人情報、採用担当者情報</li>
                    <li>サービス利用履歴、課金情報</li>
                  </ul>
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  3. 個人情報の利用目的
                </h3>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>3.1 求職者に対して</h4>
                  <ol className='list-decimal pl-6 space-y-1'>
                    <li>会員登録・管理、本人確認</li>
                    <li>CuePointサービスの提供（求人紹介、スカウト送信等）</li>
                    <li>企業会員への情報提供（後述の条件に基づく）</li>
                    <li>サービス改善・新機能開発</li>
                    <li>カスタマーサポート・問い合わせ対応</li>
                    <li>利用規約違反の調査・対応</li>
                    <li>法令に基づく対応</li>
                  </ol>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    3.2 企業会員に対して
                  </h4>
                  <ol className='list-decimal pl-6 space-y-1'>
                    <li>アカウント管理、契約管理</li>
                    <li>サービス提供、課金・請求業務</li>
                    <li>求職者情報の提供</li>
                    <li>サービス改善・分析</li>
                    <li>カスタマーサポート・問い合わせ対応</li>
                  </ol>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>3.3 共通目的</h4>
                  <ol className='list-decimal pl-6 space-y-1'>
                    <li>サイト・アプリの利用状況分析</li>
                    <li>セキュリティ対策・不正利用防止</li>
                    <li>法的義務の履行</li>
                    <li>
                      募集情報等提供事業者として、求人・求職者情報の正確性確保と更新日明示
                    </li>
                    <li>求人情報やスカウトメッセージの表示順位決定</li>
                    <li>上記に付随する業務遂行</li>
                  </ol>
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  4. 個人情報の第三者提供
                </h3>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    4.1 企業会員への情報提供（段階的開示）
                  </h4>
                  <div className='mb-3'>
                    <p className='font-bold'>応募前段階：</p>
                    <ul className='list-disc pl-6 space-y-1'>
                      <li>
                        応募前の段階では、当社は企業会員に対して求職者の氏名・連絡先を提供しません。
                      </li>
                      <li>
                        年齢、職務経歴、スキル、希望条件等の情報を匿名化した上で企業会員に提供します。
                      </li>
                    </ul>
                    <p className='mt-2'>
                      選考状況、他社応募状況については、マイページ画面等により求職者の明示的同意を取得した場合に限り提供します。
                    </p>
                  </div>
                  <div className='mb-3'>
                    <p className='font-bold'>応募・スカウト返信後：</p>
                    <ul className='list-disc pl-6 space-y-1'>
                      <li>
                        求職者が応募またはスカウトメッセージに返信した場合、当社は当該企業会員に対し、氏名・連絡先その他応募に必要な個人情報を提供します。
                      </li>
                      <li>
                        選考状況、他社応募状況については、マイページ画面等により求職者の明示的同意を取得した場合に限り提供します。
                      </li>
                    </ul>
                  </div>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    4.2 その他の第三者提供
                  </h4>
                  <p className='mb-2'>
                    以下の場合に限り、求職者の同意なく個人情報を第三者に提供することがあります。
                  </p>
                  <ol className='list-decimal pl-6 space-y-1'>
                    <li>法令に基づく場合</li>
                    <li>
                      人の生命、身体または財産の保護のために必要がある場合
                    </li>
                    <li>
                      公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合
                    </li>
                    <li>
                      国の機関等の法令の定める事務の遂行に協力する必要がある場合
                    </li>
                  </ol>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    4.3 業務委託先への提供
                  </h4>
                  <p className='mb-2'>
                    当社は、業務の一部を外部に委託する場合があります。この場合、適切な監督を行い、秘密保持契約を締結した上で必要最小限の個人情報を提供します。
                  </p>
                  <p>
                    業務委託先に対しては、必要に応じて監査や報告を求め、契約終了時には提供した情報を確実に消去させます。
                  </p>
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  5. Cookie・類似技術の利用
                </h3>
                <p className='mb-2'>
                  当社は、サービスの利便性向上、利用状況の分析、広告配信の最適化及びセキュリティ確保のため、Cookie、Webビーコンその他の類似技術を利用する場合があります。
                </p>
                <p>
                  利用者はブラウザの設定によりCookieの受け入れを拒否することができますが、その場合、サービスの一部が利用できなくなることがあります。
                </p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  6. 個人情報の開示・訂正・削除等
                </h3>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>6.1 開示請求</h4>
                  <p>
                    保有個人情報の利用目的、第三者提供の有無等の開示を求めることができます。
                  </p>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    6.2 訂正・追加・削除請求
                  </h4>
                  <p>
                    保有個人情報に事実の誤りがある場合、訂正・追加・削除を求めることができます。
                  </p>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    6.3 利用停止・消去請求
                  </h4>
                  <p>
                    保有個人情報が目的外利用や不正取得されている場合、利用停止・消去を求めることができます。ただし、法令に基づき保存義務がある情報、または業務の適正な遂行に著しく支障を及ぼす場合は、この限りではありません。
                  </p>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>6.4 請求方法</h4>
                  <p className='mb-2'>
                    上記請求は、本人確認を行った上で、以下の窓口にて承ります。
                  </p>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>メール：support@cuepoint.jp</li>
                    <li>電話：03-3518-5519</li>
                    <li>受付時間：平日10:00〜18:00</li>
                  </ul>
                  <p className='mt-2'>
                    開示請求については、原則として2週間以内に回答いたします。手数料は無料です。
                  </p>
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  7. 個人情報の保持期間
                </h3>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>7.1 求職者情報</h4>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>会員登録中：サービス提供に必要な期間</li>
                    <li>退会後：1年間（法定保存義務がある場合を除く）</li>
                  </ul>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>7.2 企業会員情報</h4>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>契約期間中及び契約終了後3年間</li>
                  </ul>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>7.3 アクセスログ等</h4>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>6か月間（セキュリティ対策のため）</li>
                  </ul>
                </div>

                <p>保存期間経過後は、安全な方法で削除いたします。</p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>8. セキュリティ対策</h3>
                <p className='mb-3'>
                  当社は、個人情報の漏えい、滅失、毀損等を防止するため、次のような安全管理措置を適切に講じています。
                </p>

                <div className='mb-3'>
                  <h4 className='text-lg font-bold mb-1'>
                    1. 組織的安全管理措置
                  </h4>
                  <p>
                    個人情報保護責任者を設置し、取扱規定に基づき管理・監督を行います。
                  </p>
                </div>

                <div className='mb-3'>
                  <h4 className='text-lg font-bold mb-1'>
                    2. 人的安全管理措置
                  </h4>
                  <p>
                    従業員に対し定期的に研修を行い、秘密保持契約等により適切な取扱いを徹底します。
                  </p>
                </div>

                <div className='mb-3'>
                  <h4 className='text-lg font-bold mb-1'>
                    3. 物理的安全管理措置
                  </h4>
                  <p>
                    入退室管理、機器・媒体の施錠保管等により、不正なアクセスや盗難を防止します。
                  </p>
                </div>

                <div className='mb-3'>
                  <h4 className='text-lg font-bold mb-1'>
                    4. 技術的安全管理措置
                  </h4>
                  <p>
                    アクセス制御、パスワード管理、暗号化通信、不正アクセス防止策など、合理的に必要な技術的対策を実施します。
                  </p>
                </div>

                <p>
                  当社は、これらの措置を定期的に見直し、継続的な改善に努めます。
                </p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  9. 個人情報漏えい等の対応
                </h3>
                <p className='mb-2'>
                  個人情報の漏えい、滅失または毀損等が発生した場合、以下の対応を行います。
                </p>
                <ol className='list-decimal pl-6 space-y-1'>
                  <li>事実関係の調査・被害拡大防止措置</li>
                  <li>影響を受ける可能性のある本人への通知</li>
                  <li>個人情報保護委員会等への報告</li>
                  <li>再発防止策の策定・実施</li>
                </ol>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  10. 外部送信に関する事項
                </h3>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    10.1 Google Analytics
                  </h4>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>送信先事業者： Google LLC</li>
                    <li>
                      送信される情報：
                      IPアドレス、ページ閲覧履歴、デバイス情報、ブラウザ情報等
                    </li>
                    <li>利用目的： アクセス解析、サービス改善</li>
                    <li>
                      オプトアウト方法：Googleアナリティクス
                      オプトアウト（https://tools.google.com/dlpage/gaoptout?hl=ja）
                    </li>
                  </ul>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>10.2 Google広告</h4>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>送信先事業者： Google LLC</li>
                    <li>
                      送信される情報：
                      閲覧ページ、コンバージョンデータ、Cookie、IPアドレス等
                    </li>
                    <li>利用目的： 広告配信、効果測定、最適化</li>
                    <li>
                      オプトアウト方法：
                      Google広告の設定（https://www.google.com/settings/ads）
                    </li>
                  </ul>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    10.3 Cookie同意管理
                  </h4>
                  <p className='mb-2'>
                    当社ウェブサイトでは、初回アクセス時にCookieバナーを表示し、以下の選択肢を提供します。
                  </p>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>同意する： 全てのCookieの利用に同意</li>
                    <li>拒否する： 必要最小限のCookieのみ利用</li>
                    <li>設定する： 用途別にCookieの利用可否を選択</li>
                  </ul>
                  <p className='mt-2'>
                    一度設定した内容は、設定画面からいつでも変更可能です。
                  </p>
                </div>

                <div className='mb-4'>
                  <h4 className='text-lg font-bold mb-2'>
                    10.4 その他の外部送信
                  </h4>
                  <p>
                    現時点で上記以外の外部送信サービスは利用していません。将来、上記以外の外部サービスを利用する場合には、本ポリシーを更新し、事前に通知いたします。
                  </p>
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>11. 国際移転</h3>
                <p>
                  現時点では個人情報の国外移転は行っておりません。将来、国外事業者（例：米国・EU拠点のクラウドサービス提供者）のサービスを利用する場合には、個人情報保護法第28条に基づき、当該事業者の個人情報保護体制を確認した上で、適切な安全管理措置を講じて移転を行います。
                </p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  12. 個人情報保護責任者
                </h3>
                <p className='mb-2'>個人情報保護責任者： 取締役 渡辺 貴明</p>
                <p>※連絡先は「14. お問い合わせ窓口」と同じです。</p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>
                  13. プライバシーポリシーの変更
                </h3>
                <p>
                  本プライバシーポリシーを変更する場合は、当社ウェブサイトに掲載することにより通知いたします。重要な変更については、30日前までに通知いたします。
                </p>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>14. お問い合わせ窓口</h3>
                <div className='mb-2'>
                  <p className='font-bold'>
                    メルセネール株式会社 お問い合わせ窓口
                  </p>
                </div>
                <ul className='list-disc pl-6 space-y-1'>
                  <li>メール：support@cuepoint.jp</li>
                  <li>電話：03-3518-5519</li>
                  <li>受付時間：平日10:00〜18:00（当社休業日を除く）</li>
                </ul>
              </div>

              <div className='mb-6'>
                <h3 className='text-xl font-bold mb-3'>15. 事業者情報</h3>
                <ul className='list-none space-y-1'>
                  <li>事業者名： メルセネール株式会社</li>
                  <li>代表者： 代表取締役 大道寺 一慶</li>
                  <li>
                    所在地： 〒101-0041 東京都千代田区神田須田町１丁目32番地
                  </li>
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
