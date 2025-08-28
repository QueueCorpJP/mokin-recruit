import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function CTASection() {
  const cards = [
    {
      title: '資料請求',
      description: [
        'サービス概要やどんな内容か知りたい',
        '他媒体との違いを知りたい',
        'どんな人材がいるのか知りたい'
      ],
      buttonText: '資料請求する',
      image: '/images/document.png' // 後で画像を追加
    },
    {
      title: 'サービス利用面談',
      description: [
        '利用イメージやどう活用できるのか相談',
        '現状の採用課題を相談する',
        'サービスを利用する為直接質問したい'
      ],
      buttonText: '面談予約する',
      image: '/images/contact.png' // 後で画像を追加
    }
  ];

  return (
    <section className='py-0 flex justify-center items-center relative overflow-visible'>
      <div className='relative w-full max-w-[1360px]'>
        {/* メインコンテナ - グラデーション背景 */}
        <div 
          className='md:py-[80px] md:px-[80px] py-[40px] px-[24px] flex flex-col items-center gap-10 relative overflow-hidden min-h-[700px] md:min-h-[500px]'
          style={{ background: 'linear-gradient(0deg, #17856F 0%, #229A4E 100%)' }}>
          {/* bar.png を絶対配置で下部に配置 - 固定サイズ、中央配置 */}
          <img 
            src="/bar.png" 
            alt="" 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{ 
              width: '1360px',
              height: 'auto',
              maxWidth: 'none'
            }}
          />
          
          {/* カードコンテナ */}
          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 w-full justify-center items-stretch">
            {cards.map((card, index) => (
              <div 
                key={index}
                className="bg-white rounded-[10px] p-[24px] md:p-[40px] flex flex-col gap-10 items-center justify-between w-full md:w-[350px] md:min-h-[600px] min-h-[400px] shadow-lg"
              >
                <div className='flex md:flex-col flex-row items-center justify-between w-full'>
                {/* タイトル */}
                <h3 className="font-bold text-[#0f9058] text-[24px] text-center tracking-[2.4px] leading-[1.6] font-[family-name:var(--font-noto-sans-jp)]">
                  {card.title}
                </h3>
                
                {/* 画像 */}
                <div className="w-[100px] md:w-full h-[100px] md:h-[auto] flex items-center justify-end">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-[100px] md:w-full h-[67px] md:h-[auto] object-contain"
                  />
                </div>
                </div>
                {/* 説明テキスト */}
                <ul className="w-full space-y-2 flex-1">
                  {card.description.map((item, idx) => (
                    <li key={idx} className="font-bold text-[16px] text-[#262626] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]">
                      ・{item}
                    </li>
                  ))}
                </ul>
                
                {/* ボタン */}
                <Button 
                  variant="green-gradient"
                  size="figma-default"
                  className="min-w-[160px] mt-auto md:w-auto w-full text-center"
                >
                  {card.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}