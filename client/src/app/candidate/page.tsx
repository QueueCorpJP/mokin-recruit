import { Navigation } from '@/components/ui/navigation';
import { FVWrapper } from '@/components/ui/FVWrapper';
import { Footer } from '@/components/ui/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '転職・キャリアアップ支援 | CuePoint',
  description:
    '理想の転職を実現。CuePointの候補者向けキャリア支援サービスで、あなたの可能性を最大化',
  keywords: ['転職', 'キャリアアップ', '求人', '候補者向け', 'キャリア支援'],
};

export default function CandidateLandingPage() {
  return (
    <div className='min-h-screen'>
      {/* Header */}
      <Navigation variant='candidate' />

      {/* Hero Section */}
      <FVWrapper>
        {/* 背景画像：左女性（左右反転） */}
        <img
          src='/images/woman-bg.jpg'
          alt='背景付き女性画像'
          width={800}
          height={690}
          className='absolute left-0 top-0 w-[800px] h-[690px] object-cover z-10 -scale-x-100'
          style={{ borderTopRightRadius: 80, borderBottomRightRadius: 80 }}
        />
        {/* 背景画像：右男性 */}
        <img
          src='/images/man-bg.png'
          alt='背景付き男性画像'
          width={800}
          height={690}
          className='absolute right-0 top-0 w-[800px] h-[690px] object-cover z-0'
          style={{ borderTopRightRadius: 80, borderBottomRightRadius: 80 }}
        />
        {/* 今後：切り抜き画像・テキスト・ボタン等をここに追加 */}
      </FVWrapper>

      {/* Additional Content Sections */}
      <main className='bg-white'>
        {/* Figma準拠：スカウトサービス新セクション */}
        <section className='py-16 flex flex-col items-center relative overflow-hidden'>
          {/* セクション全体を最大幅1200pxで中央寄せ */}
          <div className='w-full max-w-[1200px] flex flex-col items-center z-20'>
            {/* メインキャッチ＋背景帯＋ドット装飾 */}
            <div className='relative flex flex-col items-center w-full'>
              {/* 背景帯: Figmaピクセルパーフェクト対応（高さ20pxを明示） */}
              <div className='absolute left-1/2 -translate-x-1/2 top-[73px] w-[688px] h-[20px] bg-[#FFF6A9] rounded-md z-0'></div>
              {/* メインキャッチ */}
              <h2
                className='relative z-10 text-center font-bold text-[24px] leading-[1.6] tracking-wider text-[#0F9058] font-[family-name:var(--font-noto-sans-jp)]'
                style={{ letterSpacing: '0.1em' }}
              >
                経歴だけに頼らない
                <br />
                <span className='block text-[32px] leading-[1.6] font-[family-name:var(--font-noto-sans-jp)]'>
                  志向と選考状況に基づくスカウトサービス
                </span>
              </h2>
              {/* ドット装飾: Figmaピクセルパーフェクト対応（12px円, テキストとの間隔16px） */}
              <div className='relative z-10 flex flex-row gap-7 mt-4'>
                <span className='w-[12px] h-[12px] rounded-full bg-[#0F9058]'></span>
                <span className='w-[12px] h-[12px] rounded-full bg-[#0F9058]'></span>
                <span className='w-[12px] h-[12px] rounded-full bg-[#0F9058]'></span>
              </div>
            </div>
            {/* サブリード文: Figmaピクセルパーフェクト対応（margin-top:24px, 最大幅1200px） */}
            <p
              className='mt-6 text-center text-[16px] leading-[2] tracking-wider text-[#323232] font-medium font-[family-name:var(--font-noto-sans-jp)] max-w-[1200px]'
              style={{ letterSpacing: '0.1em' }}
            >
              あなたの志向や転職活動の進捗状況、比較検討している企業の情報をもとに、本当にマッチする企業から戦略的なスカウトが届きます。
              <br />
              複数の選択肢を見極め、納得して進めたいあなたに。新しい転職の起点をCuePointで。
            </p>
          </div>
          {/* カードUI: Figmaピクセルパーフェクト対応（3つ横並び） */}
          <div className='mt-12 flex flex-wrap justify-center gap-8 w-full z-20'>
            {[
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
            ].map((card, i) => (
              <div
                key={i}
                className='bg-white rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] p-[40px] pb-[72px] flex flex-col items-center gap-10 max-w-[400px] w-full sm:w-[360px]'
              >
                {/* イメージエリア */}
                <div className='relative w-[240px] h-[240px] flex items-center justify-center'>
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
                    className='text-center font-bold text-[18px] leading-[1.6] tracking-wider text-[#0F9058] font-[family-name:var(--font-noto-sans-jp)] flex items-center justify-center h-[58px]'
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
            className='absolute left-1/2 -translate-x-1/2 bottom-[-2630px] w-[3000px] h-[3000px] z-10 hidden md:block'
            style={{
              background: 'linear-gradient(360deg, #1CA74F 0%, #198D76 100%)',
              borderRadius: '50%',
            }}
            aria-hidden='true'
          ></div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
