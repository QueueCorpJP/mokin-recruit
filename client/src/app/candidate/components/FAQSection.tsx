export function FAQSection() {
    const faqs = [
      {
        question: '登録したレジュメは企業からどうみられますか？',
        answer:
          '企業側は、スカウトを送る前では氏名・生年月日・住所・連絡先などの個人を特定できる情報は閲覧できません。氏名や生年月日などの情報の一部は、あなたがスカウトに返信した場合にのみ企業に公開されます。',
      },
      {
        question: '今の在籍企業に転職活動が知られたくないです。',
        answer:
          '現在の勤務先企業からは、自動的にプロフィールが閲覧されない仕組みになっています。\nさらに、過去の在籍企業や選考中の企業など、特定の企業を「ブロック企業」として設定することも可能ですので安心してご利用いただけます。',
      },
      {
        question: '受け取ったスカウトに返信するとどうなりますか？',
        answer:
          'あなたがスカウトに返信すると、企業の担当者が内容を確認し、面談のご案内が届くことが多いです。\nなお、返信後は氏名や生年月日などのプロフィール情報が企業に公開されます。',
      },
      {
        question: 'エージェントの方から連絡はきますか？',
        answer:
          'エージェント/ヘッドハンターを介さず、企業の採用担当者から直接連絡が届きます。',
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
          <button className='border border-[#0f9058] rounded-[32px] px-10 py-3.5 min-w-40'>
            <span className='text-[#0f9058] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]'>
              他の質問も見る
            </span>
          </button>
        </div>
      </section>
    );
  }