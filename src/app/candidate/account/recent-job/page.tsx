import { redirect } from 'next/navigation';
import { getCachedCandidateUser } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import { getRecentJobData } from './edit/actions';
import EditButton from '@/components/candidate/account/EditButton';

// 候補者_職務経歴確認ページ
export default async function CandidateRecentJobPage() {
  // レイアウトで認証済みのため、キャッシュされた結果を使用
  const user = await getCachedCandidateUser();
  if (!user) {
    redirect('/candidate/auth/login');
  }

  // 候補者データを取得
  const candidateData = await getCandidateData(user.id);
  if (!candidateData) {
    redirect('/candidate/auth/login');
  }

  // 職歴データを取得
  const jobData = await getRecentJobData();
  const jobHistories = jobData?.jobHistories || [];

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
            className='bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'
          >
            {typeof item === 'string' ? item : item.name || item}
          </span>
        ))}
      </div>
    );
  };

  // 職歴期間の表示
  const renderPeriod = (jobHistory: any) => {
    const startYear = jobHistory.startYear;
    const startMonth = jobHistory.startMonth;
    const endYear = jobHistory.endYear;
    const endMonth = jobHistory.endMonth;
    const isCurrentlyWorking = jobHistory.isCurrentlyWorking;

    if (!startYear || !startMonth) {
      return (
        <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
          未設定
        </span>
      );
    }

    return (
      <div className='flex flex-col gap-1'>
        {/* 基本の期間表示 */}
        <div className='flex flex-wrap items-center gap-1 text-[12px] md:text-[14px] lg:text-[16px] text-[#323232] tracking-[1.2px]'>
          <span className='font-medium'>{startYear}</span>
          <span className='font-bold'>年</span>
          <span className='font-medium'>{startMonth.padStart(2, '0')}</span>
          <span className='font-bold'>月</span>
          <span className='font-medium mx-2'>〜</span>
          {isCurrentlyWorking ? (
            <span className='font-bold'>在籍中</span>
          ) : (
            <>
              <span className='font-medium'>{endYear || 'YYYY'}</span>
              <span className='font-bold'>年</span>
              <span className='font-medium'>
                {endMonth ? endMonth.padStart(2, '0') : 'MM'}
              </span>
              <span className='font-bold'>月</span>
            </>
          )}
        </div>
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
          <div className='flex flex-wrap items-center gap-2 mb-2 lg:mb-4'>
            <span className='text-white text-[14px] font-bold tracking-[1.4px]'>
              プロフィール確認・編集
            </span>
            <svg
              width='8'
              height='8'
              viewBox='0 0 8 8'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='flex-shrink-0'
            >
              <path
                d='M3 1L6 4L3 7'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='text-white text-[14px] font-bold tracking-[1.4px]'>
              職務経歴
            </span>
          </div>

          {/* タイトル */}
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center'>
              {/* プロフィールアイコン */}
              <svg
                width='28'
                height='32'
                viewBox='0 0 28 32'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M6.34868 0H16.9813H17.8047L18.3871 0.581312L26.4372 8.63138L27.0186 9.21319V10.0366V26.6313C27.0186 29.5911 24.6102 32 21.6498 32H6.34862C3.38936 32 0.98099 29.5911 0.98099 26.6313V5.36763C0.981053 2.40775 3.38937 0 6.34868 0ZM2.96874 26.6313C2.96874 28.4984 4.48199 30.0123 6.34862 30.0123H21.6498C23.517 30.0123 25.0308 28.4984 25.0308 26.6313V10.0367H19.7984C18.2432 10.0367 16.9813 8.77525 16.9813 7.21956V1.98763H6.34862C4.48199 1.98763 2.96874 3.5015 2.96874 5.36756V26.6313Z'
                  fill='white'
                />
                <path
                  d='M8.58029 9.96484C9.05954 10.3003 9.64304 10.4984 10.271 10.4984C10.8995 10.4984 11.4825 10.3003 11.9624 9.96484C12.801 10.3258 13.3161 10.9587 13.6304 11.5178C14.0478 12.2593 13.7205 13.309 12.9996 13.309C12.2777 13.309 10.271 13.309 10.271 13.309C10.271 13.309 8.26492 13.309 7.54298 13.309C6.8216 13.309 6.49379 12.2593 6.91173 11.5178C7.22604 10.9587 7.74117 10.3258 8.58029 9.96484Z'
                  fill='white'
                />
                <path
                  d='M10.2711 9.79659C9.03838 9.79659 8.04019 8.79841 8.04019 7.56628V7.03166C8.04019 5.80066 9.03838 4.80078 10.2711 4.80078C11.5032 4.80078 12.5024 5.80066 12.5024 7.03166V7.56628C12.5024 8.79841 11.5031 9.79659 10.2711 9.79659Z'
                  fill='white'
                />
                <path
                  d='M6.87283 16.2734H21.2725V17.6716H6.87283V16.2734Z'
                  fill='white'
                />
                <path
                  d='M6.80008 20.4688H21.1997V21.8675H6.80008V20.4688Z'
                  fill='white'
                />
                <path
                  d='M6.85304 24.6641H16.9331V26.0618H6.85304V24.6641Z'
                  fill='white'
                />
              </svg>
            </div>
            <h1 className='text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]'>
              職務経歴
            </h1>
          </div>
        </div>

        {/* コンテンツ部分 */}
        <div className='bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]'>
          <div className='flex flex-col items-center gap-6 lg:gap-10'>
            {/* 職務経歴カード */}
            <div className='bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]'>
              {/* 職務経歴データ */}
              <div className='space-y-5 lg:space-y-6'>
                {jobHistories.length > 0 ? (
                  jobHistories.map((jobHistory, index) => (
                    <div key={index}>
                      <div className='space-y-5 lg:space-y-2'>
                        {/* 会社名 */}
                        <div className='flex flex-col lg:flex-row lg:gap-6'>
                          <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                            <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                              企業名
                            </div>
                          </div>
                          <div className='px-2 lg:px-0 lg:py-6 lg:flex-1'>
                            <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px]'>
                              {jobHistory.companyName || '未設定'}
                            </div>
                          </div>
                        </div>

                        {/* 部署名・役職名 */}
                        <div className='flex flex-col lg:flex-row lg:gap-6'>
                          <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                            <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                              部署名・役職名
                            </div>
                          </div>
                          <div className='px-2 lg:px-0 lg:py-6 lg:flex-1'>
                            <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px]'>
                              {jobHistory.departmentPosition || '未設定'}
                            </div>
                          </div>
                        </div>

                        {/* 在籍期間 */}
                        <div className='flex flex-col lg:flex-row lg:gap-6'>
                          <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                            <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                              在籍期間
                            </div>
                          </div>
                          <div className='px-2 lg:px-0 lg:py-6 lg:flex-1'>
                            {renderPeriod(jobHistory)}
                          </div>
                        </div>

                        {/* 業種 */}
                        <div className='flex flex-col lg:flex-row lg:gap-6'>
                          <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                            <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                              業種
                            </div>
                          </div>
                          <div className='px-2 lg:px-0 lg:py-6 lg:flex-1'>
                            {renderTags(jobHistory.industries)}
                          </div>
                        </div>

                        {/* 職種 */}
                        <div className='flex flex-col lg:flex-row lg:gap-6'>
                          <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                            <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                              職種
                            </div>
                          </div>
                          <div className='px-2 lg:px-0 lg:py-6 lg:flex-1'>
                            {renderTags(jobHistory.jobTypes)}
                          </div>
                        </div>

                        {/* 業務内容 */}
                        <div className='flex flex-col lg:flex-row lg:gap-6'>
                          <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-start lg:items-center mb-2 lg:mb-0'>
                            <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px] py-2 lg:py-0'>
                              業務内容
                            </div>
                          </div>
                          <div className='px-2 lg:px-0 lg:py-6 lg:flex-1'>
                            <div className='text-[16px] text-[#323232] font-medium tracking-[1.6px] leading-relaxed'>
                              {jobHistory.jobDescription || '未設定'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className='text-center py-10'>
                      <div className='text-[16px] text-[#999999] font-medium tracking-[1.6px]'>
                        職務経歴が登録されていません
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 編集ボタン */}
            <EditButton editPath='/candidate/account/recent-job/edit' />
          </div>
        </div>
      </main>
    </>
  );
}

export const dynamic = 'force-dynamic';
