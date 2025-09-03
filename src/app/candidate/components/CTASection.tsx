import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className='py-0 flex justify-center items-center relative overflow-visible'>
      <div className='relative w-full max-w-[1360px]'>
        {/* メインコンテナ - グラデーション背景 */}
        <div className='bg-gradient-to-t from-[#1ca74f] to-[#198d76] md:rounded-[40px] rounded-[0] md:py-[80px] md:px-[80px] py-[40px] px-[24px] flex flex-col items-center gap-10 relative overflow-visible'>
          {/* メインテキスト */}
          <h2 className='text-white font-bold text-[24px] leading-[1.6] tracking-[2.4px] text-center font-[family-name:var(--font-noto-sans-jp)]'>
            登録して、
            <span className='text-[#fff6a9]'>あなたのキャリアのチャンス</span>
            を広げよう。
          </h2>
          {/* ボタンコンテナ */}
          <div className='flex md:flex-row flex-col gap-6 items-center '>
            {/* 新規会員登録ボタン（Figma完全準拠） */}
            <Link
              href='/signup/candidate'
              className='flex flex-row items-center justify-center gap-2.5 md:px-[40px] px-[100px] md:py-[14px] py-[14px] rounded-[10px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] bg-gradient-to-r from-[#FFD000] to-[#FFF278] min-w-40 transition-all duration-200 hover:bg-[linear-gradient(to_right_top,#EEAB02,#E1CA11)]'
              style={{ fontFamily: 'Noto Sans JP', fontWeight: 700 }}
            >
              <svg className='w-[19.53px] h-6' fill='none' viewBox='0 0 20 24'>
                <path
                  d='M15.5024 0H7.52794H6.91041L6.47358 0.43603L0.435984 6.47358L0 6.90994V7.52751V19.9735C0 22.1933 1.80628 24 4.02656 24H15.5025C17.7219 24 19.5282 22.1934 19.5282 19.9735V4.02576C19.5281 1.80586 17.7219 0 15.5024 0ZM18.0374 19.9735C18.0374 21.3739 16.9024 22.5092 15.5025 22.5092H4.02656C2.62617 22.5092 1.49081 21.3739 1.49081 19.9735V7.52756H5.41514C6.58148 7.52756 7.52794 6.58148 7.52794 5.41472V1.49076H15.5025C16.9024 1.49076 18.0374 2.62617 18.0374 4.02572V19.9735Z'
                  fill='#323232'
                />
                <path
                  d='M13.8289 7.47295C13.4694 7.72453 13.0318 7.87312 12.5608 7.87312C12.0894 7.87312 11.6522 7.72453 11.2923 7.47295C10.6634 7.74365 10.277 8.21836 10.0413 8.63765C9.72824 9.19378 9.97373 9.98104 10.5144 9.98104C11.0558 9.98104 12.5608 9.98104 12.5608 9.98104C12.5608 9.98104 14.0654 9.98104 14.6069 9.98104C15.1479 9.98104 15.3937 9.19378 15.0803 8.63765C14.8446 8.21831 14.4582 7.74365 13.8289 7.47295Z'
                  fill='#0F9058'
                />
                <path
                  d='M12.5608 7.34637C13.4853 7.34637 14.2339 6.59773 14.2339 5.67364V5.27267C14.2339 4.34942 13.4853 3.59951 12.5608 3.59951C11.6367 3.59951 10.8872 4.34942 10.8872 5.27267V5.67364C10.8872 6.59773 11.6367 7.34637 12.5608 7.34637Z'
                  fill='#0F9058'
                />
                <path
                  d='M15.1092 12.205H4.30946V13.2536H15.1092V12.205Z'
                  fill='#0F9058'
                />
                <path
                  d='M15.1638 15.351H4.36405V16.4H15.1638V15.351Z'
                  fill='#0F9058'
                />
                <path
                  d='M15.1241 18.4974H7.56406V19.5456H15.1241V18.4974Z'
                  fill='#0F9058'
                />
              </svg>
              <span
                className='text-[#323232] Noto_Sans_JP font-bold text-[14px] leading-[2] tracking-[0.1em]'
                style={{ letterSpacing: '0.1em', textAlign: 'center' }}
              >
                新規会員登録
              </span>
            </Link>
            {/* 求人を見るボタン（Figma完全準拠） */}
            <button
              className='flex flex-row items-center md:items-center justify-center gap-2.5 md:px-[40px] px-[100px] md:py-[14px] py-[14px] rounded-[10px] border-2 border-white bg-transparent min-w-40 transition-colors duration-200 hover:bg-white/30'
              style={{ fontFamily: 'Noto Sans JP', fontWeight: 700 }}
            >
              <svg
                className='w-[18.24px] h-6 ml-[2.88px]'
                fill='none'
                viewBox='0 0 19 24'
              >
                <path
                  d='M9.12 0C7.1345 0 5.4435 1.25156 4.82125 3H3.04C1.36325 3 0 4.34531 0 6V21C0 22.6547 1.36325 24 3.04 24H15.2C16.8768 24 18.24 22.6547 18.24 21V6C18.24 4.34531 16.8768 3 15.2 3H13.4188C12.7965 1.25156 11.1055 0 9.12 0ZM9.12 3C9.52313 3 9.90975 3.15804 10.1948 3.43934C10.4799 3.72064 10.64 4.10218 10.64 4.5C10.64 4.89782 10.4799 5.27936 10.1948 5.56066C9.90975 5.84196 9.52313 6 9.12 6C8.71687 6 8.33025 5.84196 8.0452 5.56066C7.76014 5.27936 7.6 4.89782 7.6 4.5C7.6 4.10218 7.76014 3.72064 8.0452 3.43934C8.33025 3.15804 8.71687 3 9.12 3ZM3.42 12.75C3.42 12.4516 3.54011 12.1655 3.7539 11.9545C3.96769 11.7435 4.25765 11.625 4.56 11.625C4.86235 11.625 5.15231 11.7435 5.3661 11.9545C5.57989 12.1655 5.7 12.4516 5.7 12.75C5.7 13.0484 5.57989 13.3345 5.3661 13.5455C5.15231 13.7565 4.86235 13.875 4.56 13.875C4.25765 13.875 3.96769 13.7565 3.7539 13.5455C3.54011 13.3345 3.42 13.0484 3.42 12.75ZM8.36 12H14.44C14.858 12 15.2 12.3375 15.2 12.75C15.2 13.1625 14.858 13.5 14.44 13.5H8.36C7.942 13.5 7.6 13.1625 7.6 12.75C7.6 12.3375 7.942 12 8.36 12ZM3.42 17.25C3.42 16.9516 3.54011 16.6655 3.7539 16.4545C3.96769 16.2435 4.25765 16.125 4.56 16.125C4.86235 16.125 5.15231 16.2435 5.3661 16.4545C5.57989 16.6655 5.7 16.9516 5.7 17.25C5.7 17.5484 5.57989 17.8345 5.3661 18.0455C5.15231 18.2565 4.86235 18.375 4.56 18.375C4.25765 18.375 3.96769 18.2565 3.7539 18.0455C3.54011 17.8345 3.42 17.5484 3.42 17.25ZM7.6 17.25C7.6 16.8375 7.942 16.5 8.36 16.5H14.44C14.858 16.5 15.2 16.8375 15.2 17.25C15.2 17.6625 14.858 18 14.44 18H8.36C7.942 18 7.6 17.6625 7.6 17.25Z'
                  fill='white'
                />
              </svg>
              <span
                className='Noto_Sans_JP text-white font-bold text-[14px] leading-[2] tracking-[0.1em]'
                style={{ letterSpacing: '0.1em', textAlign: 'center' }}
              >
                求人を見る
              </span>
            </button>
          </div>
          {/* 装飾的な円要素 - スクリーンショットに忠実な配置 */}
          {/* 既存の円装飾は全て削除 */}
          {/* circle01.pngを配置 */}
          <div className='hidden md:block'>
            <Image
              src='/images/circle01.png'
              alt='circle01'
              width={80}
              height={80}
              sizes='80px'
              className='absolute z-10'
              style={{ top: 30, left: -40 }}
            />
            {/* circle02.pngを配置 */}
            <Image
              src='/images/circle02.png'
              alt='circle02'
              width={80}
              height={80}
              sizes='80px'
              className='absolute z-10'
              style={{ top: 32, right: -30 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
//f
