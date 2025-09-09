import React from 'react';

export default function CtaGuideSection() {
  return (
    <div
      style={{
        width: '100%',
        height: '363px',
        background: 'linear-gradient(180deg, #229A4E 0%, #17856F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px',
      }}
    >
      {/* 直径3000pxの円SVG: 上端が173px離れるよう中央配置、グラデーション */}
      <svg
        width='3000'
        height='3000'
        viewBox='0 0 3000 3000'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        style={{
          position: 'absolute',
          top: '173px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient
            id='ctaCircleGradient'
            x1='1500'
            y1='0'
            x2='1500'
            y2='3000'
            gradientUnits='userSpaceOnUse'
          >
            <stop offset='0%' stopColor='#1CA74F' />
            <stop offset='100%' stopColor='#198D76' />
          </linearGradient>
        </defs>
        <circle cx='1500' cy='1500' r='1500' fill='url(#ctaCircleGradient)' />
      </svg>
      {/* CTAタイトル・サブテキスト: 縦並びで中央揃え */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          zIndex: 1,
          position: 'relative',
        }}
      >
        <h1
          className='w-full font-bold text-center'
          style={{
            fontSize: '32px',
            lineHeight: '160%',
            color: '#FFF',
            fontWeight: 'bold',
            textAlign: 'center',
            zIndex: 1,
            margin: 0,
          }}
        >
          よくある質問・ご利用ガイド
        </h1>
        <p
          className='w-full font-bold text-center'
          style={{
            fontSize: '16px',
            lineHeight: '200%',
            letterSpacing: '0.1em',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#FFF',
            marginTop: '24px',
            marginBottom: 0,
            zIndex: 1,
          }}
        >
          お問い合わせの前に、よくあるご質問やご利用ガイドもぜひご活用ください。
        </p>
        {/* アイコン付きボタン2つ: 40px余白, 横並び, gap24px, 白アウトライン, 205x56px, テキスト14px */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '24px',
            marginTop: '40px',
            zIndex: 1,
          }}
        >
          <button
            style={{
              width: '205px',
              height: '56px',
              border: '1.5px solid #FFF',
              color: '#FFF',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px',
              gap: '12px',
              cursor: 'pointer',
            }}
          >
            <svg
              width="22"
              height="24"
              viewBox="0 0 22 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'inline', marginRight: 8 }}
            >
              <path
                d="M2 3C2 2.44772 2.44772 2 3 2H7.41421C7.67713 2 7.92926 2.10536 8.12132 2.29289L10.2929 4.46447C10.4804 4.65198 10.7322 4.75734 10.9951 4.75734H19C19.5523 4.75734 20 5.20505 20 5.75734V20C20 20.5523 19.5523 21 19 21H3C2.44772 21 2 20.5523 2 20V3Z"
                fill="currentColor"
              />
            </svg>
            ご利用ガイド
          </button>
          <button
            style={{
              width: '205px',
              height: '56px',
              border: '1.5px solid #FFF',
              color: '#FFF',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px',
              gap: '12px',
              cursor: 'pointer',
            }}
          >
            <img
              src='/images/question-white.svg'
              alt='よくある質問'
              width={24}
              height={24}
              style={{ display: 'inline', marginRight: 8 }}
              loading="lazy"
            />
            よくある質問
          </button>
        </div>
      </div>
    </div>
  );
}
