import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className='relative w-full h-[730px] lg:h-[730px] md:h-[600px] sm:h-[500px] overflow-hidden'>
      {/* Background Gradient */}
      <div
        className='absolute inset-0 bg-gradient-to-b from-[#198D76] to-[#1CA74F]'
        style={{
          background: 'linear-gradient(180deg, #198D76 0%, #1CA74F 100%)',
        }}
      />

      {/* Background Image with Opacity */}
      <div className='absolute inset-0 opacity-20'>
        <Image
          src='/images/hero-background.jpg'
          alt='Background'
          fill
          className='object-cover'
          priority
        />
      </div>

      {/* Decorative Gradient Circles - Enhanced */}
      <div className='absolute inset-0' style={{ zIndex: 2 }}>
        {/* Top Left Large Circle */}
        <div
          className='absolute w-[200px] h-[200px] rounded-full opacity-80'
          style={{
            left: '-50px',
            top: '-50px',
            background: 'linear-gradient(135deg, #86C36A 0%, #63BFAD 100%)',
            zIndex: 2,
          }}
        />

        {/* Top Right Medium Circle */}
        <div
          className='absolute w-[150px] h-[150px] rounded-full opacity-70'
          style={{
            right: '100px',
            top: '50px',
            background: 'linear-gradient(180deg, #CADA65 0%, #95CA7D 100%)',
            zIndex: 3,
          }}
        />

        {/* Bottom Left Circle */}
        <div
          className='absolute w-[180px] h-[180px] rounded-full opacity-60'
          style={{
            left: '50px',
            bottom: '50px',
            background: 'linear-gradient(45deg, #CADA65 0%, #95CA7D 100%)',
            zIndex: 2,
          }}
        />

        {/* Bottom Right Small Circle */}
        <div
          className='absolute w-[100px] h-[100px] rounded-full opacity-50'
          style={{
            right: '200px',
            bottom: '100px',
            background: 'linear-gradient(180deg, #86C36A 0%, #63BFAD 100%)',
            zIndex: 3,
          }}
        />
      </div>

      {/* Person Images - Optimized Layout */}
      <div className='absolute inset-0' style={{ zIndex: 5 }}>
        {/* Main Person Container - Right Side */}
        <div
          className='absolute hidden md:block'
          style={{
            right: '0px',
            top: '0px',
            width: '60%',
            height: '100%',
          }}
        >
          {/* Female Person - Background */}
          <div
            className='absolute rounded-full overflow-hidden'
            style={{
              right: '200px',
              top: '50px',
              width: '400px',
              height: '400px',
              zIndex: 6,
            }}
          >
            <Image
              src='/images/person-female.jpg'
              alt='Female professional'
              fill
              className='object-cover object-center'
            />
          </div>

          {/* Male Person - Foreground */}
          <div
            className='absolute rounded-full overflow-hidden'
            style={{
              right: '50px',
              top: '150px',
              width: '450px',
              height: '450px',
              zIndex: 7,
            }}
          >
            <Image
              src='/images/person-male.jpg'
              alt='Male professional'
              fill
              className='object-cover object-center'
            />
          </div>
        </div>

        {/* Floating Action Button */}
        <div
          className='absolute w-[65px] h-[65px] rounded-full shadow-lg'
          style={{
            left: '786px',
            top: '769px',
            boxShadow: '0px 20px 30px 0px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className='w-full h-full rounded-full bg-white' />
          <div
            className='absolute inset-0 w-full h-full rounded-full'
            style={{
              background: 'linear-gradient(0deg, #68B345 0%, #B3CA23 100%)',
            }}
          />
        </div>
      </div>

      {/* Enhanced Wave Decoration */}
      <div className='absolute inset-0' style={{ zIndex: 4 }}>
        <svg
          className='absolute'
          style={{
            left: '0px',
            top: '200px',
            width: '100%',
            height: '400px',
            zIndex: 4,
          }}
          viewBox='0 0 1440 400'
          fill='none'
          preserveAspectRatio='none'
        >
          <defs>
            <linearGradient
              id='waveGradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#86C36A' stopOpacity='0.3' />
              <stop offset='100%' stopColor='#63BFAD' stopOpacity='0.2' />
            </linearGradient>
          </defs>
          <path
            d='M0,100 C200,50 400,150 600,100 C800,50 1000,150 1200,100 C1300,80 1400,120 1440,100 L1440,400 L0,400 Z'
            fill='url(#waveGradient)'
          />
        </svg>
      </div>

      {/* Main Content */}
      <div
        className='absolute w-full'
        style={{
          top: '140px',
          zIndex: 20,
        }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-6 lg:gap-10 w-full md:w-1/2'>
            {/* Text Content */}
            <div className='flex flex-col gap-4'>
              <h1
                className='text-white font-bold leading-[1.6] tracking-[0.1em] text-shadow-lg'
                style={{
                  fontFamily: 'var(--font-noto-sans-jp)',
                  textShadow: '0px 0px 50px rgba(18, 119, 99, 1)',
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  lineHeight: '1.6em',
                  letterSpacing: '0.1em',
                }}
              >
                職歴だけでは届かない、
                <br />
                <span style={{ color: '#FFF6A9' }}>
                  志向に深く刺さるスカウト
                </span>
                を。
              </h1>
              <p
                className='text-white font-bold leading-[1.6] tracking-[0.1em] text-shadow-lg'
                style={{
                  fontFamily: 'var(--font-noto-sans-jp)',
                  textShadow: '0px 0px 50px rgba(18, 119, 99, 1)',
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  lineHeight: '1.6em',
                  letterSpacing: '0.1em',
                }}
              >
                志向・選考状況・比較企業を可視化し、&ldquo;今&rdquo;だから届く即戦力へアプローチ。
              </p>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
              <button
                className='flex items-center justify-center gap-2.5 px-10 py-3.5 rounded-[10px] font-bold text-sm leading-8 tracking-[0.1em] text-[#323232] shadow-lg'
                style={{
                  background:
                    'linear-gradient(90deg, #FFD000 0%, #FFF278 100%)',
                  boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
                  fontFamily: 'var(--font-noto-sans-jp)',
                }}
              >
                <svg width='18' height='24' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z'
                    fill='#323232'
                  />
                </svg>
                資料請求
              </button>

              <Link
                href='/auth/login'
                className='flex items-center justify-center gap-2.5 px-10 py-3.5 rounded-[10px] font-bold text-sm leading-8 tracking-[0.1em] text-white border-2 border-white'
                style={{
                  fontFamily: 'var(--font-noto-sans-jp)',
                }}
              >
                ログイン
              </Link>
            </div>

            {/* Bottom Link */}
            <p
              className='text-white font-bold leading-8 tracking-[0.1em] text-shadow-lg'
              style={{
                fontFamily: 'var(--font-noto-sans-jp)',
                textShadow: '0px 0px 50px rgba(18, 119, 99, 1)',
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                lineHeight: '2em',
                letterSpacing: '0.1em',
              }}
            >
              転職希望の方はこちら
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
