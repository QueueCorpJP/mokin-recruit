import dynamic from 'next/dynamic';
import React from 'react';
import { Input } from '@/components/ui/input';
import { SelectInput } from '@/components/ui/select-input'; // Added import for SelectInput
import { Button } from '@/components/ui/button';
import CtaGuideSection from '@/components/cta/CtaGuideSection';
// BookIcon, QuestionIconのimportは削除

// ナビゲーションとフッターを遅延読み込み（dynamic import）
const AuthAwareNavigation = dynamic(
  () =>
    import('@/components/layout/AuthAwareNavigation').then(mod => ({
      default: mod.AuthAwareNavigation,
    })),
  {
    loading: () => (
      <div className='h-[80px] bg-white border-b border-gray-200' />
    ),
  }
);
const AuthAwareFooter = dynamic(
  () =>
    import('@/components/layout/AuthAwareFooter').then(mod => ({
      default: mod.AuthAwareFooter,
    })),
  { loading: () => <div className='min-h-[200px] bg-[#323232]' /> }
);

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
          className='w-full max-w-[800px]'
          // max-w-[800px]: 最大幅800px, w-full: 画面幅に合わせて広がる
        >
          {/* 白い枠組み（Box）: 幅100%、padding 80px、背景白、角丸10px、カスタムシャドウ、flex縦並び・gap 40px */}
          <div
            className='w-full bg-white flex flex-col gap-10'
            style={{
              borderRadius: '10px',
              boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
              padding: '80px 87px', // 上下80px, 左右87px
            }}
            // borderRadius: 10px
            // boxShadow: X=0, Y=0, blur=20px, 色: #000000 5%
            // padding: 80px
            // flex flex-col: 縦並び
            // gap-10: 要素間の縦gap 40px
          >
            {/* h1とpを1つのdivでラップし、24pxの間隔・中央揃え・太字にする */}
            <div className='flex flex-col items-center gap-6 w-full'>
              <h1
                className='w-full font-bold text-center'
                style={{
                  fontSize: '32px',
                  lineHeight: '160%',
                  color: '#0F9058',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                お問い合わせ／申請
              </h1>
              <p
                className='w-full font-bold text-center'
                style={{
                  fontSize: '16px',
                  lineHeight: '200%',
                  letterSpacing: '0.1em',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                ご質問、お問い合わせは下記フォームよりご連絡ください。
                <br />
                サービスに登録されているメールアドレス宛に担当者よりご返信いたします。
              </p>
            </div>
            {/* 企業名・お名前行をまとめて24px間隔で縦並び */}
            <div className='flex flex-col gap-6 w-full'>
              <div className='flex w-full justify-end'>
                <div className='flex flex-row items-center gap-4'>
                  {/* ラベル: 可変幅, bold, 16px */}
                  <span
                    className='font-bold text-right'
                    style={{
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      display: 'block',
                    }}
                  >
                    企業名
                  </span>
                  {/* 値: 400px幅, left寄せ, normal */}
                  <span
                    className='font-normal'
                    style={{
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      width: '400px',
                      textAlign: 'left',
                      display: 'block',
                    }}
                  >
                    株式会社サンプル
                  </span>
                </div>
              </div>
              <div className='flex w-full justify-end'>
                <div className='flex flex-row items-center gap-4'>
                  {/* ラベル: 可変幅, bold, 16px */}
                  <span
                    className='font-bold text-right'
                    style={{
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      display: 'block',
                    }}
                  >
                    お名前
                  </span>
                  {/* 値: 400px幅, left寄せ, normal */}
                  <span
                    className='font-normal'
                    style={{
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      width: '400px',
                      textAlign: 'left',
                      display: 'block',
                    }}
                  >
                    山田 太郎
                  </span>
                </div>
              </div>
              {/* グループ・お問い合わせ種別・追加購入するチケット枚数行をまとめて24px間隔で縦並び */}
              <div className='flex flex-col gap-6 w-full'>
                <div className='flex w-full justify-end'>
                  <div className='flex flex-row items-center gap-4'>
                    {/* ラベル: 可変幅, bold, 16px */}
                    <span
                      className='font-bold text-right'
                      style={{
                        fontSize: '16px',
                        lineHeight: '200%',
                        letterSpacing: '0.1em',
                        display: 'block',
                      }}
                    >
                      グループ
                    </span>
                    {/* 値: 400px幅, SelectInput, 高さ54px */}
                    <SelectInput
                      options={[
                        { value: '', label: '選択してください' },
                        { value: 'group1', label: 'グループ1' },
                        { value: 'group2', label: 'グループ2' },
                        { value: 'group3', label: 'グループ3' },
                      ]}
                      placeholder='選択してください'
                      className='w-[400px] h-[54px]'
                      style={{ width: '400px', height: '54px' }}
                    />
                  </div>
                </div>
                <div className='flex w-full justify-end'>
                  <div className='flex flex-row items-center gap-4'>
                    {/* ラベル: 可変幅, bold, 16px */}
                    <span
                      className='font-bold text-right'
                      style={{
                        fontSize: '16px',
                        lineHeight: '200%',
                        letterSpacing: '0.1em',
                        display: 'block',
                      }}
                    >
                      お問い合わせ種別
                    </span>
                    {/* 値: 400px幅, SelectInput, 高さ54px */}
                    <SelectInput
                      options={[
                        { value: '', label: '選択してください' },
                        { value: 'general', label: '一般問い合わせ' },
                        { value: 'support', label: 'サポート' },
                        { value: 'feedback', label: 'ご意見・ご要望' },
                      ]}
                      placeholder='選択してください'
                      className='w-[400px] h-[54px]'
                      style={{ width: '400px', height: '54px' }}
                    />
                  </div>
                </div>
                <div className='flex w-full justify-end'>
                  <div className='flex flex-row items-center gap-4'>
                    {/* ラベル: 可変幅, bold, 16px, letterSpacing: 0.09em */}
                    <span
                      className='font-bold text-right'
                      style={{
                        fontSize: '16px',
                        lineHeight: '200%',
                        letterSpacing: '0.09em',
                        display: 'block',
                      }}
                    >
                      追加購入するチケット枚数
                    </span>
                    {/* 値: 400px幅, input(376px/54px) + 8px + 枚 */}
                    <div
                      className='flex flex-row items-center'
                      style={{ width: '400px', height: '54px' }}
                    >
                      <Input
                        type='number'
                        min={1}
                        className='font-normal'
                        style={{
                          width: '376px',
                          height: '54px',
                          fontSize: '16px',
                          lineHeight: '200%',
                          letterSpacing: '0.09em',
                          fontWeight: 'normal',
                          color: '#323232',
                          border: '1px solid #999999',
                          outline: 'none',
                          background: 'none',
                          boxShadow: 'none',
                        }}
                      />
                      <span
                        className='flex items-center justify-center font-bold'
                        style={{
                          width: '16px',
                          height: '54px',
                          marginLeft: '8px',
                          fontSize: '16px',
                          lineHeight: '54px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        枚
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex w-full justify-end'>
                <div className='flex flex-row items-start gap-4'>
                  {/* ラベル: 可変幅, bold, 16px */}
                  <span
                    className='font-bold text-right'
                    style={{
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      display: 'block',
                      marginTop: '11px',
                    }}
                  >
                    お問い合わせ内容
                  </span>
                  {/* 値: 400px幅, テキストエリア, 高さ147px, 上揃え, 角丸5px */}
                  <textarea
                    style={{
                      width: '400px',
                      height: '147px',
                      fontSize: '16px',
                      lineHeight: '200%',
                      letterSpacing: '0.1em',
                      fontWeight: 'normal',
                      color: '#323232',
                      border: '1px solid #999999',
                      outline: 'none',
                      background: 'none',
                      boxShadow: 'none',
                      resize: 'none',
                      padding: '11px',
                      borderRadius: '5px',
                    }}
                  />
                </div>
              </div>
            </div>
            {/* 送信ボタン: メインカラー, 幅160px, 高さ60px, 中央配置, 丸い角丸 */}
            <div className='flex w-full justify-center mt-10'>
              <Button
                variant='green-gradient'
                style={{
                  width: '160px',
                  height: '60px',
                  borderRadius: '9999px',
                }}
              >
                送信する
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* CTAグラデーションエリア: 幅100%、高さ363px、上#229A4E→下#17856Fの縦グラデーション */}
      <CtaGuideSection />
      {/* フッター（ページ下部） */}
      <AuthAwareFooter />
    </>
  );
}
