import React from 'react';
import { Button } from '@/components/ui/button';

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
        <div className='w-full max-w-[1280px] flex flex-col gap-10'>
          {/* 白い枠組み（Box）: 特定商取引法に基づく表記 */}
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
              特定商取引法に基づく表記
            </h1>
            {/* 説明文 */}
            <p
              className='w-full text-center font-bold'
              style={{
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
              }}
            >
              株式会社メルセネール（以下「当社」といいます）は、当社が提供するダイレクトリクルーティングサービス（以下「本サービス」といいます）において、ユーザーの個人情報の保護を重要な責務と考え、以下の方針に基づき、個人情報の適切な取得・利用・管理を行います。
            </p>
            {/* 販売事業者以降の表記 */}
            <div
              className='flex flex-col gap-0'
              style={{ fontSize: '16px', lineHeight: '200%' }}
            >
              <span className='font-bold'>販売事業者</span>メルセネール株式会社
              <br />
              <br />
              <span className='font-bold'>運営責任者</span>大道寺 一慶
              <br />
              <br />
              <span className='font-bold'>所在地</span>〒101-0041
              <br />
              東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル
              <br />
              <br />
              <span className='font-bold'>電話番号</span>
              [03-XXXX-XXXX]（受付時間：平日10:00～18:00）
              <br />
              <br />
              <span className='font-bold'>メールアドレス</span>
              [info@mercenaire.jp]
              <br />
              <br />
              <span className='font-bold'>販売価格</span>
              各サービスページに記載しております。
              <br />
              <br />
              <span className='font-bold'>商品代金以外の必要料金</span>
              消費税、振込手数料（銀行振込の場合）
              <br />
              <br />
              <span className='font-bold'>支払方法と支払時期</span>
              ・クレジットカード決済：ご注文時にお支払いが確定します。
              <br />
              ・銀行振込：ご注文後7日以内にお振込みください。
              <br />
              <br />
              <span className='font-bold'>サービス提供時期</span>
              お支払い確認後、速やかにサービス提供を開始いたします。
              <br />
              <br />
              <span className='font-bold'>キャンセル・返品について</span>
              サービスの性質上、提供開始後のキャンセル・返金はお受けできません。ただし、提供前であればキャンセル可能です。
              <br />
              <br />
              <span className='font-bold'>動作環境</span>
              インターネット接続環境が必要です。詳細は各サービスページをご確認ください。
              <br />
              <br />
              <span className='font-bold'>特別な販売条件</span>
              特定のキャンペーンや期間限定サービスについては、各サービスページにて条件を明記しております。
              <br />
            </div>
          </div>
          {/* 2つ目の白い枠組み（Box）: 職業安定法に基づく表示 */}
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
              職業安定法に基づく表示
            </h1>
            {/* テキスト本文: フォントサイズ16px, 行間200%, 文字間隔0.1em, 幅100% */}
            <p
              className='w-full text-center font-bold'
              style={{
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
              }}
            >
              株式会社メルセネール（以下「当社」といいます）は、職業安定法および関連法令に基づき、以下の事項を表示いたします。
            </p>
            {/* 1.〜5. 各セクションをdivで囲み、gap-20で80pxの余白をつける */}
            <div
              className='flex flex-col gap-20'
              style={{ fontSize: '16px', lineHeight: '200%' }}
            >
              <div>
                <h2
                  className='font-bold'
                  style={{
                    fontSize: '24px',
                    lineHeight: '160%',
                    letterSpacing: '0.1em',
                    marginBottom: '16px',
                  }}
                >
                  1. 事業者情報
                </h2>
                <span className='font-bold'>事業者名</span>
                <br />
                株式会社メルセネール
                <br />
                <span className='font-bold'>所在地</span>
                <br />
                〒101-0041 東京都千代田区神田須田町1丁目32番地
                <br />
                <span className='font-bold'>代表者</span>
                <br />
                代表取締役 [代表者名]
                <br />
                <span className='font-bold'>連絡先</span>
                <br />
                電話番号：03-XXXX-XXXX（平日10:00～18:00）
                <br />
                メールアドレス：info@mercenaire.jp
                <br />
              </div>
              <div>
                <h2
                  className='font-bold'
                  style={{
                    fontSize: '24px',
                    lineHeight: '160%',
                    letterSpacing: '0.1em',
                    marginBottom: '16px',
                  }}
                >
                  2. 有料職業紹介事業の許可について
                </h2>
                当社は、以下の許可を受けて有料職業紹介事業を運営しています。
                <br />
                <span className='font-bold'>許可番号</span>
                <br />
                [13-ユ-○○○○○○]
                <br />
                <span className='font-bold'>許可年月日</span>
                <br />
                [取得日を記載]
                <br />
                <span className='font-bold'>許可の有効期間</span>
                <br />
                [有効期間を記載]
                <br />
                <span className='font-bold'>
                  取扱職種の範囲および業務の範囲
                </span>
                <br />
                全職種（国内）
                <br />
              </div>
              <div>
                <h2
                  className='font-bold'
                  style={{
                    fontSize: '24px',
                    lineHeight: '160%',
                    letterSpacing: '0.1em',
                    marginBottom: '16px',
                  }}
                >
                  3. 手数料に関する事項
                </h2>
                <span className='font-bold'>候補者からの手数料</span>
                <br />
                候補者の方から職業紹介手数料をいただくことはありません。
                <br />
                <span className='font-bold'>求人企業からの手数料</span>
                <br />
                求人企業様より、職業紹介に伴う成果報酬（採用決定時）等をいただく場合があります。詳細は契約書面にてご案内いたします。
                <br />
              </div>
              <div>
                <h2
                  className='font-bold'
                  style={{
                    fontSize: '24px',
                    lineHeight: '160%',
                    letterSpacing: '0.1em',
                    marginBottom: '16px',
                  }}
                >
                  4. 個人情報の取り扱いについて
                </h2>
                当社は、候補者および求人企業から取得した個人情報について、関連法令および「プライバシーポリシー」に則り、適正かつ安全に取り扱います。
                <br />
                詳しくは、当社のプライバシーポリシーをご覧ください。
                <br />
              </div>
              <div>
                <h2
                  className='font-bold'
                  style={{
                    fontSize: '24px',
                    lineHeight: '160%',
                    letterSpacing: '0.1em',
                    marginBottom: '16px',
                  }}
                >
                  5. その他
                </h2>
                ・当社のサービスは、職業安定法および労働関係法令に準拠して運営されています。
                <br />
                ・虚偽の求人情報や誤認を招く表現の排除に努め、常に正確かつ公正な求人情報の提供に取り組んでいます。
                <br />
                ・職業紹介業務に関するご質問・ご相談は、上記の連絡先までご連絡ください。
                <br />
              </div>
            </div>
          </div>
          {/* トップに戻るボタン */}
          <div className='flex justify-center mt-10'>
            <Button
              variant='green-gradient'
              size='lg'
              className='rounded-[32px]'
            >
              トップに戻る
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
