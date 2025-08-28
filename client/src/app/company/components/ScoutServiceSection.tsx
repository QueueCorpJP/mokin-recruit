export function ScoutServiceSection() {
  const cards = [
    {
      img: '/images/card-1.jpg',
      title: '他社選考状況を参考に<br />マッチ度の高いスカウトを実現',
      text: '候補者の他社選考状況を把握できるため、志向性や業界・規模感が近い人材を見極めたうえで、マッチ度の高いスカウトが可能です。',
      grad: 'bg-gradient-to-b from-[#43C6AC] to-[#3B91C7]',
    },
    {
      img: '/images/card-2.jpg',
      title: '志向が読みづらいリーダークラスにも、戦略的に届く',
      text: '職歴や条件面だけでは見極めづらい、キャリアの選択肢が広い企画・事業開発職やリーダークラス。CuePointなら、現在の志向や選考動向をもとに、確度の高いスカウトが可能です。',
      grad: 'bg-gradient-to-b from-[#86C36A] to-[#63BFAD]',
    },
    {
      img: '/images/card-3.jpg',
      title: '候補者の“比較対象企業”まで見えるから、差別化できる',
      text: 'CuePointでは、候補者が比較検討している企業群までを可視化。 競合を踏まえて、スカウトの訴求内容を最適化できます。選ばれる理由を戦略的に設計し、採用競争で優位に立ちましょう。',
      grad: 'bg-gradient-to-b from-[#CADA65] to-[#95CA7D]',
    },
  ];

  return (
    <section className='py-16 flex flex-col items-center relative overflow-hidden px-[24px] md:px-0 bg-[#F9F9F9] md:bg-[#FFF]'>
      {/* セクション全体を最大幅1200pxで中央寄せ */}
      <div className='w-full max-w-[1200px] flex flex-col items-center z-20'>
        {/* メインキャッチ＋背景帯＋ドット装飾 */}
        <div className='relative flex flex-col items-center w-full'>
          {/* 背景帯: Figmaピクセルパーフェクト対応（高さ20pxを明示） */}
          <div className='absolute left-1/2 -translate-x-1/2 md:top-[73px] top-[51px] md:w-[688px] md:h-[20px] w-[345px] h-[16px] bg-[#FFF6A9]  z-0' />
          <div className='md:hidden absolute left-1/2 -translate-x-1/2 md:top-[73px] top-[90px] w-[258px] h-[16px] bg-[#FFF6A9]  z-0 ' />
         
          {/* メインキャッチ */}
          <h2
            className='relative z-10 text-center font-bold text-[18px] md:text-[24px] leading-[1.6] tracking-wider text-[#0F9058] font-[family-name:var(--font-noto-sans-jp)]'
            style={{ letterSpacing: '0.1em' }}
          >
          届かないスカウトの時代に、

            <br />
            <span className='block  text-[24px] md:text-[32px] leading-[1.6] font-[family-name:var(--font-noto-sans-jp)]'>
            “いま誰と比べられているか”が見える新しい仕組みを
            </span>
          </h2>
          {/* ドット装飾: Figmaピクセルパーフェクト対応（12px円, テキストとの間隔16px） */}
          <div className='relative z-10 flex flex-row gap-7 mt-4'>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
          </div>
        </div>
     
        <p
          className='mt-6 md:text-center text-left text-[16px] md:text-[16px] leading-[2] tracking-wider text-[#323232] font-medium font-[family-name:var(--font-noto-sans-jp)] max-w-[1200px]'
          style={{ letterSpacing: '0.1em' }}
        >
          候補者の意思決定に影響する要素は、履歴書や職務経歴書には現れません。
          <br />
          現在の志望の方向性、併願先企業、検討フェーズ──CuePointは、こうした候補者の“意思決定の文脈”を可視化し、
          <br />
          企業の戦略的な採用を支援します。
        </p>
      </div>
      {/* カードUI: Figmaピクセルパーフェクト対応（3つ横並び） */}
      <div className='mt-16 flex flex-wrap justify-center gap-8 w-full z-20'>
        {cards.map((card, i) => (
          <div
            key={i}
            className='bg-white rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] p-[24px] md:p-[40px] md:pb-[72px] pb-[24px] flex flex-col items-center gap-10 max-w-[400px] w-full sm:w-[360px]'
          >
            {/* イメージエリア */}
            <div className='relative w-[240px] h-[240px] flex items-center justify-center '>
              {/* メイン円形画像（Figmaエクスポート画像） */}
              <img
                src={card.img}
                alt='カードイメージ'
                className='w-[220px] h-[220px] rounded-full object-cover'
              />
              {/* サブ円（グラデーション） */}
              <div
                className={`absolute left-0 bottom-0 w-[79px] h-[79px] rounded-full ${card.grad}`}
              ></div>
            </div>
            {/* テキストエリア: 幅304pxに固定 */}
            <div className='flex flex-col items-center gap-4 w-[304px]'>
              <h3
                className='text-left md:text-center font-bold text-[18px] leading-[1.6] tracking-wider text-[#0F9058] font-[family-name:var(--font-noto-sans-jp)] flex items-center justify-center h-[58px]'
                style={{ letterSpacing: '0.1em' }}
                dangerouslySetInnerHTML={{ __html: card.title }}
              />
              <p
                className='text-left text-[16px] leading-[2] tracking-wider text-[#323232] font-medium font-[family-name:var(--font-noto-sans-jp)] whitespace-pre-line'
                style={{ letterSpacing: '0.1em' }}
              >
                {card.text}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* === グラデーション円（装飾） === */}
      <div
        className='absolute left-1/2 -translate-x-1/2 bottom-[-2630px] w-[3000px] h-[3000px] z-10 block'
        style={{
          background:
            'linear-gradient(180deg, #1CA74F 0%, #198D76 10%, #198D76 100%)',
          borderRadius: '50%',
        }}
        aria-hidden='true'
      ></div>
    </section>
  );
}