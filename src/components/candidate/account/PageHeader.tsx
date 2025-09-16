import Breadcrumb from './Breadcrumb';

interface PageHeaderProps {
  breadcrumb: string;
  title: string;
}

export default function PageHeader({ breadcrumb, title }: PageHeaderProps) {
  return (
    <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10'>
      {/* パンくずリスト */}
      <Breadcrumb
        items={[
          { label: 'プロフィール確認・編集', href: '/candidate/mypage' },
          { label: breadcrumb },
        ]}
      />

      {/* タイトル */}
      <div className='flex items-center gap-2 lg:gap-4'>
        <div className='w-6 h-6 lg:w-8 lg:h-8'>
          {/* プロフィールアイコン */}
          <svg
            width='32'
            height='32'
            viewBox='0 0 32 32'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='w-6 h-6 lg:w-8 lg:h-8'
          >
            <path
              d='M8.34868 0H18.9813H19.8047L20.3871 0.581312L28.4372 8.63138L29.0186 9.21319V10.0366V26.6313C29.0186 29.5911 26.6102 32 23.6498 32H8.34862C5.38936 32 2.98099 29.5911 2.98099 26.6313V5.36763C2.98105 2.40775 5.38937 0 8.34868 0ZM4.96874 26.6313C4.96874 28.4984 6.48199 30.0123 8.34862 30.0123H23.6498C25.517 30.0123 27.0308 28.4984 27.0308 26.6313V10.0367H21.7984C20.2432 10.0367 18.9813 8.77525 18.9813 7.21956V1.98763H8.34862C6.48199 1.98763 4.96874 3.5015 4.96874 5.36756V26.6313Z'
              fill='white'
            />
            <path
              d='M10.5803 9.96484C11.0595 10.3003 11.643 10.4984 12.271 10.4984C12.8995 10.4984 13.4825 10.3003 13.9624 9.96484C14.801 10.3258 15.3161 10.9587 15.6304 11.5178C16.0478 12.2593 15.7205 13.309 14.9996 13.309C14.2777 13.309 12.271 13.309 12.271 13.309C12.271 13.309 10.2649 13.309 9.54298 13.309C8.8216 13.309 8.49379 12.2593 8.91173 11.5178C9.22604 10.9587 9.74117 10.3258 10.5803 9.96484Z'
              fill='white'
            />
            <path
              d='M12.2711 9.79659C11.0384 9.79659 10.0402 8.79841 10.0402 7.56628V7.03166C10.0402 5.80066 11.0384 4.80078 12.2711 4.80078C13.5032 4.80078 14.5024 5.80066 14.5024 7.03166V7.56628C14.5024 8.79841 13.5031 9.79659 12.2711 9.79659Z'
              fill='white'
            />
            <path
              d='M8.87283 16.2734H23.2725V17.6716H8.87283V16.2734Z'
              fill='white'
            />
            <path
              d='M8.80008 20.4688H23.1997V21.8675H8.80008V20.4688Z'
              fill='white'
            />
            <path
              d='M8.85304 24.6641H18.9331V26.0618H8.85304V24.6641Z'
              fill='white'
            />
          </svg>
        </div>
        <h1 className='text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]'>
          {title}
        </h1>
      </div>
    </div>
  );
}
