export function FAQSection() {
  const faqs = [
    {
      question: 'どのような人材にアプローチできますか？',
      answer:
        'コンサルや企画職など、ビジネス経験が豊富でキャリアの選択肢が広い人材が多数登録しています。大手・外資系出身など市場価値の高いハイクラス層も多く、業界・職種・スキル条件に応じた詳細検索が可能です。',
    },
    {
      question: '料金プランについて教えてください。',
      answer:
        'ご利用料金は、スカウト通数や利用期間に応じた月額制プランをご用意しています。詳細はサービス資料に記載しておりますので、お気軽にお問い合わせください。',
    },
    {
      question: '導入までにどのくらいの期間がかかりますか？',
      answer:
        'ご利用開始にあたっては、申込書へのご捺印と、必要情報のご提供をお願いしております。書類を確認後、通常3営業日以内にアカウントを発行し、初期設定完了後すぐにご利用いただけます。',
    },
    {
      question: 'スカウト文面の作成サポートはありますか？',
      answer:
        '初回導入時に、スカウト文面のテンプレートをご提供いたします。また、文面の添削や改善のご提案も行っておりますので、お気軽にご相談ください。',
    },
  ];
  return (
    <section className='bg-[#f9f9f9] pt-[120px] pb-[120px] flex flex-col items-center relative overflow-hidden'>
      {/* Vector.svgを左上に、はみ出さないように配置 */}
      <div className='w-[531px] h-[701px] absolute left-0 top-0 mix-blend-multiply pointer-events-none select-none z-0'>
        <img
          src='/images/vector.svg'
          alt='装飾ベクター'
          className='w-full h-full object-cover'
          draggable='false'
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
            <div
              key={idx}
              className='bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-10 py-6'
            >
              <div className='flex flex-col gap-3'>
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
                <p className='text-[#323232] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)] whitespace-pre-line'>
                  {faq.answer}
                </p>
              </div>
            </div>
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