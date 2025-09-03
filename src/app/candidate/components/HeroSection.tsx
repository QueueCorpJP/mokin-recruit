'use client';
import Link from 'next/link';
import Image from 'next/image';

const ProfileIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 20 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g>
      <path
        d='M15.5024 4.58062e-05H7.52794H6.91041L6.47358 0.43603L0.435984 6.47358L0 6.90994V7.52751V19.9735C0 22.1933 1.80628 24 4.02656 24H15.5025C17.7219 24 19.5282 22.1934 19.5282 19.9735V4.02576C19.5281 1.80586 17.7219 4.58062e-05 15.5024 4.58062e-05ZM18.0374 19.9735C18.0374 21.3739 16.9024 22.5092 15.5025 22.5092H4.02656C2.62617 22.5092 1.49081 21.3739 1.49081 19.9735V7.52756H5.41514C6.58148 7.52756 7.52794 6.58148 7.52794 5.41472V1.49076H15.5025C16.9024 1.49076 18.0374 2.62617 18.0374 4.02572V19.9735Z'
        fill='#323232'
      />
      <path
        d='M13.8289 7.47305C13.4694 7.72462 13.0318 7.87322 12.5608 7.87322C12.0894 7.87322 11.6522 7.72462 11.2923 7.47305C10.6634 7.74375 10.277 8.21845 10.0413 8.63775C9.72824 9.19387 9.97373 9.98114 10.5144 9.98114C11.0558 9.98114 12.5608 9.98114 12.5608 9.98114C12.5608 9.98114 14.0654 9.98114 14.6069 9.98114C15.1479 9.98114 15.3937 9.19387 15.0803 8.63775C14.8446 8.21841 14.4582 7.74375 13.8289 7.47305Z'
        fill='#323232'
      />
      <path
        d='M12.5608 7.34627C13.4853 7.34627 14.2339 6.59763 14.2339 5.67354V5.27257C14.2339 4.34932 13.4853 3.59941 12.5608 3.59941C11.6367 3.59941 10.8872 4.34932 10.8872 5.27257V5.67354C10.8872 6.59763 11.6367 7.34627 12.5608 7.34627Z'
        fill='#323232'
      />
      <path
        d='M15.1092 12.2051H4.30947V13.2537H15.1092V12.2051Z'
        fill='#323232'
      />
      <path d='M15.1638 15.351H4.36406V16.4H15.1638V15.351Z' fill='#323232' />
      <path
        d='M15.1241 18.4973H7.56406V19.5455H15.1241V18.4973Z'
        fill='#323232'
      />
    </g>
  </svg>
);

export function HeroSection() {
  return (
    <div className='relative w-full'>
      {/* Hero Section */}
      <div className='relative w-full h-auto'>
        <div className='w-[100%] h-auto flex block mx-auto justify-center'>
<<<<<<< HEAD
          <picture>
            <source media='(max-width: 768px)' srcSet='/image.png' />
            <img
              src='/top.png'
              alt='hero'
              className='w-full h-auto object-cover'
              loading='eager'
              fetchPriority='high'
            />
          </picture>
=======
          <Image
            src='/top.png'
            alt='hero'
            width={1920}
            height={1080}
            className='w-full h-auto object-cover'
            priority={true}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
>>>>>>> 8a49097016d0c6980108e3c233c037219334eb90
        </div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='flex flex-col items-center justify-center gap-[24px] text-center'>
            {/* Title & Subtitle */}
            <div className='text-white mt-5 px-[10px] md:px-8 w-full md:w-auto h-auto'>
              <h1 className='text-[31px] ml-[15px] md:text-[44px] leading-[1.6] tracking-widest font-bold text-center  mb-2 md:mb-4'>
                スカウトに、納得を。
                <br />
                転職に、戦略を。
              </h1>
              <div className='pr-[16px] pl-[16px]'>
                <p
                  className="
    text-white
    text-center md:text-left
    font-['Noto_Sans_JP']
    text-[16px] md:text-[20px]
    font-bold
    leading-[200%]
    tracking-[1.6px]
  "
                >
                  どんな企業を受け、どんな選択に迷っているのか。
                  {/* <br /> */}
                  {/* <span className="block md:hidden"> </span> */}
                  <span className='hidden md:block'> </span>
                  あなたの&quot;今&quot;に、
                  <span className='md:hidden block'> </span>
                  戦略的なスカウトを届けます。
                </p>
              </div>
            </div>
            <div className='flex flex-row justify-center items-center gap-4'>
              <Link
                href='/signup/candidate'
                className="
   mb-[0px]
    flex items-center justify-center gap-[10px]
    rounded-[10px] text-[#323232] bg-[#FEE449]
    shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]
    font-bold text-[14px] tracking-[1.4px] leading-[2] font-['Noto_Sans_JP']
    min-w-[160px] max-w-[169px] px-[auto] py-[14px]
    md:min-w-auto md:max-w-none md:px-10 md:py-3.5 md:flex-none md:gap-2.5 
    transition-all duration-200 hover:bg-[linear-gradient(to_right_top,#EEAB02,#E1CA11)]
  "
              >
                <span className='flex-shrink-0'>
                  <ProfileIcon />
                </span>
                <span className='truncate'>新規会員登録</span>
              </Link>

              <Link
                href='/candidate/auth/login'
                className='
    flex items-center justify-center gap-[10px]
    border-2 border-white text-white font-bold rounded-[10px]
    text-[14px] tracking-[1.4px] leading-[200%] whitespace-nowrap
   mb-[0px]
    min-w-[160px] max-w-[160px] w-full px-[40px] py-[14px]
    gap-[0px]
    md:min-w-[205px] md:px-10 md:py-3.5 md:gap-2.5 md:flex-none
    transition-colors duration-200 hover:bg-white/30
  '
              >
                ログイン
              </Link>
            </div>

            <Link
              href='/company'
              className="text-white text-center font-['Noto_Sans_JP'] text-[14px] md:text-[16px] font-medium not-italic leading-[32px] tracking-[1.6px] underline decoration-solid underline-offset-auto"
            >
              企業の採用担当者はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
