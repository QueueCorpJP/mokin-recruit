import { Navigation } from '@/components/ui/navigation';
import { FVWrapper } from '@/components/ui/FVWrapper';
import { Footer } from '@/components/ui/footer';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ColumnCard } from '@/components/ui/ColumnCard';

export const metadata: Metadata = {
  title: '転職・キャリアアップ支援 | CuePoint',
  description:
    '理想の転職を実現。CuePointの候補者向けキャリア支援サービスで、あなたの可能性を最大化',
  keywords: ['転職', 'キャリアアップ', '求人', '候補者向け', 'キャリア支援'],
};

export default function CandidateLandingPage() {
  const columnData = [
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
  ];

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <Navigation variant='candidate' />

            {/* Hero Section */}
      <FVWrapper>
        {/* 背景画像：左女性（指定スタイル・左右反転） */}
        <div 
          className='absolute left-0 top-0 flex-shrink-0'
          style={{
            width: '394px',
            height: '690px',
            borderRadius: '0px 80px 80px 0px',
            background: 'url(/images/woman-bg.jpg) lightgray -492.382px 0px / 324.787% 104.32% no-repeat',
            transform: 'scaleX(-1)'
          }}
        ></div>
        {/* 背景画像：右男性（指定スタイル） */}
        <div 
          className='absolute right-0 top-0 flex-shrink-0'
          style={{
            width: '800px',
            height: '690px',
            borderRadius: '0px 80px 80px 0px',
            background: 'url(/images/man-bg.png) lightgray 45.444px 0px / 129.312% 100% no-repeat'
          }}
                  ></div>
          
          {/* 装飾的な円 - 左上 */}
          <div 
            className='absolute left-8 top-8 flex-shrink-0 pointer-events-none'
            style={{
              width: '140px',
              height: '140px',
              background: 'radial-gradient(100% 100% at 50% 0%, #CADA65 0%, #71BA67 100%)',
              borderRadius: '50%',
              filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.08))'
            }}
          ></div>
          
          {/* 装飾的な円 - 左下 */}
          <div 
            className='absolute left-8 bottom-8 flex-shrink-0 pointer-events-none'
            style={{
              width: '213px',
              height: '213px',
              background: 'radial-gradient(100% 100% at 50% 0%, #43C6AC 0%, #2F89C1 100%)',
              borderRadius: '50%',
              filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.08))'
            }}
          ></div>
          
          {/* 装飾的な円 - 右上 */}
          <div 
            className='absolute right-8 top-8 flex-shrink-0 pointer-events-none'
            style={{
              width: '218px',
              height: '218px',
              background: 'radial-gradient(100% 100% at 50% 0%, #2EBD62 0%, #00864C 100%)',
              borderRadius: '50%',
              filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.08))'
            }}
          ></div>
          
          {/* 装飾的な円 - 右中央 */}
          <div 
            className='absolute right-12 top-1/2 transform -translate-y-1/2 flex-shrink-0 pointer-events-none'
            style={{
              width: '95px',
              height: '95px',
              background: 'radial-gradient(100% 100% at 50% 0%, #86C36A 0%, #2EABA2 100%)',
              borderRadius: '50%',
              filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.08))'
            }}
          ></div>
          
          {/* 装飾的な大きな背景形状（画像） */}
          <div
            className="absolute left-[40%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              transform: 'translateX(-50%) translateY(-50%) rotate(57.442deg)',
              filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.08))',
              zIndex: 1
            }}
          >
            <img
              className="w-[829px] h-[672px] object-cover"
              alt="Vector graphic"
              src="https://c.animaapp.com/KGmfgUYJ/img/vector.svg"
              style={{ aspectRatio: '829/672' }}
            />
          </div>
          
          {/* メインテキスト */}
          <div 
            className='absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none'
          >
                         <h3 
               style={{
                 color: '#FFF',
                 textAlign: 'center',
                 fontFamily: 'Noto Sans JP',
                 fontSize: '20px',
                 fontStyle: 'normal',
                 fontWeight: 700,
                 lineHeight: '160%',
                 letterSpacing: '2px'
               }}
             >
                             どんな企業を受け、どんな選択に迷っているのか。
               <br />
               あなたの&quot;今&quot;に、戦略的なスカウトを届けます。
            </h3>
            
            {/* 企業の採用担当者リンク */}
            <div 
              className='mt-8'
              style={{
                alignSelf: 'stretch',
                color: '#FFF',
                textAlign: 'center',
                fontFamily: 'Noto Sans JP',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '200%',
                letterSpacing: '1.6px',
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationSkipInk: 'auto',
                textDecorationThickness: 'auto',
                textUnderlineOffset: 'auto',
                textUnderlinePosition: 'from-font'
              }}
            >
              企業の採用担当者はこちら
            </div>
          </div>
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
        {/* === 転職活動の流れセクション === */}
        <section className='py-20 flex flex-col items-center'>
          <div className='w-full max-w-[1200px] flex flex-col items-center'>
            {/* 見出し */}
            <h2
              className='text-center font-bold text-[32px] leading-[1.6] tracking-wider text-[#0F9058] font-[family-name:var(--font-noto-sans-jp)]'
              style={{ letterSpacing: '0.1em' }}
            >
              転職活動の流れ
            </h2>
            {/* ドット装飾 */}
            <div className='flex flex-row gap-7 mt-4'>
              <span className='w-[12px] h-[12px] rounded-full bg-[#0F9058]'></span>
              <span className='w-[12px] h-[12px] rounded-full bg-[#0F9058]'></span>
              <span className='w-[12px] h-[12px] rounded-full bg-[#0F9058]'></span>
            </div>
            {/* === フロー部分は次ステップで実装 === */}
            {/* === フロー部分：1つ目「会員情報を登録」 === */}
            <div className='mt-16 flex justify-center w-full items-center'>
              {/* 1つ目 */}
              <div className='flex flex-col items-center w-[288px] h-[128px]'>
                {/* アイコン部 */}
                <div className='w-[80px] h-[80px] rounded-full border-2 border-[#0F9058] flex items-center justify-center'>
                  {/* 仮SVGアイコン */}
                  <img
                    src='/images/flow-1.svg'
                    alt=''
                    className='w-[44px] h-[44px]'
                  />
                </div>
                {/* テキスト部 */}
                <div
                  className='mt-auto text-[16px] font-bold text-[#0F9058] leading-[2] tracking-wider text-center font-[family-name:var(--font-noto-sans-jp)]'
                  style={{ letterSpacing: '0.1em' }}
                >
                  会員情報を登録
                </div>
              </div>
              {/* 矢印アイコン */}
              <img
                src='/images/flow-arrow.svg'
                alt=''
                className='w-[16px] h-[32px]'
              />
              {/* 2つ目 */}
              <div className='flex flex-col items-center w-[288px] h-[128px]'>
                {/* アイコン部 */}
                <div className='w-[80px] h-[80px] rounded-full border-2 border-[#0F9058] flex items-center justify-center'>
                  {/* 仮SVGアイコン */}
                  <img
                    src='/images/flow-2.svg'
                    alt=''
                    className='w-[44px] h-[44px]'
                  />
                </div>
                {/* テキスト部 */}
                <div
                  className='mt-auto text-[16px] font-bold text-[#0F9058] leading-[2] tracking-wider text-center font-[family-name:var(--font-noto-sans-jp)]'
                  style={{ letterSpacing: '0.1em' }}
                >
                  スカウトを受け取る
                </div>
              </div>
              {/* 矢印アイコン */}
              <img
                src='/images/flow-arrow.svg'
                alt=''
                className='w-[16px] h-[32px]'
              />
              {/* 3つ目 */}
              <div className='flex flex-col items-center w-[288px] h-[128px]'>
                {/* アイコン部 */}
                <div className='w-[80px] h-[80px] rounded-full border-2 border-[#0F9058] flex items-center justify-center'>
                  {/* 仮SVGアイコン */}
                  <img
                    src='/images/flow-3.svg'
                    alt=''
                    className='w-[44px] h-[44px]'
                  />
                </div>
                {/* テキスト部 */}
                <div
                  className='mt-auto text-[16px] font-bold text-[#0F9058] leading-[2] tracking-wider text-center font-[family-name:var(--font-noto-sans-jp)]'
                  style={{ letterSpacing: '0.1em' }}
                >
                  面談・面接
                </div>
              </div>
              {/* 矢印アイコン */}
              <img
                src='/images/flow-arrow.svg'
                alt=''
                className='w-[16px] h-[32px]'
              />
              {/* 4つ目 */}
              <div className='flex flex-col items-center w-[288px] h-[128px]'>
                {/* アイコン部 */}
                <div className='w-[80px] h-[80px] rounded-full border-2 border-[#0F9058] flex items-center justify-center'>
                  {/* 仮SVGアイコン */}
                  <img
                    src='/images/flow-4.svg'
                    alt=''
                    className='w-[44px] h-[44px]'
                  />
                </div>
                {/* テキスト部 */}
                <div
                  className='mt-auto text-[16px] font-bold text-[#0F9058] leading-[2] tracking-wider text-center font-[family-name:var(--font-noto-sans-jp)]'
                  style={{ letterSpacing: '0.1em' }}
                >
                  内定・入社
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* === 求人を探すセクション === */}
        <section
          className='py-20 flex flex-col items-center'
          style={{
            background: 'linear-gradient(180deg, #198D76 0%, #1CA74F 100%)',
          }}
        >
          <div className='w-full max-w-[1200px] flex flex-col items-center'>
            {/* 見出し */}
            <h2
              className='text-center font-bold text-[32px] leading-[1.6] tracking-wider text-white font-[family-name:var(--font-noto-sans-jp)]'
              style={{ letterSpacing: '0.1em' }}
            >
              求人を探す
            </h2>
            {/* ドット装飾 */}
            <div className='flex flex-row gap-7 mt-4'>
              <span className='w-[12px] h-[12px] rounded-full bg-white'></span>
              <span className='w-[12px] h-[12px] rounded-full bg-white'></span>
              <span className='w-[12px] h-[12px] rounded-full bg-white'></span>
            </div>
            {/* === 白背景角丸ボックス === */}
            <div className='bg-white rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] p-[40px] flex flex-col items-center gap-10 mt-16'>
              {/* === Figma準拠：職種・勤務地セレクト2行分 === */}
              <div className='w-full flex flex-col gap-[16px]'>
                {/* 1行目：職種 */}
                <div className='flex flex-row items-center gap-[16px]'>
                  <label className='text-[#323232] font-bold text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] text-left select-none'>
                    職種
                  </label>
                  <div className='relative w-[400px]'>
                    <select className='appearance-none w-full rounded-[5px] border border-[#E0E0E0] px-[11px] py-[11px] text-[#323232] font-medium text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] focus:outline-none focus:ring-2 focus:ring-[#198D76] focus:border-[#198D76]'>
                      <option value=''>選択してください</option>
                      <option value='engineer'>エンジニア</option>
                      <option value='designer'>デザイナー</option>
                      <option value='sales'>営業</option>
                    </select>
                    <svg
                      className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3'
                      viewBox='0 0 24 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M12 15Q12 16 13 15.5L22 2Q23 1 22 0H2Q1 1 2 2L11 15.5Q12 16 12 15Z'
                        fill='#0F9058'
                      />
                    </svg>
                  </div>
                </div>
                {/* 2行目：勤務地 */}
                <div className='flex flex-row items-center gap-[16px]'>
                  <label className='text-[#323232] font-bold text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] text-left select-none'>
                    業種
                  </label>
                  <div className='relative w-[400px]'>
                    <select className='appearance-none w-full rounded-[5px] border border-[#E0E0E0] px-[11px] py-[11px] text-[#323232] font-medium text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] focus:outline-none focus:ring-2 focus:ring-[#198D76] focus:border-[#198D76]'>
                      <option value=''>選択してください</option>
                      <option value='tokyo'>東京</option>
                      <option value='osaka'>大阪</option>
                      <option value='remote'>リモート</option>
                    </select>
                    <svg
                      className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3'
                      viewBox='0 0 24 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M12 15Q12 16 13 15.5L22 2Q23 1 22 0H2Q1 1 2 2L11 15.5Q12 16 12 15Z'
                        fill='#0F9058'
                      />
                    </svg>
                  </div>
                </div>
                {/* 3行目：年収 */}
                <div className='flex flex-row items-center gap-[16px]'>
                  <label className='text-[#323232] font-bold text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] text-left select-none'>
                    年収
                  </label>
                  <div className='relative w-[400px]'>
                    <select className='appearance-none w-full rounded-[5px] border border-[#E0E0E0] px-[11px] py-[11px] text-[#323232] font-medium text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] focus:outline-none focus:ring-2 focus:ring-[#198D76] focus:border-[#198D76]'>
                      <option value=''>選択してください</option>
                      <option value='lt300'>300万円未満</option>
                      <option value='300-500'>300〜500万円</option>
                      <option value='500-800'>500〜800万円</option>
                      <option value='gt800'>800万円以上</option>
                    </select>
                    <svg
                      className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3'
                      viewBox='0 0 24 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M12 15Q12 16 13 15.5L22 2Q23 1 22 0H2Q1 1 2 2L11 15.5Q12 16 12 15Z'
                        fill='#0F9058'
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {/* 求人を探すボタン */}
              <div className='w-full flex justify-center mt-0'>
                <Button variant='green-gradient' size='figma-default'>
                  求人を探す
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* === よくあるご質問セクション === */}
        <section className="bg-[#f9f9f9] py-[120px] flex flex-col items-center relative overflow-hidden">
          {/* 装飾用の丸 */}
          {/* 左上の丸 */}
          <div 
            className="absolute top-[-100px] left-[-100px] w-[200px] h-[200px] bg-[#A3DCBE] rounded-full pointer-events-none opacity-30"
            style={{ filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.05))' }}
          ></div>
          
          {/* 左上の丸の下 */}
          <div 
            className="absolute top-[150px] left-[-50px] w-[150px] h-[150px] bg-[#A3DCBE] rounded-full pointer-events-none opacity-20"
            style={{ filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.05))' }}
          ></div>
          
          {/* 右上の丸 */}
          <div 
            className="absolute top-[-80px] right-[-120px] w-[180px] h-[180px] bg-[#A3DCBE] rounded-full pointer-events-none opacity-25"
            style={{ filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.05))' }}
          ></div>
          
          {/* 右上の丸の下 */}
          <div 
            className="absolute top-[120px] right-[-80px] w-[120px] h-[120px] bg-[#A3DCBE] rounded-full pointer-events-none opacity-15"
            style={{ filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.05))' }}
          ></div>
          
          {/* その下の丸 */}
          <div 
            className="absolute top-[280px] right-[-60px] w-[100px] h-[100px] bg-[#A3DCBE] rounded-full pointer-events-none opacity-10"
            style={{ filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.05))' }}
          ></div>
          
          {/* 背景装飾 */}
          <div className="absolute bottom-[132px] font-['League_Spartan'] font-bold text-[200px] text-white opacity-80 text-center tracking-[20px] left-1/2 transform -translate-x-1/2 translate-y-full leading-[1.8] whitespace-nowrap">
            FREQUENTLY ASKED QUESTIONS
          </div>

          <div className="w-full max-w-[1200px] flex flex-col items-center gap-20">
            {/* セクションタイトル */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-[#0f9058] font-bold text-[32px] leading-[1.6] tracking-[3.2px] text-center font-[family-name:var(--font-noto-sans-jp)]">
                よくあるご質問
              </h2>
              {/* ドット装飾 */}
              <div className="flex flex-row gap-7">
                <span className="w-[12px] h-[12px] rounded-full bg-[#0f9058]"></span>
                <span className="w-[12px] h-[12px] rounded-full bg-[#0f9058]"></span>
                <span className="w-[12px] h-[12px] rounded-full bg-[#0f9058]"></span>
              </div>
            </div>

            {/* FAQ項目 */}
            <div className="flex flex-col gap-4 w-[800px]">
              {/* FAQ 1 */}
              <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-10 py-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="relative w-8 h-8 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#FFF6A9]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#0f9058] font-bold text-[18px] leading-[1.6] tracking-[1.8px] font-[family-name:var(--font-noto-sans-jp)]">
                          Q
                        </span>
                      </div>
                    </div>
                    <h3 className="text-[#0f9058] font-bold text-[18px] leading-[1.6] tracking-[1.8px] font-[family-name:var(--font-noto-sans-jp)]">
                      登録したレジュメは企業からどうみられますか？
                    </h3>
                  </div>
                  <p className="text-[#323232] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]">
                    企業側は、スカウトを送る前では氏名・生年月日・住所・連絡先などの個人を特定できる情報は閲覧できません。氏名や生年月日などの情報の一部は、あなたがスカウトに返信した場合にのみ企業に公開されます。
                  </p>
                </div>
              </div>

              {/* FAQ 2 */}
              <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-10 py-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="relative w-8 h-8 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#FFF6A9]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#0f9058] font-bold text-[18px] leading-[1.6] tracking-[1.8px] font-[family-name:var(--font-noto-sans-jp)]">
                          Q
                        </span>
                      </div>
                    </div>
                    <h3 className="text-[#0f9058] font-bold text-[18px] leading-[1.6] tracking-[1.8px] font-[family-name:var(--font-noto-sans-jp)]">
                      今の在籍企業に転職活動が知られたくないです。
                    </h3>
                  </div>
                  <p className="text-[#323232] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]">
                    現在の勤務先企業からは、自動的にプロフィールが閲覧されない仕組みになっています。
                    <br />
                    さらに、過去の在籍企業や選考中の企業など、特定の企業を「ブロック企業」として設定することも可能ですので安心してご利用いただけます。
                  </p>
                </div>
              </div>

              {/* FAQ 3 */}
              <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-10 py-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="relative w-8 h-8 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#FFF6A9]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#0f9058] font-bold text-[18px] leading-[1.6] tracking-[1.8px] font-[family-name:var(--font-noto-sans-jp)]">
                          Q
                        </span>
                      </div>
                    </div>
                    <h3 className="text-[#0f9058] font-bold text-[18px] leading-[1.6] tracking-[1.8px] font-[family-name:var(--font-noto-sans-jp)]">
                      受け取ったスカウトに返信するとどうなりますか？
                    </h3>
                  </div>
                  <p className="text-[#323232] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]">
                    あなたがスカウトに返信すると、企業の担当者が内容を確認し、面談のご案内が届くことが多いです。
                    <br />
                    なお、返信後は氏名や生年月日などのプロフィール情報が企業に公開されます。
                  </p>
                </div>
              </div>

              {/* FAQ 4 */}
              <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-10 py-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="relative w-8 h-8 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#FFF6A9]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#0f9058] font-bold text-[18px] leading-[1.6] tracking-[1.8px] font-[family-name:var(--font-noto-sans-jp)]">
                          Q
                        </span>
                      </div>
                    </div>
                    <h3 className="text-[#0f9058] font-bold text-[18px] leading-[1.6] tracking-[1.8px] font-[family-name:var(--font-noto-sans-jp)]">
                      エージェントの方から連絡はきますか？
                    </h3>
                  </div>
                  <p className="text-[#323232] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]">
                    エージェント/ヘッドハンターを介さず、企業の採用担当者から直接連絡が届きます。
                  </p>
                </div>
              </div>
            </div>

            {/* 他の質問も見るボタン */}
            <button className="border border-[#0f9058] rounded-[32px] px-10 py-3.5 min-w-40">
              <span className="text-[#0f9058] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]">
                他の質問も見る
              </span>
            </button>
          </div>
        </section>

        {/* === CTA（登録呼びかけ）セクション === */}
        <section className="py-20 flex justify-center items-center relative overflow-visible">
          <div className="relative w-full max-w-[1200px]">
            {/* メインコンテナ - グラデーション背景 */}
            <div className="bg-gradient-to-t from-[#1ca74f] to-[#198d76] rounded-[40px] px-[80px] py-20 flex flex-col items-center gap-10 relative overflow-visible">
              
              {/* メインテキスト */}
              <h2 className="text-white font-bold text-[24px] leading-[1.6] tracking-[2.4px] text-center font-[family-name:var(--font-noto-sans-jp)]">
                登録して、<span className="text-[#fff6a9]">あなたのキャリアのチャンス</span>を広げよう。
              </h2>

              {/* ボタンコンテナ */}
              <div className="flex flex-row gap-6 items-center">
                {/* 新規会員登録ボタン（黄色背景） */}
                <button className="bg-[#FFF6A9] rounded-[10px] px-10 py-3.5 min-w-40 flex items-center gap-2.5 shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]">
                  {/* プロフィールアイコン */}
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-6" fill="none" viewBox="0 0 20 24">
                      <path
                        d="M15.5024 4.58062e-05H7.52794H6.91041L6.47358 0.43603L0.435984 6.47358L0 6.90994V7.52751V19.9735C0 22.1933 1.80628 24 4.02656 24H15.5025C17.7219 24 19.5282 22.1934 19.5282 19.9735V4.02576C19.5281 1.80586 17.7219 4.58062e-05 15.5024 4.58062e-05ZM18.0374 19.9735C18.0374 21.3739 16.9024 22.5092 15.5025 22.5092H4.02656C2.62617 22.5092 1.49081 21.3739 1.49081 19.9735V7.52756H5.41514C6.58148 7.52756 7.52794 6.58148 7.52794 5.41472V1.49076H15.5025C16.9024 1.49076 18.0374 2.62617 18.0374 4.02572V19.9735Z"
                        fill="#323232"
                      />
                      <path
                        d="M13.8289 7.47295C13.4694 7.72453 13.0318 7.87312 12.5608 7.87312C12.0894 7.87312 11.6522 7.72453 11.2923 7.47295C10.6634 7.74365 10.277 8.21836 10.0413 8.63765C9.72824 9.19378 9.97373 9.98104 10.5144 9.98104C11.0558 9.98104 12.5608 9.98104 12.5608 9.98104C12.5608 9.98104 14.0654 9.98104 14.6069 9.98104C15.1479 9.98104 15.3937 9.19378 15.0803 8.63765C14.8446 8.21831 14.4582 7.74365 13.8289 7.47295Z"
                        fill="#0F9058"
                      />
                      <path
                        d="M12.5608 7.34637C13.4853 7.34637 14.2339 6.59773 14.2339 5.67364V5.27267C14.2339 4.34942 13.4853 3.59951 12.5608 3.59951C11.6367 3.59951 10.8872 4.34942 10.8872 5.27267V5.67364C10.8872 6.59773 11.6367 7.34637 12.5608 7.34637Z"
                        fill="#0F9058"
                      />
                      <path
                        d="M15.1092 12.205H4.30946V13.2536H15.1092V12.205Z"
                        fill="#0F9058"
                      />
                      <path
                        d="M15.1638 15.351H4.36405V16.4H15.1638V15.351Z"
                        fill="#0F9058"
                      />
                      <path
                        d="M15.1241 18.4974H7.56406V19.5456H15.1241V18.4974Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                  <span className="text-[#323232] font-bold text-[14px] leading-[2] tracking-[1.4px] font-[family-name:var(--font-noto-sans-jp)]">
                    新規会員登録
                  </span>
                </button>

                {/* 求人を見るボタン（白ボーダー） */}
                <button className="border-2 border-white rounded-[10px] px-10 py-3.5 min-w-40 flex items-center gap-2.5">
                  {/* ボードアイコン */}
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg className="w-[19px] h-6" fill="none" viewBox="0 0 19 24">
                      <path
                        d="M9.12 0C7.1345 0 5.4435 1.25156 4.82125 3H3.04C1.36325 3 0 4.34531 0 6V21C0 22.6547 1.36325 24 3.04 24H15.2C16.8768 24 18.24 22.6547 18.24 21V6C18.24 4.34531 16.8768 3 15.2 3H13.4188C12.7965 1.25156 11.1055 0 9.12 0ZM9.12 3C9.52313 3 9.90975 3.15804 10.1948 3.43934C10.4799 3.72064 10.64 4.10218 10.64 4.5C10.64 4.89782 10.4799 5.27936 10.1948 5.56066C9.90975 5.84196 9.52313 6 9.12 6C8.71687 6 8.33025 5.84196 8.0452 5.56066C7.76014 5.27936 7.6 4.89782 7.6 4.5C7.6 4.10218 7.76014 3.72064 8.0452 3.43934C8.33025 3.15804 8.71687 3 9.12 3ZM3.42 12.75C3.42 12.4516 3.54011 12.1655 3.7539 11.9545C3.96769 11.7435 4.25765 11.625 4.56 11.625C4.86235 11.625 5.15231 11.7435 5.3661 11.9545C5.57989 12.1655 5.7 12.4516 5.7 12.75C5.7 13.0484 5.57989 13.3345 5.3661 13.5455C5.15231 13.7565 4.86235 13.875 4.56 13.875C4.25765 13.875 3.96769 13.7565 3.7539 13.5455C3.54011 13.3345 3.42 13.0484 3.42 12.75ZM8.36 12H14.44C14.858 12 15.2 12.3375 15.2 12.75C15.2 13.1625 14.858 13.5 14.44 13.5H8.36C7.942 13.5 7.6 13.1625 7.6 12.75C7.6 12.3375 7.942 12 8.36 12ZM3.42 17.25C3.42 16.9516 3.54011 16.6655 3.7539 16.4545C3.96769 16.2435 4.25765 16.125 4.56 16.125C4.86235 16.125 5.15231 16.2435 5.3661 16.4545C5.57989 16.6655 5.7 16.9516 5.7 17.25C5.7 17.5484 5.57989 17.8345 5.3661 18.0455C5.15231 18.2565 4.86235 18.375 4.56 18.375C4.25765 18.375 3.96769 18.2565 3.7539 18.0455C3.54011 17.8345 3.42 17.5484 3.42 17.25ZM7.6 17.25C7.6 16.8375 7.942 16.5 8.36 16.5H14.44C14.858 16.5 15.2 16.8375 15.2 17.25C15.2 17.6625 14.858 18 14.44 18H8.36C7.942 18 7.6 17.6625 7.6 17.25Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-bold text-[14px] leading-[2] tracking-[1.4px] font-[family-name:var(--font-noto-sans-jp)]">
                    求人を見る
                  </span>
                </button>
              </div>

              {/* 装飾的な円要素 - スクリーンショットに忠実な配置 */}
              
              {/* 左上の大きな黄緑円（大幅にはみ出し） */}
              <div className="absolute left-[-150px] top-[-100px] w-[220px] h-[220px] bg-[#A8D36A] rounded-full opacity-60"></div>
              
              {/* 右上の小さな黄緑円 */}
              <div className="absolute right-[60px] top-[-20px] w-[60px] h-[60px] bg-[#7BC461] rounded-full opacity-75"></div>
              
              {/* 右中央の緑円 */}
              <div className="absolute right-[-10px] top-[50px] w-[90px] h-[90px] bg-[#4DB592] rounded-full opacity-70"></div>
              
              {/* 右下の大きな黄緑円（大幅にはみ出し） */}
              <div className="absolute right-[-120px] bottom-[-80px] w-[180px] h-[180px] bg-[#A8D36A] rounded-full opacity-60"></div>
              
              {/* 左下の小さな緑円（はみ出し） */}
              <div className="absolute left-[-25px] bottom-[-60px] w-[80px] h-[80px] bg-[#4DB592] rounded-full opacity-70"></div>

            </div>
          </div>
        </section>

        {/* === コラムセクション === */}
        <section className="bg-white py-[80px] flex flex-col items-center relative overflow-hidden">
          {/* 背景装飾テキスト */}
          <div className="absolute bottom-[131.778px] font-['League_Spartan'] font-bold text-[200px] text-[#F0F0F0] opacity-80 text-center tracking-[20px] left-1/2 transform -translate-x-1/2 translate-y-full leading-[1.8] whitespace-nowrap -z-10">
            MEDIA ARTICLES
          </div>

          <div className="w-full max-w-[1200px] flex flex-col items-center relative z-10 px-5">
            {/* セクションタイトル */}
            <div className="flex flex-col items-center">
              <h2 className="font-bold text-[32px] leading-[1.6] tracking-[3.2px] text-center text-[#0f9058] font-[family-name:var(--font-noto-sans-jp)]">
                コラム
              </h2>
              {/* ドット装飾 */}
              <div className="flex flex-row gap-7 mt-4">
                <span className="w-[12px] h-[12px] rounded-full bg-[#0f9058]"></span>
                <span className="w-[12px] h-[12px] rounded-full bg-[#0f9058]"></span>
                <span className="w-[12px] h-[12px] rounded-full bg-[#0f9058]"></span>
              </div>
            </div>

            {/* コラムカードグリッド */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
              {columnData.map((card, index) => (
                <ColumnCard
                  key={index}
                  imageUrl={card.imageUrl}
                  title={card.title}
                  categories={card.categories}
                />
              ))}
            </div>

            {/* 他のコラムも見るボタン */}
            <div className="mt-14">
              <button className="border border-[#0f9058] rounded-[32px] px-10 py-3.5 min-w-40">
                <span className="text-[#0f9058] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]">
                  他のコラムも見る
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}