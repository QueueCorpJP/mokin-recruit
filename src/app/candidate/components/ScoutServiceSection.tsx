export function ScoutServiceSection() {
  const cards = [
    {
      img: '/images/card-1.jpg',
      title: 'あなたの"今"を企業に伝える、<br />新しいスカウト体験',
      text: '志望業界や応募先、検討フェーズなど、いまの動きを企業側に伝えられる新しい仕組みです。経歴だけではわからない、あなたの転職のリアルをもとに、納得感あるスカウトが届きます。',
      grad: 'bg-gradient-to-b from-[#43C6AC] to-[#3B91C7]',
    },
    {
      img: '/images/card-2.jpg',
      title: 'しっかり選びたいあなたに',
      text: 'ただ声がかかるだけじゃなく、本当に比較検討できる選択肢がほしい。\nCuePointでは、あなたがどこを受けているかをふまえ、企業が戦略的にスカウトを設計。だから納得して選べます。',
      grad: 'bg-gradient-to-b from-[#86C36A] to-[#63BFAD]',
    },
    {
      img: '/images/card-3.jpg',
      title: '気づかなかった企業との出会い',
      text: '似たような企業を受けているから…といった「比較先」を共有することで、あなたの選考状況を見た企業から新しいオファーが届きます。思ってもみなかったチャンスが見つかることも。',
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
            経歴だけに頼らない
            <br />
            <span className='block  text-[24px] md:text-[32px] leading-[1.6] font-[family-name:var(--font-noto-sans-jp)]'>
              志向と選考状況に基づく
              <br className='md:hidden' />
              スカウトサービス
            </span>
          </h2>
          {/* ドット装飾: Figmaピクセルパーフェクト対応（12px円, テキストとの間隔16px） */}
          <div className='relative z-10 flex flex-row gap-7 mt-4'>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
          </div>
        </div>
        {/* サブリード文: Figmaピクセルパーフェクト対応（margin-top:24px, 最大幅1200px） */}
        <p
          className='mt-6 md:text-center text-left text-[16px] md:text-[16px] leading-[2] tracking-wider text-[#323232] font-medium font-[family-name:var(--font-noto-sans-jp)] max-w-[1200px]'
          style={{ letterSpacing: '0.1em' }}
        >
          あなたの志向や転職活動の進捗状況、比較検討している企業の情報をもとに、本当にマッチする企業から戦略的なスカウトが届きます。
          <br />
          複数の選択肢を見極め、納得して進めたいあなたに。新しい転職の起点をCuePointで。
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
