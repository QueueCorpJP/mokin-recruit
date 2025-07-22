import { ColumnCard } from '@/components/ui/ColumnCard';

export function ColumnSection() {
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
    <section className='bg-[#f9f9f9] py-[120px] flex flex-col items-center relative'>
      {/* 背景装飾テキスト */}
      <div className="absolute bottom-[270px] font-['League_Spartan'] font-bold text-[200px] text-[#ffffff] opacity-80 text-center tracking-[20px] left-1/2 transform -translate-x-1/2 translate-y-full leading-[1.8] whitespace-nowrap z-0 pointer-events-none select-none">
        MEDIA ARTICLES
      </div>

      <div className='w-full max-w-[1200px] flex flex-col items-center relative z-10 px-5'>
        {/* セクションタイトル */}
        <div className='flex flex-col items-center'>
          <h2 className='font-bold text-[32px] leading-[1.6] tracking-[3.2px] text-center text-[#0f9058] font-[family-name:var(--font-noto-sans-jp)]'>
            コラム
          </h2>
          {/* ドット装飾 */}
          <div className='flex flex-row gap-7 mt-4'>
            <span className='w-[12px] h-[12px] rounded-full bg-[#0f9058]'></span>
            <span className='w-[12px] h-[12px] rounded-full bg-[#0f9058]'></span>
            <span className='w-[12px] h-[12px] rounded-full bg-[#0f9058]'></span>
          </div>
        </div>

        {/* コラムカードグリッド */}
        <div className='mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full'>
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
        <div className='mt-14'>
          <button className='border border-[#0f9058] rounded-[32px] px-10 py-3.5 min-w-40 transition-colors duration-200 hover:bg-[#0F9058]/20'>
            <span className='text-[#0f9058] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]'>
              他のコラムも見る
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
