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
            <img
              src='/images/book-solid.svg'
              alt='ご利用ガイド'
              width={22}
              height={24}
              style={{ display: 'inline', marginRight: 8 }}
              loading="lazy"
            />
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
