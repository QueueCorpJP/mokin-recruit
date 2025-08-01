// --- Figma「履歴書・職務経歴書アップロード」見出し部分＋コンテンツラッパー ---
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * 履歴書・職務経歴書アップロード画面の見出し部分＋コンテンツラッパー
 * Figmaデザイン（node-id: 2533-107837, 2533-107839）に忠実に再現
 */
// --- useMediaQuery: メディアクエリ判定用カスタムフック ---
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export default function CandidateSearchSettingConfirmPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  // --- 追加: モバイル判定 ---
  const isMobile = useMediaQuery('(max-width: 767px)');
  return (
    <div>
      {/* 見出しラッパー：最大高さ156px、padding上下40px・左右80px、グラデーション背景 */}
      <div
        style={{
          maxHeight: 156,
          padding: isMobile ? '24px 16px 16px 16px' : '40px 80px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #17856F 0%, #229A4E 100%)',
        }}
      >
        {isSubmitted ? (
          <>
            {/* パンくずリスト：求人詳細 ＞ 応募完了 */}
            <nav
              aria-label='パンくずリスト'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                justifyContent: 'flex-start',
                width: '100%',
              }}
            >
              <span
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 14 : 14,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                }}
              >
                求人詳細
              </span>
              <span
                style={{
                  color: '#fff',
                  fontSize: isMobile ? 14 : 16,
                  fontWeight: 700,
                }}
              >
                &gt;
              </span>
              <span
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 14 : 16,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                }}
              >
                応募完了
              </span>
            </nav>
            {/* メイン見出し：boad.svg＋応募完了 */}
            <section
              aria-labelledby='complete-heading'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                justifyContent: 'flex-start',
                alignSelf: 'stretch',
              }}
            >
              <img
                src='/images/boad.svg'
                alt='ボードアイコン'
                width={isMobile ? 24 : 32}
                height={isMobile ? 24 : 32}
                style={{ display: 'block' }}
              />
              <h1
                id='complete-heading'
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 20 : 24,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                  margin: 0,
                }}
              >
                応募完了
              </h1>
            </section>
          </>
        ) : (
          <>
            {/* パンくず部分（従来） */}
            <nav
              aria-label='パンくずリスト'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {/* ミニテキスト「求人詳細」 */}
              <span
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 14 : 14,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                }}
              >
                求人詳細
              </span>
              {/* right line SVG（区切り） */}
              <svg
                width='8'
                height='8'
                viewBox='0 0 8 8'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
                focusable='false'
              >
                <path
                  d='M2 1L6 4L2 7'
                  stroke='#fff'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              {/* テキスト１「履歴書・職務経歴書アップロード」 */}
              <span
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 14 : 14,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                }}
              >
                履歴書・職務経歴書アップロード
              </span>
            </nav>
            {/* メイン見出し部分（従来） */}
            <section
              aria-labelledby='upload-heading'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '16px',
                alignSelf: 'stretch',
              }}
            >
              {/* boadアイコン（SVG画像に差し替え） */}
              <img
                src='/images/boad.svg'
                alt='ボードアイコン'
                width={isMobile ? 24 : 32}
                height={isMobile ? 24 : 32}
                style={{ display: 'block' }}
              />
              {/* 大きな見出しテキスト */}
              <h1
                id='upload-heading'
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 20 : 24,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#fff',
                  margin: 0,
                }}
              >
                履歴書・職務経歴書アップロード
              </h1>
            </section>
          </>
        )}
      </div>

      {/* コンテンツ用ラッパー：padding上40px・左右/下80px、背景#f9f9f9 */}
      <div
        style={{
          padding: isMobile ? '24px 16px' : '40px 80px 80px 80px',
          boxSizing: 'border-box',
          background: '#f9f9f9',
        }}
      >
        {/* --- Figma: Frame 2789（角丸10px・白背景・padding:40px・gap:8px） --- */}
        <div
          style={
            isSubmitted
              ? {
                  background: '#fff',
                  borderRadius: 10,
                  padding: isMobile ? 24 : 80,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 40,
                  boxSizing: 'border-box',
                  width: 800,
                  maxWidth: '100%',
                  margin: '0 auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              : {
                  background: '#fff',
                  borderRadius: 10,
                  padding: isMobile ? 24 : 40,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  boxSizing: 'border-box',
                  height: '100%',
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'stretch',
                }
          }
        >
          {isSubmitted ? (
            // --- 応募完了UI（Figma準拠） ---
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
              }}
            >
              <h2
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: isMobile ? 24 : 32,
                  lineHeight: 1.6,
                  letterSpacing: '0.1em',
                  color: '#0F9058',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                応募完了
              </h2>
              <div
                style={{
                  width: isMobile ? 160 : 240,
                  height: isMobile ? 160 : 240,
                  padding: isMobile ? '24px 0' : '51px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label='応募完了イメージ'
              >
                {/* TODO: Figma面談イラストSVGをここに配置（alt="応募完了イメージ"） */}
                <img
                  src='/images/complete.svg'
                  alt='応募完了イメージ'
                  width={isMobile ? 160 : 240}
                  height={isMobile ? 160 : 240}
                  style={{ display: 'block', margin: '0 auto' }}
                />
              </div>
              <p
                style={{
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: isMobile ? 1.8 : 2,
                  letterSpacing: '0.1em',
                  color: '#323232',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                求人への応募を完了しました。
                <br />
                企業からの返信をお待ちください。
              </p>
            </div>
          ) : (
            <>
              {/* 見出し+説明（中央寄せ、16px太字、2em、#323232） */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 24,
                  width: '100%',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: 16,
                    lineHeight: 2,
                    letterSpacing: '0.1em',
                    color: '#323232',
                    margin: 0,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  本求人に応募する場合は、「応募する」ボタンをクリックしてください。
                  <br />
                  書類の提出が必要な求人に関しては、書類をアップロードした上で応募しましょう。
                </p>
              </div>
              {/* --- アップロード行2列（履歴書・職務経歴書）→1列に修正 --- */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  width: '100%',
                  marginTop: 24,
                }}
              >
                {/* 履歴書アップロード行 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 10,
                    flex: 1,
                  }}
                >
                  {/* ラベル部 */}
                  <div
                    style={{
                      background: '#F9F9F9',
                      borderRadius: 5,
                      height: isMobile ? 'auto' : 176,
                      width: isMobile ? '100%' : 200,
                      padding: isMobile ? '8px 16px' : '0 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Noto Sans JP',
                        fontWeight: 700,
                        fontSize: 16,
                        lineHeight: 2,
                        letterSpacing: '0.1em',
                        color: '#323232',
                      }}
                    >
                      履歴書
                    </span>
                  </div>
                  {/* アップロードUI部（Buttonに置き換え） */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      justifyContent: 'center',
                      flex: 1,
                      padding: isMobile ? 0 : '24px 0',
                    }}
                  >
                    <div
                      style={{ display: 'flex', flexDirection: 'row', gap: 16 }}
                    >
                      <Button
                        variant='green-outline'
                        size='figma-default'
                        className='h-[50px] px-[40px] rounded-[999px] font-bold tracking-[0.1em] border-[1px] border-[#999] text-[16px] text-[#323232] leading-[2] shadow-none'
                        style={{
                          width: isMobile ? '100%' : undefined,
                          padding: '0 40px',
                        }}
                      >
                        履歴書をアップロード
                      </Button>
                    </div>
                    <span
                      style={{
                        fontFamily: 'Noto Sans JP',
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: 1.6,
                        letterSpacing: '0.1em',
                        color: '#999',
                      }}
                    >
                      ※5MB内のPDFのみアップロードが可能です。
                    </span>
                  </div>
                </div>
                {/* 職務経歴書アップロード行 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 10,
                    flex: 1,
                  }}
                >
                  {/* ラベル部 */}
                  <div
                    style={{
                      background: '#F9F9F9',
                      borderRadius: 5,
                      height: isMobile ? 'auto' : 176,
                      width: isMobile ? '100%' : 200,
                      padding: isMobile ? '8px 16px' : '0 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Noto Sans JP',
                        fontWeight: 700,
                        fontSize: 16,
                        lineHeight: 2,
                        letterSpacing: '0.1em',
                        color: '#323232',
                      }}
                    >
                      職務経歴書
                    </span>
                  </div>
                  {/* アップロードUI部（Buttonに置き換え） */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      justifyContent: 'center',
                      flex: 1,
                      padding: isMobile ? 0 : '24px 0',
                    }}
                  >
                    <div
                      style={{ display: 'flex', flexDirection: 'row', gap: 16 }}
                    >
                      <Button
                        variant='green-outline'
                        size='figma-default'
                        className='h-[50px] px-[40px] rounded-[999px] font-bold tracking-[0.1em] border-[1px] border-[#999] text-[16px] text-[#323232] leading-[2] shadow-none'
                        style={{
                          width: isMobile ? '100%' : undefined,
                          padding: '0 40px',
                        }}
                      >
                        職務経歴書をアップロード
                      </Button>
                    </div>
                    <span
                      style={{
                        fontFamily: 'Noto Sans JP',
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: 1.6,
                        letterSpacing: '0.1em',
                        color: '#999',
                      }}
                    >
                      ※5MB内のPDFのみアップロードが可能です。
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {/* --- Figma準拠：戻る・応募するボタン横並び（幅160px・高さ60px固定） --- */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'center',
              gap: 16,
              margin: isMobile ? '24px 0 40px 0' : 40,
            }}
          >
            <Button
              style={{
                width: isMobile ? '100%' : undefined,
                height: 60,
                borderRadius: 32,
                border: '1px solid #0F9058',
                background: 'transparent',
                color: '#0F9058',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontSize: 16,
                lineHeight: '2em',
                letterSpacing: '0.1em',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 40px',
              }}
              {...(isSubmitted ? {} : { onClick: undefined })}
            >
              {isSubmitted ? 'メッセージ一覧' : '戻る'}
            </Button>
            <Button
              style={{
                width: isMobile ? '100%' : undefined,
                height: 60,
                borderRadius: 32,
                background: 'linear-gradient(180deg, #198D76 0%, #1CA74F 100%)',
                color: '#fff',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontSize: 16,
                lineHeight: '2em',
                letterSpacing: '0.1em',
                boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.15)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 40px',
              }}
              onClick={isSubmitted ? undefined : () => setIsSubmitted(true)}
            >
              {isSubmitted ? '求人検索' : '応募する'}
            </Button>
          </div>
        </div>
      </div>

      {/* --- 既存の応募確認UIは一旦コメントアウト --- */}
      {/**
      ... ここに既存の応募内容確認UI ...
      */}
    </div>
  );
}