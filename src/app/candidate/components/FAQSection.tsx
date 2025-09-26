import Image from 'next/image';

export function FAQSection() {
  const faqs = [
    {
      question: 'CuePointとはどのようなサービスですか？',
      link: 'https://cuepoint.notion.site/CuePoint-2770ac1822c781799e90cb2dc0b49913?pvs=143',
    },
    {
      question: '求人の応募方法を教えてください。',
      link: 'https://cuepoint.notion.site/2770ac1822c7813f8012d75b89980737?pvs=143',
    },
    {
      question: '企業からのスカウトはどのように届きますか？',
      link: 'https://cuepoint.notion.site/2770ac1822c781f58f8bef9c2b5469bf?pvs=143',
    },
    {
      question: '面談日時の調整はどのように行いますか？',
      link: 'https://cuepoint.notion.site/2770ac1822c7817d9bc2e97a913c2f45?pvs=143',
    },
    {
      question: '不具合やトラブルがあった場合の連絡先は？',
      link: 'https://cuepoint.notion.site/2770ac1822c781129d40c05ddd0bb5f1?pvs=143',
    },
  ];
  return (
    <section className='bg-[#f9f9f9] pt-[120px] pb-[120px] flex flex-col items-center relative overflow-hidden'>
      {/* Vector.svgを左上に、はみ出さないように配置 */}
      <div className='w-[531px] h-[701px] absolute left-0 top-0 mix-blend-multiply pointer-events-none select-none z-0'>
        <Image
          src='/images/vector.svg'
          alt='装飾ベクター'
          width={531}
          height={701}
          className='w-full h-full object-cover'
          draggable='false'
          loading='lazy'
        />
      </div>
      {/* 背景装飾テキスト */}
      <div className="absolute bottom-[250px] font-['League_Spartan'] font-[700] text-[200px] text-white opacity-80 text-center tracking-[20px] left-1/2 transform -translate-x-1/2 translate-y-full leading-[1.8] whitespace-nowrap z-0">
        FREQUENTLY ASKED QUESTIONS
      </div>
      <div className='w-full max-w-[1200px] flex flex-col items-center gap-20 z-10 relative'>
        {/* セクションタイトル */}
        <div className='flex flex-col items-center gap-4'>
          <h2 className='text-[#0f9058] font-bold md:text-[32px] text-[24px] leading-[1.6] tracking-[3.2px] text-center font-[family-name:var(--font-noto-sans-jp)]'>
            よくあるご質問
          </h2>
          {/* ドット装飾 */}
          <div className='flex flex-row gap-7'>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0f9058]'></span>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0f9058]'></span>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0f9058]'></span>
          </div>
        </div>
        {/* FAQ項目 */}
        <div className='flex flex-col gap-4 md:w-[800px] w-auto px-[24px] md:px-0'>
          {faqs.map((faq, idx) => (
            <a
              key={idx}
              href={faq.link}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-10 py-6 hover:shadow-[0px_0px_30px_0px_rgba(0,0,0,0.1)] transition-shadow duration-200'
            >
              <div className='flex flex-row gap-2 items-center'>
                <div className='relative w-8 h-8 shrink-0'>
                  <div className='w-8 h-8 rounded-full bg-[#FFF6A9]'></div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='text-[#0f9058] font-bold text-[18px] leading-[1.6] tracking-[1.8px] font-[family-name:var(--font-noto-sans-jp)]'>
                      Q
                    </span>
                  </div>
                </div>
                <h3 className='text-[#0f9058] font-bold text-[18px] leading-[1.6] tracking-[1.8px] font-[family-name:var(--font-noto-sans-jp)]'>
                  {faq.question}
                </h3>
              </div>
            </a>
          ))}
        </div>
        {/* 他の質問も見るボタン */}
        <button className='border border-[#0f9058] rounded-[32px] px-10 py-3.5 min-w-40 transition-colors duration-200 hover:bg-[#0F9058]/20'>
          <span className='text-[#0f9058] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]'>
            他の質問も見る
          </span>
        </button>
      </div>
    </section>
  );
}
