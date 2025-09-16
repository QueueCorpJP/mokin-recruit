import { redirect } from 'next/navigation';
import { getCachedCandidateUser } from '@/lib/auth/server';
import {
  getCandidateData,
  getSkillsData,
} from '@/lib/server/candidate/candidateData';
import EditButton from '@/components/candidate/account/EditButton';
import Breadcrumb from '@/components/candidate/account/Breadcrumb';

// 候補者_資格・語学・スキル確認ページ
export default async function CandidateSkillsPage() {
  // レイアウトで認証済みのため、キャッシュされた結果を使用
  const user = await getCachedCandidateUser();
  if (!user) {
    redirect('/candidate/auth/login');
  }

  // 候補者データを取得
  const candidateData = await getCandidateData(user.id);
  const skillsData = await getSkillsData(user.id);

  if (!candidateData) {
    redirect('/candidate/auth/login');
  }

  // 配列データを安全に処理する関数
  const renderTags = (data: any) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return (
        <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
          未設定
        </span>
      );
    }

    const items = Array.isArray(data) ? data : [];
    return (
      <div className='flex flex-wrap gap-2'>
        {items.map((item: any, idx: number) => (
          <span
            key={idx}
            className='bg-[#d2f1da] px-3 py-1.5 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'
          >
            {typeof item === 'string' ? item : item.name || item}
          </span>
        ))}
      </div>
    );
  };

  // その他の言語を表示する関数
  const renderOtherLanguages = (otherLanguages: any) => {
    if (
      !otherLanguages ||
      (Array.isArray(otherLanguages) && otherLanguages.length === 0)
    ) {
      return (
        <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'>
          未設定
        </span>
      );
    }

    const languages = Array.isArray(otherLanguages) ? otherLanguages : [];

    return (
      <div className='space-y-2'>
        {languages.map((lang: any, idx: number) => (
          <div key={idx} className='space-y-2'>
            <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-[2]'>
              {lang.language || '言語名未設定'}
            </div>
            <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-[2]'>
              {lang.level || 'レベル未設定'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* メインコンテンツ */}
      <main className='flex-1 relative z-[2]'>
        {/* 緑のグラデーション背景のヘッダー部分 */}
        <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10'>
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: 'プロフィール確認・編集', href: '/candidate/mypage' },
              { label: '語学・スキル' },
            ]}
          />

          {/* タイトル */}
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center'>
              {/* プロフィールアイコン */}
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M6.26175 0H14.2362H14.8538L15.2906 0.435984L21.3282 6.47353L21.7642 6.90989V7.52747V19.9734C21.7642 22.1933 19.9579 24 17.7376 24H6.26171C4.04227 24 2.23599 22.1933 2.23599 19.9734V4.02572C2.23604 1.80581 4.04227 0 6.26175 0ZM3.7268 19.9734C3.7268 21.3738 4.86174 22.5092 6.26171 22.5092H17.7376C19.138 22.5092 20.2733 21.3738 20.2733 19.9734V7.52752H16.349C15.1827 7.52752 14.2362 6.58144 14.2362 5.41467V1.49072H6.26171C4.86174 1.49072 3.7268 2.62612 3.7268 4.02567V19.9734Z'
                  fill='white'
                />
                <path
                  d='M7.93522 7.47266C8.29466 7.72423 8.73228 7.87283 9.20328 7.87283C9.67466 7.87283 10.1119 7.72423 10.4718 7.47266C11.1007 7.74336 11.4871 8.21806 11.7228 8.63736C12.0358 9.19348 11.7904 9.98075 11.2497 9.98075C10.7083 9.98075 9.20328 9.98075 9.20328 9.98075C9.20328 9.98075 7.69869 9.98075 7.15724 9.98075C6.6162 9.98075 6.37034 9.19348 6.6838 8.63736C6.91953 8.21802 7.30588 7.74336 7.93522 7.47266Z'
                  fill='white'
                />
                <path
                  d='M9.20342 7.34452C8.27891 7.34452 7.53027 6.59588 7.53027 5.67178V5.27081C7.53027 4.34756 8.27891 3.59766 9.20342 3.59766C10.1275 3.59766 10.877 4.34756 10.877 5.27081V5.67178C10.877 6.59588 10.1275 7.34452 9.20342 7.34452Z'
                  fill='white'
                />
                <path
                  d='M6.65487 12.2031H17.4546V13.2518H6.65487V12.2031Z'
                  fill='white'
                />
                <path
                  d='M6.60018 15.3516H17.3999V16.4006H6.60018V15.3516Z'
                  fill='white'
                />
                <path
                  d='M6.64015 18.4961H14.2002V19.5444H6.64015V18.4961Z'
                  fill='white'
                />
              </svg>
            </div>
            <h1 className='text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]'>
              語学・スキル
            </h1>
          </div>
        </div>

        {/* コンテンツ部分 */}
        <div className='bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]'>
          <div className='flex flex-col items-center gap-6 lg:gap-10'>
            <div className='bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]'>
              {/* 語学セクション */}
              <div className='mb-6 lg:mb-6'>
                <div className='mb-2'>
                  <h2 className='text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]'>
                    語学
                  </h2>
                </div>
                <div className='border-b border-[#dcdcdc] mb-6 lg:mb-2'></div>

                <div className='space-y-6 lg:space-y-2'>
                  {/* 英語 */}
                  <div className='flex flex-col lg:flex-row lg:gap-6'>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                        英語
                      </div>
                    </div>
                    <div className='px-4 lg:px-0 lg:py-6 lg:flex-1'>
                      <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-[2]'>
                        {skillsData?.english_level || '未設定'}
                      </div>
                    </div>
                  </div>

                  {/* その他の言語 */}
                  <div className='flex flex-col lg:flex-row lg:gap-6'>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                        その他の言語
                      </div>
                    </div>
                    <div className='px-4 lg:px-0 lg:py-6 lg:flex-1'>
                      {renderOtherLanguages(skillsData?.other_languages)}
                    </div>
                  </div>
                </div>
              </div>

              {/* スキルセクション */}
              <div>
                <div className='mb-2'>
                  <h2 className='text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]'>
                    スキル
                  </h2>
                </div>
                <div className='border-b border-[#dcdcdc] mb-6 lg:mb-2'></div>

                <div className='space-y-6 lg:space-y-2'>
                  {/* スキル */}
                  <div className='flex flex-col lg:flex-row lg:gap-6'>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                        スキル
                      </div>
                    </div>
                    <div className='px-4 lg:px-0 lg:py-6 lg:flex-1'>
                      {renderTags(
                        skillsData?.skills_list || candidateData.skills
                      )}
                    </div>
                  </div>

                  {/* 保有資格 */}
                  <div className='flex flex-col lg:flex-row lg:gap-6'>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-start lg:items-center mb-2 lg:mb-0'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px] py-2 lg:py-0'>
                        保有資格
                      </div>
                    </div>
                    <div className='px-4 lg:px-0 lg:py-6 lg:flex-1'>
                      <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-[2] whitespace-pre-wrap'>
                        {skillsData?.qualifications || '未設定'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 編集ボタン */}
            <EditButton editPath='/candidate/account/skills/edit' />
          </div>
        </div>
      </main>
    </>
  );
}
