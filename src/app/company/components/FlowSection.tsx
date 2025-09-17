'use client';

import Image from 'next/image';

export function FlowSection() {
  const steps = [
    { icon: '/images/service.png', label: 'サービス利用面談' },
    { icon: '/images/list.png', label: 'ご契約・サービス開始' },
    { icon: '/images/searcher.png', label: '求人作成・候補者検索' },
    { icon: '/images/sender.png', label: 'スカウト送信・面談' },
    { icon: '/images/teacher.png', label: '内定・入社' },
  ];
  return (
    <section className='py-20 flex flex-col items-center px-[24px] md:px-[40px] lg:px-0'>
      <div className='w-full max-w-[1200px] flex flex-col items-center'>
        {/* 見出し */}
        <h2
          className='text-center font-bold text-[24px] md:text-[28px] lg:text-[32px] leading-[1.6] tracking-wider text-[#0F9058] font-[family-name:var(--font-noto-sans-jp)]'
          style={{ letterSpacing: '0.1em' }}
        >
          ご利用の流れ
        </h2>
        {/* ドット装飾 */}
        <div className='flex flex-row gap-7 mt-4'>
          <span className='w-[8px] h-[8px] md:h-[10px] md:w-[10px] lg:h-[12px] lg:w-[12px] rounded-full bg-[#0F9058]'></span>
          <span className='w-[8px] h-[8px] md:h-[10px] md:w-[10px] lg:h-[12px] lg:w-[12px] rounded-full bg-[#0F9058]'></span>
          <span className='w-[8px] h-[8px] md:h-[10px] md:w-[10px] lg:h-[12px] lg:w-[12px] rounded-full bg-[#0F9058]'></span>
        </div>
        {/* フロー部分 */}
        <div className='mt-16  flex flex-col md:flex-row justify-center w-full items-center gap-[24px] md:gap-[12px] lg:gap-[16px]'>
          {steps.map((step, idx) => (
            <div
              key={step.label}
              className='flex md:flex-row items-center justify-center flex-col'
            >
              <div
                key={step.label}
                className='flex md:flex-col items-center justify-start w-[288px] md:w-[160px] lg:w-[180px] h-auto md:h-[110px] flex-raw'
              >
                {/* アイコン部 */}
                <div className='w-[70px] h-[70px] flex items-center justify-center'>
                  <Image
                    src={step.icon}
                    alt={step.label}
                    width={60}
                    height={60}
                    loading='lazy'
                    className='w-[60px] h-[60px]'
                  />
                </div>
                {/* テキスト部 */}
                <div
                  className='md:mt-auto mt-0 ml-[16px] md:ml-0 text-[16px] font-bold text-[#0F9058] leading-[2] tracking-wider text-center font-[family-name:var(--font-noto-sans-jp)] items-center'
                  style={{ letterSpacing: '0.1em' }}
                >
                  {step.label}
                </div>
              </div>
              {/* 矢印アイコン（最後以外） */}
              {idx < steps.length - 1 && (
                <>
                  {/* モバイル用矢印 */}
                  <Image
                    src='/images/flow-arrow2.svg'
                    alt=''
                    width={16}
                    height={32}
                    className='block md:hidden items-center justify-center'
                  />
                  {/* デスクトップ用矢印 */}
                  <Image
                    src='/images/flow-arrow.svg'
                    alt=''
                    width={16}
                    height={32}
                    className='hidden md:block items-center justify-center'
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
