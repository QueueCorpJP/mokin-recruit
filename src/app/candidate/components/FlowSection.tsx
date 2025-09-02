'use client'

import Image from 'next/image';

export function FlowSection() {
    const steps = [
      { icon: '/images/flow-1.svg', label: '会員情報を登録' },
      { icon: '/images/flow-2.svg', label: 'スカウトを受け取る' },
      { icon: '/images/flow-3.svg', label: '面談・面接' },
      { icon: '/images/flow-4.svg', label: '内定・入社' },
    ];
    return (
      <section className='py-20 flex flex-col items-center'>
        <div className='w-full max-w-[1200px] flex flex-col items-center'>
          {/* 見出し */}
          <h2
            className='text-center font-bold text-[24px] md:text-[32px] leading-[1.6] tracking-wider text-[#0F9058] font-[family-name:var(--font-noto-sans-jp)]'
            style={{ letterSpacing: '0.1em' }}
          >
            転職活動の流れ
          </h2>
          {/* ドット装飾 */}
          <div className='flex flex-row gap-7 mt-4'>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
          </div>
          {/* フロー部分 */}
          <div className='mt-16  flex flex-col md:flex-row justify-center w-full items-center gap-[24px]'>
             {steps.map((step, idx) => (
             <div key={step.label} className='flex md:flex-row items-center justify-center flex-col'>
                <div
                  key={step.label}
                  className='flex md:flex-col items-center justify-start w-[288px] h-auto md:h-[128px] flex-raw'
                >
                  {/* アイコン部 */}
                  <div className='w-[80px] h-[80px] rounded-full border-2 border-[#0F9058] flex items-center justify-center'>
                    <Image src={step.icon} alt={step.label} width={44} height={44} className='w-[44px] h-[44px]' loading="lazy" />
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
                        width={24}
                        height={24}
                        className='block md:hidden items-center justify-center'
                      />
                      {/* デスクトップ用矢印 */}
                      <Image
                        src='/images/flow-arrow.svg'
                        alt=''
                        width={32}
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