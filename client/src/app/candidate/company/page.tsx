import JobDetailCommonSection from '@/components/ui/JobDetailCommonSection';
import { PublishedJobListSection } from '@/components/ui/PublishedJobListSection';

export default function CandidateCompanyPage() {
  // ダミーデータ
  const dummyData = {
    title: 'フロントエンドエンジニア',
    companyName: '株式会社サンプル',
    images: ['/company.jpg', '/company.jpg'],
    jobDescription:
      'React/Next.jsを用いたWebアプリケーション開発を担当していただきます。',
    positionSummary: '自社サービスの新規立ち上げに携われるポジションです。',
    skills: '・React/Next.jsの開発経験\n・TypeScriptの利用経験',
    otherRequirements: '・チームでの開発経験\n・コミュニケーション能力',
    representative: '山田 太郎',
    establishedYear: '2010',
    capital: '5000',
    employeeCount: '100',
    industry: 'IT・Webサービス、ソフトウェア',
    businessContent: 'Webサービスの企画・開発・運営',
    address: '東京都渋谷区1-2-3',
    companyPhase: '成長期',
    website: 'https://sample.co.jp',
  };

  return (
    <div className='min-h-screen bg-[#f9f9f9] py-10 pb-20 px-4 lg:px-20'>
      <div className='max-w-[1280px] mx-auto'>
        {/* 見出しセクション：56pxグレー円＋16px間隔＋32px/160%/字間10%/緑色太字テキスト */}
        <div className='flex items-center mb-[40px]'>
          <div className='w-[56px] h-[56px] rounded-full bg-[#dcdcdc] flex-shrink-0' />
          <span
            className="ml-[16px] font-bold text-[20px] lg:text-[32px] leading-[1.6] tracking-[0.1em] font-['Noto_Sans_JP']"
            style={{ color: '#0F9058' }}
          >
            企業情報
          </span>
        </div>
        <JobDetailCommonSection
          {...dummyData}
          showCompanyNameInSidebar={false}
          hideSubHeadings={true}
        />
        {/* 掲載求人（Client Componentで分離、margin-top:80px） */}
        <PublishedJobListSection
          jobs={[
            {
              imageUrl: 'https://placehold.jp/477x318.png',
              imageAlt: 'サンプル求人画像',
              title: '注目のフルスタックエンジニア募集！1',
              tags: ['リモート可', '急成長', '自社サービス'],
              companyName: '株式会社イノベーション',
              location: ['東京都', 'リモート'],
              salary: '年収800万円〜1200万円',
              apell: ['新規事業', '裁量大', 'フレックス'],
              starred: false,
              jobId: 'sample-job-1',
            },
            {
              imageUrl: 'https://placehold.jp/477x318.png',
              imageAlt: 'サンプル求人画像',
              title: '注目のフルスタックエンジニア募集！2',
              tags: ['リモート可', '急成長', '自社サービス'],
              companyName: '株式会社イノベーション',
              location: ['東京都', 'リモート'],
              salary: '年収800万円〜1200万円',
              apell: ['新規事業', '裁量大', 'フレックス'],
              starred: false,
              jobId: 'sample-job-2',
            },
            {
              imageUrl: 'https://placehold.jp/477x318.png',
              imageAlt: 'サンプル求人画像',
              title: '注目のフルスタックエンジニア募集！3',
              tags: ['リモート可', '急成長', '自社サービス'],
              companyName: '株式会社イノベーション',
              location: ['東京都', 'リモート'],
              salary: '年収800万円〜1200万円',
              apell: ['新規事業', '裁量大', 'フレックス'],
              starred: false,
              jobId: 'sample-job-3',
            },
          ]}
          style={{ marginTop: 80 }}
          variant='simple'
        />
      </div>
    </div>
  );
}